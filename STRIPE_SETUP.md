# Stripe Payment Setup Guide

## Required Actions (15 minutes total)

### 1. Create Stripe Account
- Visit: https://dashboard.stripe.com/register
- Complete signup with business details
- Toggle to **Test Mode** for testing

### 2. Get API Keys
Navigate to: **Developers → API Keys**

You'll need:
- **Secret Key** (sk_test_xxxx) - for backend
- Keep **Publishable Key** (pk_test_xxxx) for future frontend use

### 3. Create Products in Stripe

#### Monthly Plan
```
Name: LifeZinc Monthly
Description: Unlimited journaling and premium features
Price: $9.00 USD
Billing Period: Monthly
```
**Copy the Price ID** (format: `price_xxxxxxxxxxxxx`)

#### Yearly Plan
```
Name: LifeZinc Yearly
Description: Unlimited journaling - Best value
Price: $89.00 USD
Billing Period: Yearly
```
**Copy the Price ID** (format: `price_xxxxxxxxxxxxx`)

### 4. Configure Supabase Edge Function Secrets

Go to: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs/settings/functions

Add these secrets:

```
STRIPE_SECRET_KEY = sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxx (optional for now)
```

### 5. Update Price IDs in Environment Variables

Edit file: `.env` (in project root)

Add your Price IDs:
```bash
VITE_STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
VITE_STRIPE_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx
```

**Important Notes:**
- Price IDs start with `price_` (e.g., `price_1QSy0PEwfGQ0OGww0bqPmNAX`)
- These are FRONTEND variables (used by React app)
- After updating `.env`, restart your dev server (`npm run dev`)
- For production, set these in your hosting platform's environment variables

### 6. Setup Webhook (Optional - for production)

1. Go to: **Developers → Webhooks** in Stripe Dashboard
2. Click **Add Endpoint**
3. Endpoint URL: `https://zelbbjeuaalevquxsajs.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the **Signing Secret** (whsec_xxxx)
6. Add to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

### 7. Test Payment Flow

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### 8. Go Live (When Ready)

1. Complete Stripe account verification
2. Toggle Stripe to **Live Mode**
3. Get **Live API Keys** (sk_live_xxx)
4. Create **Live Products** (new price IDs)
5. Update Supabase secrets with live keys
6. Update PricingPage.tsx with live price IDs
7. Update webhook endpoint in Stripe

## Current Status

✅ Edge Functions deployed
✅ Database schema ready
✅ Frontend integrated
✅ Success page created
✅ Subscription context active

⏳ Needs Stripe account configuration
⏳ Needs Price IDs in code
⏳ Needs secrets in Supabase

## Test the Flow

1. Create account / login
2. Make 5 journal entries
3. See upgrade prompt
4. Click "Get Monthly Plan"
5. Should redirect to Stripe checkout
6. Use test card: 4242 4242 4242 4242
7. Complete payment
8. Redirect to success page
9. Subscription activated
10. Unlimited journaling unlocked

## Troubleshooting

### Issue: "Clicking plan just goes back to emoji page"

**Possible Causes:**

1. **Free Plan Selected** ✅
   - This is correct behavior! Free plan users go directly to journal
   - No Stripe payment needed

2. **Missing Price IDs in .env** ❌
   - Check `.env` file has `VITE_STRIPE_MONTHLY_PRICE_ID` and `VITE_STRIPE_YEARLY_PRICE_ID`
   - Make sure they start with `price_`
   - Restart dev server after updating `.env`

3. **Missing STRIPE_SECRET_KEY in Supabase** ❌
   - Go to: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs/settings/functions
   - Check if `STRIPE_SECRET_KEY` secret exists
   - Value should be `sk_test_...` or `sk_live_...`

4. **Edge Function Not Deployed** ❌
   - Check that `create-checkout-session` edge function is deployed
   - Visit: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs/functions
   - Should see `create-checkout-session` in the list

5. **Stripe Test Mode vs Live Mode** ⚠️
   - In dev: Use test mode keys (sk_test_..., price_test_...)
   - In production: Use live mode keys (sk_live_..., price_live_...)
   - Keys and Price IDs from test mode don't work in live mode!

### Issue: "Error message on pricing page"

- Open browser console (F12) → Console tab
- Look for error messages from `[PricingPage]`
- Common errors:
  - `STRIPE_SECRET_KEY is not configured` → Set secret in Supabase
  - `Invalid user token` → User not logged in, redirect to login
  - `Stripe API error` → Check Price IDs are correct

### Issue: "Payment succeeds but subscription not activated"

- Check webhook is configured (Step 6)
- Check `stripe-webhook` edge function is deployed
- Go to Stripe Dashboard → Developers → Webhooks → Click your endpoint
- Check for failed events (red X)
- Click event to see error details

### Testing Checklist

Before testing payments:
- [ ] Stripe account created
- [ ] Products created in Stripe Dashboard
- [ ] Price IDs copied
- [ ] `VITE_STRIPE_MONTHLY_PRICE_ID` set in `.env`
- [ ] `VITE_STRIPE_YEARLY_PRICE_ID` set in `.env`
- [ ] `STRIPE_SECRET_KEY` set in Supabase Edge Functions secrets
- [ ] Edge function `create-checkout-session` deployed
- [ ] Dev server restarted after updating `.env`

### Preview vs Published

⚠️ **Important:**
- Stripe checkout works correctly on **published URL** only
- In preview/dev mode: UI shows, but redirect might fail
- Always test payments on your production domain
- Use Stripe test mode for testing

## Support

Stripe Documentation: https://stripe.com/docs
Supabase Functions: https://supabase.com/docs/guides/functions
LifeZinc Stripe Template: `.env.stripe.template`
