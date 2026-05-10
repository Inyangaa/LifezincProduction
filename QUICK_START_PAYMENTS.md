# Quick Start: Enable Payments (5 Minutes)

## Step-by-Step Checklist

### ☐ 1. Create Stripe Account (1 min)
- Go to: https://stripe.com
- Click "Start now"
- Stay in **Test Mode**

### ☐ 2. Get Secret Key (30 sec)
- Dashboard → Developers → API Keys
- Copy **Secret key** (starts with `sk_test_`)
- Save it somewhere safe

### ☐ 3. Create Monthly Product (1 min)
- Dashboard → Products → Add Product
- Name: `LifeZinc Monthly`
- Price: `$9.00 USD`
- Recurring: `Monthly`
- Save → Copy **Price ID** (starts with `price_`)

### ☐ 4. Create Yearly Product (1 min)
- Dashboard → Products → Add Product
- Name: `LifeZinc Yearly`
- Price: `$89.00 USD`
- Recurring: `Yearly`
- Save → Copy **Price ID** (starts with `price_`)

### ☐ 5. Add Secrets to Supabase (1 min)
- Go to: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs/settings/functions
- Click **Add Secret**
  - Name: `STRIPE_SECRET_KEY`
  - Value: Your sk_test_xxx key
- Save

### ☐ 6. Update Price IDs in Code (1 min)

Open: `src/components/PricingPage.tsx`

Find line 9-12 and replace:

```typescript
const STRIPE_PRICES = {
  monthly: 'price_YOUR_MONTHLY_ID_HERE',
  yearly: 'price_YOUR_YEARLY_ID_HERE',
};
```

Save the file and rebuild:
```bash
npm run build
```

## ✅ Test It Works

1. **Open your app**
2. **Create account** or login
3. **Write 5 journal entries**
4. **Click "View Plans & Upgrade"**
5. **Click "Get Monthly Plan"**
6. **Should redirect to Stripe checkout**
7. **Use test card:** `4242 4242 4242 4242`
8. **Any future expiry, any CVC, any ZIP**
9. **Complete payment**
10. **Should redirect to success page**
11. **Try journaling again → unlimited!**

## 🎉 You're Done!

Payments are now working in test mode!

## Going Live Later

When ready for real payments:
1. Complete Stripe verification
2. Switch to **Live Mode** in Stripe
3. Get **Live** secret key (sk_live_xxx)
4. Create **Live** products (new price IDs)
5. Update Supabase secret
6. Update code with live price IDs
7. Rebuild and deploy

## Need Help?

- Stripe Test Cards: https://stripe.com/docs/testing
- Supabase Functions: https://supabase.com/docs/guides/functions
- Your webhook URL: `https://zelbbjeuaalevquxsajs.supabase.co/functions/v1/stripe-webhook`
