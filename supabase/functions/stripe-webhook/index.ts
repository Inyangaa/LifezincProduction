import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const crypto = globalThis.crypto;

async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const parts = signature.split(',');
  
  let timestamp = '';
  let signatureHash = '';
  
  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1') signatureHash = value;
  }
  
  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload)
  );
  
  const computedSignature = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return computedSignature === signatureHash;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    const signature = req.headers.get('stripe-signature');
    const payload = await req.text();

    if (webhookSecret && signature) {
      const isValid = await verifyStripeSignature(payload, signature, webhookSecret);
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }
    }

    const event = JSON.parse(payload);
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const planType = session.metadata?.plan_type;

        if (!userId) {
          console.error('No user ID in session metadata');
          break;
        }

        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionResponse = await fetch(
            `https://api.stripe.com/v1/subscriptions/${session.subscription}`,
            {
              headers: {
                'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
              },
            }
          );

          if (subscriptionResponse.ok) {
            const subscription = await subscriptionResponse.json();
            const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();

            const { error } = await supabase
              .from('user_preferences')
              .update({
                is_premium: true,
                premium_plan: planType,
                premium_source: 'stripe',
                premium_expires_at: expiresAt,
                stripe_customer_id: session.customer,
              })
              .eq('user_id', userId);

            if (error) {
              console.error('Error updating user preferences:', error);
            } else {
              console.log(`Premium activated for user ${userId}, plan: ${planType}, expires: ${expiresAt}`);
            }
          }
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;

        if (!subscriptionId) break;

        const { data: userPref } = await supabase
          .from('user_preferences')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (userPref) {
          const subscriptionResponse = await fetch(
            `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
            {
              headers: {
                'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
              },
            }
          );

          if (subscriptionResponse.ok) {
            const subscription = await subscriptionResponse.json();
            const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();

            await supabase
              .from('user_preferences')
              .update({
                is_premium: true,
                premium_expires_at: expiresAt,
              })
              .eq('user_id', userPref.user_id);

            console.log(`Premium renewed for customer ${customerId}, expires: ${expiresAt}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { data: userPref } = await supabase
          .from('user_preferences')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (userPref) {
          const isActive = subscription.status === 'active';
          const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();

          await supabase
            .from('user_preferences')
            .update({
              is_premium: isActive,
              premium_expires_at: isActive ? expiresAt : null,
            })
            .eq('user_id', userPref.user_id);

          console.log(`Subscription updated for customer ${customerId}, status: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { data: userPref } = await supabase
          .from('user_preferences')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (userPref) {
          await supabase
            .from('user_preferences')
            .update({
              is_premium: false,
              premium_expires_at: null,
            })
            .eq('user_id', userPref.user_id);

          console.log(`Subscription cancelled for customer ${customerId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const { data: userPref } = await supabase
          .from('user_preferences')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (userPref) {
          await supabase
            .from('user_preferences')
            .update({
              is_premium: false,
              premium_expires_at: null,
            })
            .eq('user_id', userPref.user_id);

          console.log(`Payment failed for customer ${customerId}, premium access revoked`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Webhook processing failed'
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
