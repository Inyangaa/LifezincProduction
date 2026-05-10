# ⚡ QUICK FIX GUIDE - Sign Up Error

## 🎯 The Problem
Production signup shows: **"Failed to fetch"**

## 🔧 The Solution (5 Minutes)

### Step 1: Add Environment Variables to Vercel

Go to: https://vercel.com/inyangs-projects-6adbd5a2/lifezinc-app/settings/environment-variables

Add these 2 variables:

```
VITE_SUPABASE_URL
https://zelbbjeuaalevquxsajs.supabase.co
```

```
VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbGJiamV1YWFsZXZxdXhzYWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODM2NjcsImV4cCI6MjA3OTA1OTY2N30.DXIzUcaF6XgP2DkVD0X3678ASZNSrmTr8O4vMoWIaaY
```

**IMPORTANT:** Select **ALL** environments (Production, Preview, Development)

---

### Step 2: Redeploy

Go to: https://vercel.com/inyangs-projects-6adbd5a2/lifezinc-app/deployments

Click **⋯** on latest deployment → **Redeploy**

Wait 2 minutes.

---

### Step 3: Test

Visit: `https://lifezinc-app-mpmu-obnojpmy4-inyangs-projects-6adbd5a2.vercel.app/?page=debug-auth`

**Expected:** All green checkmarks ✅

Try signup: `https://lifezinc-app-mpmu-obnojpmy4-inyangs-projects-6adbd5a2.vercel.app/`

**Expected:** No "Failed to fetch" error

---

## 📋 Detailed Guides

- **Full Setup:** `VERCEL_ENV_SETUP.md`
- **Complete Fix Details:** `SIGNUP_FIX_SUMMARY.md`
- **Email Setup:** `EMAIL_TESTING_CHECKLIST.md`

---

## 🆘 Still Not Working?

1. Visit `?page=debug-auth`
2. Screenshot the page
3. Open DevTools Console (F12)
4. Copy all logs starting with `===`
5. Share both with developer

---

## ✅ Success Indicators

- [ ] Debug page shows "Found" for both env vars
- [ ] Health Check: SUCCESS
- [ ] Signup Test: REACHABLE
- [ ] Sign up completes without error
- [ ] Browser console shows Supabase initialized

---

**That's it!** Once env vars are set and redeployed, signup will work.
