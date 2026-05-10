# Vercel Environment Variables Setup

## 🔴 CRITICAL: Set These in Vercel Dashboard

Go to your Vercel project: https://vercel.com/inyangs-projects-6adbd5a2/lifezinc-app/settings/environment-variables

Add the following environment variables **exactly as shown**:

---

### **Required for Production (Frontend)**

```
VITE_SUPABASE_URL=https://zelbbjeuaalevquxsajs.supabase.co
```

```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbGJiamV1YWFsZXZxdXhzYWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODM2NjcsImV4cCI6MjA3OTA1OTY2N30.DXIzUcaF6XgP2DkVD0X3678ASZNSrmTr8O4vMoWIaaY
```

---

### **Optional (for Stripe Payments - Frontend)**

```
VITE_STRIPE_MONTHLY_PRICE_ID=price_PASTE_YOUR_MONTHLY_PRICE_ID_HERE
```

```
VITE_STRIPE_YEARLY_PRICE_ID=price_PASTE_YOUR_YEARLY_PRICE_ID_HERE
```

*(Replace with actual Stripe price IDs after creating products in Stripe Dashboard)*

---

## 📋 Step-by-Step Instructions

### 1. Open Vercel Dashboard
- Go to: https://vercel.com/inyangs-projects-6adbd5a2/lifezinc-app/settings/environment-variables

### 2. Add Each Variable
For **each** environment variable above:

1. Click **"Add New"**
2. **Key:** Copy the name (e.g., `VITE_SUPABASE_URL`)
3. **Value:** Copy the value (e.g., `https://zelbbjeuaalevquxsajs.supabase.co`)
4. **Environment:** Select **ALL** (Production, Preview, Development)
5. Click **"Save"**

### 3. Redeploy
After adding all variables:

1. Go to: https://vercel.com/inyangs-projects-6adbd5a2/lifezinc-app/deployments
2. Click the **three dots** (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (~2 minutes)

---

## 🧪 Testing After Deployment

### Test 1: Visit Debug Page
1. Go to: `https://lifezinc-app-mpmu-obnojpmy4-inyangs-projects-6adbd5a2.vercel.app/?page=debug-auth`
2. Check that:
   - ✅ VITE_SUPABASE_URL is shown
   - ✅ VITE_SUPABASE_ANON_KEY shows "Present"
   - ✅ Health Check status is "SUCCESS"
   - ✅ Signup Test status is "REACHABLE"

### Test 2: Try Sign Up
1. Go to: `https://lifezinc-app-mpmu-obnojpmy4-inyangs-projects-6adbd5a2.vercel.app/`
2. Click "Get Started" or "Sign Up"
3. Enter your real email and a strong password
4. Click "Sign Up"
5. **Expected:** Success message or redirect to "Check your email" page
6. **NOT Expected:** "Failed to fetch" error

### Test 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   - `=== SUPABASE CLIENT INITIALIZATION ===`
   - `Supabase URL: https://zelbbjeuaalevquxsajs.supabase.co`
   - `Supabase URL check: Found`
   - `Supabase Key check: Found`

**If you see "MISSING" anywhere, the environment variables are not set correctly in Vercel.**

---

## 🚨 Troubleshooting

### "Failed to fetch" Error on Signup

**Possible Causes:**
1. ❌ Environment variables not set in Vercel
2. ❌ Environment variables misspelled (must be exact)
3. ❌ Vercel didn't redeploy after adding variables
4. ❌ Supabase project URL or key is wrong

**Solution:**
1. Double-check env vars in Vercel Dashboard
2. Ensure they match exactly (no extra spaces, correct case)
3. Redeploy from Vercel Dashboard
4. Wait 2-3 minutes for deployment
5. Clear browser cache (Ctrl+Shift+Delete)
6. Try again

### Environment Variables Not Showing on Debug Page

**Cause:** Vercel deployment didn't pick up new env vars

**Solution:**
1. Go to Vercel Dashboard
2. Deployments tab
3. Click "Redeploy" on latest deployment
4. Wait for completion
5. Hard refresh browser (Ctrl+F5)

### Supabase Connection Health Check Fails

**Cause:** Supabase URL or anon key is incorrect

**Solution:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs/settings/api
2. Copy the correct **Project URL** and **anon/public key**
3. Update in Vercel Dashboard
4. Redeploy

---

## ✅ Success Checklist

- [ ] All 2 required env vars added to Vercel
- [ ] Environment set to "Production, Preview, Development"
- [ ] Redeployed from Vercel Dashboard
- [ ] Deployment completed successfully
- [ ] Debug page shows all env vars as "Found" or "Present"
- [ ] Health check shows "SUCCESS"
- [ ] Signup test shows "REACHABLE"
- [ ] Sign up flow works without "Failed to fetch" error
- [ ] Browser console shows Supabase client initialized correctly

---

## 📞 Support

If sign up still fails after following all steps:

1. Take a screenshot of the debug page (`?page=debug-auth`)
2. Copy all console logs from browser DevTools
3. Share both with the developer for diagnosis

---

## 🔐 Security Note

- ✅ The `VITE_SUPABASE_ANON_KEY` is safe to expose in frontend code
- ✅ It's designed for public use and has restricted permissions
- ❌ **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` in frontend
- ❌ **NEVER** expose `STRIPE_SECRET_KEY` in frontend
- ✅ Backend secrets (SMTP_PASS, STRIPE_SECRET_KEY) go in **Supabase Dashboard → Settings → Edge Functions → Secrets**, **NOT** in Vercel
