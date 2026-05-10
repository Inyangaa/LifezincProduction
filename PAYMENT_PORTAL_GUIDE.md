# Payment Portal Implementation Guide

This guide walks you through implementing a payment system for LifeZinc using Stripe.

## Overview

The pricing page is already set up with three tiers:
- **Free**: $0/forever - Basic features
- **Monthly**: $9/month - All premium features
- **Yearly**: $89/year - Best value, all premium features

## Prerequisites

1. **Stripe Account**
   - Create account at https://dashboard.stripe.com/register
   - Get your API keys from https://dashboard.stripe.com/apikeys
   - You'll need both test and live keys

2. **Environment Variables**
   Add to your `.env` file:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Implementation Steps

### Step 1: Install Stripe Dependencies

```bash
npm install @stripe/stripe-js stripe
```

### Step 2: Create Stripe Configuration

Create `src/lib/stripe.ts`:

```typescript
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);
```

### Step 3: Create Supabase Migration for Subscriptions

The subscription table already exists. Verify with:

```sql
SELECT * FROM subscriptions LIMIT 1;
```

If you need to add Stripe-specific fields:

```sql
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_stripe_customer
ON subscriptions(stripe_customer_id);
```

### Step 4: Create Stripe Edge Function

Deploy a Supabase Edge Function to handle Stripe checkout:

Create `supabase/functions/create-checkout-session/index.ts`:

```typescript
import Stripe from 'npm:stripe@14.3.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { priceId, userId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Get or create Stripe customer
    const { data: user } = await supabase.auth.admin.getUserById(userId);

    let customerId = user?.user_metadata?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;

      // Save customer ID
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { stripe_customer_id: customerId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/settings?success=true`,
      cancel_url: `${req.headers.get('origin')}/pricing?canceled=true`,
      metadata: { supabase_user_id: userId },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
```

Deploy with:
```bash
# Use the Supabase MCP tool to deploy
# The deployment will be handled automatically
```

### Step 5: Create Stripe Webhook Handler

Create `supabase/functions/stripe-webhook/index.ts`:

```typescript
import Stripe from 'npm:stripe@14.3.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      webhookSecret
    );

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            tier: 'pro',
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            tier: subscription.status === 'active' ? 'pro' : 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
```

### Step 6: Update PricingPage Component

Modify `src/components/PricingPage.tsx`:

```typescript
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { stripePromise } from "../lib/stripe";

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const STRIPE_PRICE_IDS = {
    monthly: 'price_xxx', // Replace with your Stripe Price ID
    yearly: 'price_yyy',  // Replace with your Stripe Price ID
  };

  const handleSelectPlan = async (planId: string) => {
    if (planId === "free") {
      onNavigate("auth");
      return;
    }

    if (!user) {
      onNavigate("auth");
      return;
    }

    setLoading(planId);

    try {
      const priceId = STRIPE_PRICE_IDS[planId as keyof typeof STRIPE_PRICE_IDS];

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            priceId,
            userId: user.id,
          }),
        }
      );

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Rest of component remains the same, but update button onClick handlers
  // to use the new handleSelectPlan function
}
```

### Step 7: Create Stripe Products and Prices

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Create two products:

**Monthly Plan**
- Name: "LifeZinc Pro - Monthly"
- Price: $9.00 USD
- Billing period: Monthly
- Copy the Price ID (starts with `price_`)

**Yearly Plan**
- Name: "LifeZinc Pro - Yearly"
- Price: $89.00 USD
- Billing period: Yearly
- Copy the Price ID

4. Update the `STRIPE_PRICE_IDS` in PricingPage.tsx with your actual Price IDs

### Step 8: Set Up Webhook in Stripe Dashboard

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret and add to your `.env` file

### Step 9: Update SubscriptionContext

The existing `SubscriptionContext` should automatically work with the updated subscriptions table. Verify it checks the `status` field properly.

## Testing

### Test Mode
1. Use Stripe test mode with test API keys
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date and any CVC

### Test Flow
1. Navigate to Pricing page
2. Click "Get Monthly Plan"
3. Should redirect to Stripe Checkout
4. Complete test payment
5. Verify subscription in Supabase `subscriptions` table
6. Verify user has pro features enabled

## Customer Portal

To allow users to manage their subscriptions:

Create `supabase/functions/create-portal-session/index.ts`:

```typescript
import Stripe from 'npm:stripe@14.3.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { customerId } = await req.json();

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.get('origin')}/settings`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
```

Add a "Manage Subscription" button in SettingsPage.tsx for pro users.

## Security Checklist

- [ ] Never expose secret keys in frontend code
- [ ] Always verify webhook signatures
- [ ] Use RLS policies on subscriptions table
- [ ] Validate user authentication before creating checkout sessions
- [ ] Handle failed payments gracefully
- [ ] Implement proper error logging

## Going Live

1. Switch to live API keys in production
2. Update webhook endpoint to production URL
3. Test with real (small amount) payment
4. Set up Stripe monitoring and alerts
5. Configure email receipts in Stripe settings

## Troubleshooting

**Checkout not working:**
- Check Stripe API keys are correct
- Verify environment variables are loaded
- Check browser console for errors

**Webhook not receiving events:**
- Verify webhook URL is correct
- Check webhook signing secret
- Look at webhook logs in Stripe dashboard

**Subscription not updating in database:**
- Check RLS policies allow updates
- Verify edge function has service role key
- Check Supabase function logs

## Additional Resources

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
