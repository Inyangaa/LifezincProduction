import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutRequest {
  plan: 'monthly' | 'yearly';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // STEP 1: Validate all required environment variables
    console.log('[create-checkout-session] Checking environment variables...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePriceMonthly = Deno.env.get('STRIPE_PRICE_MONTHLY');
    const stripePriceYearly = Deno.env.get('STRIPE_PRICE_YEARLY');
    const appOrigin = Deno.env.get('APP_ORIGIN') || 'https://www.lifezinc.com';

    const missingVars: string[] = [];
    if (!supabaseUrl) missingVars.push('SUPABASE_URL');
    if (!supabaseKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!stripeSecretKey) missingVars.push('STRIPE_SECRET_KEY');
    if (!stripePriceMonthly) missingVars.push('STRIPE_PRICE_MONTHLY');
    if (!stripePriceYearly) missingVars.push('STRIPE_PRICE_YEARLY');

    if (missingVars.length > 0) {
      console.error('[create-checkout-session] Missing environment variables:', missingVars);
      return new Response(
        JSON.stringify({
          error: 'Server configuration error',
          details: `Missing required environment variables: ${missingVars.join(', ')}`,
          missingVars,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('[create-checkout-session] All environment variables present');

    // STEP 2: Validate Authorization header
    console.log('[create-checkout-session] Checking authorization...');
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[create-checkout-session] No Authorization header found');
      return new Response(
        JSON.stringify({
          error: 'Authentication required',
          details: 'No Authorization header provided',
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('[create-checkout-session] Authorization header present, verifying user...');
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('[create-checkout-session] User verification failed:', userError?.message);
      return new Response(
        JSON.stringify({
          error: 'Invalid authentication',
          details: userError?.message || 'Could not verify user token',
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('[create-checkout-session] User verified:', user.id);

    // STEP 3: Parse and validate request body
    console.log('[create-checkout-session] Parsing request body...');
    const { plan }: CheckoutRequest = await req.json();
    console.log('[create-checkout-session] Requested plan:', plan);

    if (plan !== 'monthly' && plan !== 'yearly') {
      console.error('[create-checkout-session] Invalid plan type:', plan);
      return new Response(
        JSON.stringify({
          error: 'Invalid plan',
          details: `Plan must be 'monthly' or 'yearly', received: ${plan}`,
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

    const priceId = plan === 'monthly' ? stripePriceMonthly : stripePriceYearly;
    console.log('[create-checkout-session] Using Stripe Price ID:', priceId?.substring(0, 20) + '...');

    // STEP 4: Get or create Stripe customer
    console.log('[create-checkout-session] Fetching user preferences for Stripe customer ID...');
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = preferences?.stripe_customer_id;

    if (!customerId) {
      console.log('[create-checkout-session] No Stripe customer found, creating new customer...');
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'email': user.email || '',
          'metadata[user_id]': user.id,
        }),
      });

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('[create-checkout-session] Stripe customer creation failed:', errorText);
        return new Response(
          JSON.stringify({
            error: 'Failed to create Stripe customer',
            details: errorText,
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const customer = await customerResponse.json();
      customerId = customer.id;
      console.log('[create-checkout-session] Stripe customer created:', customerId);

      await supabase
        .from('user_preferences')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id);
    } else {
      console.log('[create-checkout-session] Using existing Stripe customer:', customerId);
    }

    // STEP 5: Create Stripe checkout session
    console.log('[create-checkout-session] Creating Stripe checkout session...');
    const checkoutParams = new URLSearchParams({
      'mode': 'subscription',
      'payment_method_types[]': 'card',
      'line_items[0][price]': priceId!,
      'line_items[0][quantity]': '1',
      'success_url': `${appOrigin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${appOrigin}/upgrade?canceled=1`,
      'customer': customerId,
      'metadata[user_id]': user.id,
      'metadata[plan_type]': plan,
    });

    console.log('[create-checkout-session] Checkout params:', {
      mode: 'subscription',
      priceId: priceId?.substring(0, 20) + '...',
      customerId,
      successUrl: `${appOrigin}/upgrade/success`,
      cancelUrl: `${appOrigin}/upgrade`,
    });

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: checkoutParams,
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('[create-checkout-session] Stripe checkout session creation failed:', errorText);
      return new Response(
        JSON.stringify({
          error: 'Failed to create checkout session',
          details: errorText,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const session = await stripeResponse.json();
    console.log('[create-checkout-session] Checkout session created successfully:', session.id);
    console.log('[create-checkout-session] Checkout URL:', session.url);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[create-checkout-session] Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
        details: error instanceof Error ? error.stack : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
