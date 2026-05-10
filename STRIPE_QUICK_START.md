# Stripe Quick Start - 5 Minutes

## Why Payments Don't Work Yet

Your code is ready, but Stripe needs configuration. Without it:
- ✅ Free plan works (goes to journal)
- ❌ Monthly/Yearly plans do nothing (missing Stripe keys)

## What You Need

### 1. Stripe Account
Create free account: https://dashboard.stripe.com/register

### 2. Create 2 Products in Stripe

**Monthly Plan:**
- Name: LifeZinc Monthly
- Price: $9/month
- Copy the **Price ID** (starts with `price_`)

**Yearly Plan:**
- Name: LifeZinc Yearly
- Price: $89/year
- Copy the **Price ID** (starts with `price_`)

### 3. Get API Keys
Go to: **Developers → API Keys** in Stripe Dashboard
- Copy **Secret Key** (starts with `sk_test_`)

## Configuration

### A. Update `.env` file (Frontend)

```bash
VITE_STRIPE_MONTHLY_PRICE_ID=price_YOUR_MONTHLY_PRICE_ID
VITE_STRIPE_YEARLY_PRICE_ID=price_YOUR_YEARLY_PRICE_ID
```

**Then restart dev server:** `npm run dev`

### B. Add Secret to Supabase (Backend)

1. Go to: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs/settings/functions
2. Click "Add Secret"
3. Name: `STRIPE_SECRET_KEY`
4. Value: `sk_test_YOUR_SECRET_KEY`
5. Save

## Test It

1. Login to your app
2. Go to Pricing page
3. Click "Get Monthly Plan"
4. Should redirect to Stripe checkout ✅
5. Use test card: `4242 4242 4242 4242`
6. Complete payment
7. Redirects to Success page ✅

## Common Issues

### "Nothing happens when I click plan"
- Check `.env` has Price IDs
- Check Supabase has `STRIPE_SECRET_KEY`
- Restart dev server after changing `.env`

### "Error: STRIPE_SECRET_KEY is not configured"
- Go to Supabase Edge Functions secrets
- Add `STRIPE_SECRET_KEY` with your key
- Wait 30 seconds for deployment

### "Free plan works, paid plans don't"
- This is normal without Stripe configuration
- Free plan doesn't need Stripe
- Follow steps above to enable paid plans

## Production

When ready to accept real payments:

1. **Stripe:** Toggle to Live Mode
2. **Get live keys:** `sk_live_...` and live Price IDs
3. **Update `.env`:** Use live Price IDs
4. **Update Supabase:** Change secret to live key
5. **Test:** Use real card (you'll be charged, can refund)

## Need Help?

- Full guide: `STRIPE_SETUP.md`
- Template: `.env.stripe.template`
- Stripe docs: https://stripe.com/docs
