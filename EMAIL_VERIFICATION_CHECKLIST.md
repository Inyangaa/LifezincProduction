# Email Verification Configuration Checklist

Quick checklist to ensure email verification is properly configured in Supabase.

## ✅ Supabase Dashboard Configuration

### Step 1: Enable Email Confirmation

1. Go to: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs
2. Navigate to: **Authentication** → **Settings**
3. Find the **Email Auth** section
4. Configure:
   - [ ] ✅ **"Confirm email"** - Toggle to **ON**
   - [ ] ✅ **"Email confirmation required"** - Toggle to **ON**
   - [ ] ✅ **"Mailer Autoconfirm"** - Toggle to **OFF** (very important!)
5. [ ] Click **Save**

**Why this matters:**
- `Confirm email ON` = Email verification is required
- `Email confirmation required ON` = Users can't log in until verified
- `Mailer Autoconfirm OFF` = Prevents bypassing verification

### Step 2: Configure SMTP (Porkbun)

1. Navigate to: **Authentication** → **Settings** → **SMTP Settings**
2. [ ] Enable **"Enable Custom SMTP"**
3. Enter credentials:
   ```
   Host: smtp.porkbun.com
   Port: 587
   Username: inyang@lifezinc.com
   Password: [YOUR_PORKBUN_PASSWORD]
   Sender Email: support@lifezinc.com
   Sender Name: LifeZinc Support
   ```
4. [ ] Click **Test Connection** (must succeed)
5. [ ] Click **Save**

**Why this matters:**
- Uses your custom domain for professional emails
- Authenticates with inyang@lifezinc.com
- Displays as support@lifezinc.com

### Step 3: Set Redirect URLs

1. Navigate to: **Authentication** → **Settings**
2. Set **Site URL**: `https://lifezinc.com`
3. Add **Redirect URLs**:
   - [ ] `https://lifezinc.com/#type=signup`
   - [ ] `https://lifezinc.com/#type=recovery`
   - [ ] `http://localhost:5173/#type=signup` (for development)
   - [ ] `http://localhost:5173/#type=recovery` (for development)
4. [ ] Click **Save**

### Step 4: Customize Email Template (Optional)

1. Navigate to: **Authentication** → **Email Templates**
2. Select: **"Confirm signup"**
3. Customize if desired:
   - Subject: "Verify your LifeZinc account"
   - Body: Use {{ .ConfirmationURL }} variable
4. [ ] Click **Save**

## 🧪 Testing Checklist

### Test 1: Signup Flow

1. [ ] Open app in incognito window
2. [ ] Click "Sign Up"
3. [ ] Fill in form with test email
4. [ ] Submit form
5. [ ] Verify:
   - [ ] Shows "Check Your Email" page
   - [ ] Does NOT auto-login
   - [ ] Does NOT create session
6. [ ] Check test email inbox
7. [ ] Verify:
   - [ ] Email arrives within 1-2 minutes
   - [ ] FROM shows "LifeZinc Support <support@lifezinc.com>"
   - [ ] Subject is "Verify your LifeZinc account"
   - [ ] Email has clickable verification button

### Test 2: Unverified Login Attempt

1. [ ] Try logging in with unverified email
2. [ ] Verify:
   - [ ] Shows error: "Email not confirmed"
   - [ ] Shows "Check Your Email" page
   - [ ] Can resend verification email
   - [ ] Does NOT create session

### Test 3: Email Verification

1. [ ] Click verification link from email
2. [ ] Verify:
   - [ ] Redirects to app
   - [ ] Shows success message
   - [ ] URL has `#type=signup` in hash
3. [ ] Now try logging in
4. [ ] Verify:
   - [ ] Login succeeds
   - [ ] Session is created
   - [ ] Can access protected pages

### Test 4: Database Check

Run this SQL query in Supabase SQL Editor:

```sql
-- Before verification
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'test@example.com';
```

**Before verification:**
- [ ] `email_confirmed_at` should be `NULL`

**After verification:**
- [ ] `email_confirmed_at` should have a timestamp

## 🔍 Verification of Settings

### Quick Verification Script

Open browser console on your app and run:

```javascript
// Check current session
const session = await supabase.auth.getSession();
console.log('Session:', session.data.session);
console.log('User:', session.data.session?.user);
console.log('Email Confirmed:', session.data.session?.user?.email_confirmed_at);
```

**Expected Results:**
- Unverified user: `session` should be `null`
- Verified user: `session` exists and `email_confirmed_at` has timestamp

## 🚨 Common Issues

### Issue 1: Users Auto-Login After Signup

**Symptoms:**
- User is logged in immediately after signup
- Can access protected pages without verification

**Fix:**
1. Check "Confirm email" is **ON** in Supabase settings
2. Check "Mailer Autoconfirm" is **OFF**
3. Save settings and test again

### Issue 2: Verification Email Not Received

**Symptoms:**
- Email doesn't arrive
- Nothing in spam folder

**Fix:**
1. Verify SMTP settings are correct
2. Test SMTP connection in dashboard
3. Check Supabase logs for email errors
4. Try resending verification email

### Issue 3: Verification Link Doesn't Work

**Symptoms:**
- Clicking link shows error
- User is not verified

**Fix:**
1. Check redirect URLs are correct
2. Verify token hasn't expired (24 hour default)
3. Request new verification email

### Issue 4: Already Verified But Can't Login

**Symptoms:**
- Email is verified
- Login still fails

**Fix:**
1. Check user status in Supabase Dashboard
2. Verify password is correct
3. Use password reset if needed
4. Check browser console for errors

## 📊 Monitoring

### Check Email Delivery

1. Supabase Dashboard → **Authentication** → **Logs**
2. Look for:
   - Email sent events
   - Verification events
   - Error messages

### Check User Status

1. Supabase Dashboard → **Authentication** → **Users**
2. Find user by email
3. Check:
   - Email Confirmed: Should show checkmark after verification
   - Last Sign In: Should be after verification
   - Created At: Signup timestamp

## ✨ Application Code (Already Implemented)

The following code is already implemented in the LifeZinc app:

### AuthContext.tsx
- ✅ Checks `email_confirmed_at` on session load
- ✅ Signs out users with unverified emails
- ✅ Prevents unverified users from accessing app

### SignUpPage.tsx
- ✅ Shows "Check Your Email" page after signup
- ✅ Does NOT auto-login users
- ✅ Handles email already registered error

### EmailVerificationPendingPage.tsx
- ✅ Shows verification instructions
- ✅ Allows resending verification email
- ✅ Links back to login

### EmailVerificationPage.tsx
- ✅ Handles verification callback
- ✅ Shows success message
- ✅ Redirects to app after verification

## 🎯 Production Checklist

Before going live:

- [ ] All Supabase settings configured correctly
- [ ] SMTP settings tested and working
- [ ] Email templates reviewed and approved
- [ ] All redirect URLs added (production domains)
- [ ] Tested complete signup → verify → login flow
- [ ] Tested unverified login attempt
- [ ] Tested resend verification email
- [ ] Tested password reset flow
- [ ] Verified emails arrive within reasonable time
- [ ] Checked emails don't go to spam
- [ ] Reviewed Supabase logs for errors
- [ ] Documented support process for verification issues

## 📞 Support

If users report verification issues:

1. **Check their email status:**
   ```sql
   SELECT email, email_confirmed_at, created_at, confirmed_at
   FROM auth.users
   WHERE email = 'user@example.com';
   ```

2. **Resend verification manually if needed:**
   - User can click "Resend Verification Email" button
   - Or send them a password reset link (also verifies email)

3. **Check Supabase logs for delivery issues**

4. **Verify SMTP is working:**
   - Test connection in dashboard
   - Check Porkbun mailbox for bounces

## 🔗 Documentation References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Verification Guide](https://supabase.com/docs/guides/auth/auth-email)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- [Porkbun SMTP Setup](./PORKBUN_SMTP_SETUP.md)
- [Full Auth Config Guide](./SUPABASE_AUTH_CONFIG_GUIDE.md)

---

**Status:** Configuration complete, ready for testing
**Last Updated:** November 27, 2025
