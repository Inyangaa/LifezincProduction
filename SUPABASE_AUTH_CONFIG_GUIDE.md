# Supabase Authentication Configuration Guide

This guide explains how to properly configure Supabase authentication to require email verification before users can access the application.

## Critical Configuration Steps

### Step 1: Enable Email Confirmation in Supabase Dashboard

1. Go to your Supabase project: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth** section
4. **Enable "Confirm email"** - Toggle this ON
5. **Set "Email confirmation required"** to **ON**
6. Set **"Mailer Autoconfirm"** to **OFF** (very important!)
7. Click **Save**

### Step 2: Configure Email Templates

1. Still in the Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Select **"Confirm signup"**
3. Customize the template if desired:

**Recommended Subject:**
```
Verify your LifeZinc account
```

**Recommended Body:**
```html
<h2>Welcome to LifeZinc!</h2>
<p>Please verify your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>
<p>If you didn't create a LifeZinc account, you can safely ignore this email.</p>
```

4. Click **Save**

### Step 3: Configure SMTP Settings (Porkbun)

To use your custom domain email (inyang@lifezinc.com) for sending verification emails:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Enable **"Enable Custom SMTP"**
3. Enter the following details:

```
Host: smtp.porkbun.com
Port: 587
Username: inyang@lifezinc.com
Password: [YOUR_PORKBUN_PASSWORD]
Sender Email: support@lifezinc.com
Sender Name: LifeZinc Support
```

4. Click **Test Connection** to verify it works
5. Click **Save**

**Note:** Even though we authenticate with `inyang@lifezinc.com`, the emails will display as coming from `support@lifezinc.com` (which forwards to inyang@lifezinc.com).

### Step 4: Configure Redirect URLs

1. Still in **Authentication** → **Settings**
2. Scroll to **Site URL**
3. Set to your production URL: `https://lifezinc.com`
4. For local development, also set: `http://localhost:5173`

5. Scroll to **Redirect URLs**
6. Add these URLs:
   - `https://lifezinc.com/#type=signup`
   - `https://lifezinc.com/#type=recovery`
   - `http://localhost:5173/#type=signup` (for development)
   - `http://localhost:5173/#type=recovery` (for development)

7. Click **Save**

## How Email Verification Works

### Signup Flow

1. **User submits signup form**
   - App calls `supabase.auth.signUp()`
   - Supabase creates user account with `email_confirmed_at = null`

2. **No session is created**
   - Because email confirmation is required, Supabase does NOT return a session
   - User is NOT automatically logged in
   - `data.user` exists but `data.session` is `null`

3. **Verification email sent**
   - Supabase sends email to user's address
   - Email contains verification link with token

4. **User shown "Check Your Email" page**
   - App displays `EmailVerificationPendingPage`
   - User can resend verification email if needed

5. **User clicks verification link**
   - Link format: `https://lifezinc.com/#type=signup&token=...`
   - Supabase verifies the token
   - Sets `email_confirmed_at` to current timestamp
   - Creates a session

6. **User is redirected to app**
   - App detects `type=signup` in URL hash
   - Shows success message
   - User can now log in and access full app

### Login Flow (Unverified Email)

1. **User tries to log in with unverified email**
   - App calls `supabase.auth.signInWithPassword()`
   - Supabase returns error: "Email not confirmed"

2. **App shows verification page**
   - Displays `EmailVerificationPendingPage`
   - Shows user's email address
   - Provides "Resend Verification Email" button

3. **User must verify email before accessing app**

## Verification of Configuration

### Test 1: Signup Creates Unverified User

```sql
-- Run this query in Supabase SQL Editor after a test signup
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'test@example.com';
```

Expected result:
- `email_confirmed_at` should be `NULL`
- User exists but is not verified

### Test 2: Login Fails for Unverified User

Try logging in with the unverified email:
- Should show error: "Email not confirmed"
- Should NOT create a session
- Should redirect to verification pending page

### Test 3: Verification Link Works

Click the verification link from email:
- URL should be: `https://lifezinc.com/#type=signup&token=...`
- User should be verified
- Should show success message
- Can now log in successfully

Run the same SQL query:
```sql
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'test@example.com';
```

Expected result:
- `email_confirmed_at` should now have a timestamp
- User is verified

## Configuration Checklist

Use this checklist to verify everything is configured correctly:

### Supabase Dashboard - Authentication Settings

- [ ] "Confirm email" is ENABLED
- [ ] "Email confirmation required" is ON
- [ ] "Mailer Autoconfirm" is OFF
- [ ] SMTP settings are configured (Porkbun)
- [ ] SMTP connection test passed
- [ ] Site URL is set correctly
- [ ] Redirect URLs are added
- [ ] Email templates are customized

### Application Code

- [ ] `signUp()` does not auto-login (no session created)
- [ ] Signup shows `EmailVerificationPendingPage` after submission
- [ ] Login checks for email confirmation error
- [ ] Verification page handles `type=signup` hash parameter
- [ ] User cannot access protected routes without verification

### Testing

- [ ] Test signup creates unverified user
- [ ] Test login fails for unverified user
- [ ] Test verification email is received
- [ ] Test verification link works
- [ ] Test verified user can log in
- [ ] Test protected routes require verification

## Troubleshooting

### Issue: Users Are Auto-Logged In After Signup

**Cause:** "Confirm email" is not enabled in Supabase settings

**Fix:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Confirm email"
3. Enable "Email confirmation required"
4. Save settings

### Issue: Verification Email Not Received

**Possible Causes:**
1. SMTP settings not configured
2. Email went to spam
3. Wrong email address

**Fix:**
1. Verify SMTP settings in dashboard
2. Test SMTP connection
3. Check spam folder
4. Try resending verification email

### Issue: Verification Link Doesn't Work

**Possible Causes:**
1. Token expired (default: 24 hours)
2. Wrong redirect URL
3. Token already used

**Fix:**
1. Request new verification email
2. Verify redirect URLs are correct in settings
3. Check token hasn't expired

### Issue: Verified Users Can't Log In

**Possible Causes:**
1. Wrong password
2. Account disabled
3. Email changed

**Fix:**
1. Use password reset flow
2. Check user status in Supabase dashboard
3. Verify email address is correct

## Security Best Practices

1. **Always require email verification** in production
   - Prevents fake accounts
   - Verifies user owns the email
   - Reduces spam signups

2. **Use custom SMTP** for production
   - Supabase's default email service is for development only
   - Custom domain (lifezinc.com) looks more professional
   - Better deliverability

3. **Set appropriate token expiry**
   - Default: 24 hours (good for most cases)
   - Can be changed in Authentication settings

4. **Monitor verification rates**
   - Track how many users verify their email
   - Send reminder emails if needed
   - Adjust onboarding flow based on data

5. **Handle expired tokens gracefully**
   - Allow users to request new verification email
   - Show clear error messages
   - Provide support contact

## Application Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                         SIGNUP FLOW                          │
└─────────────────────────────────────────────────────────────┘

1. User fills signup form
   ↓
2. App calls signUp()
   ↓
3. Supabase creates user (email_confirmed_at = NULL)
   ↓
4. Supabase sends verification email
   ↓
5. App shows "Check Your Email" page
   ↓
6. User clicks link in email
   ↓
7. Supabase verifies token, sets email_confirmed_at
   ↓
8. App shows success message
   ↓
9. User can now log in and access app


┌─────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW (UNVERIFIED)                   │
└─────────────────────────────────────────────────────────────┘

1. User tries to log in
   ↓
2. App calls signInWithPassword()
   ↓
3. Supabase checks email_confirmed_at
   ↓
4. Supabase returns error: "Email not confirmed"
   ↓
5. App shows "Check Your Email" page
   ↓
6. App offers to resend verification email
   ↓
7. User must verify email before accessing app
```

## Important Notes

1. **Email confirmation is required** - This is a security best practice
2. **No auto-login on signup** - Users must verify email first
3. **Session only created after verification** - Prevents unverified access
4. **Use custom SMTP in production** - Better deliverability and branding
5. **Test thoroughly** - Verify all flows work before going live

## Support

If you encounter issues:
1. Check Supabase Dashboard logs (Authentication → Logs)
2. Verify all settings match this guide
3. Test with a real email address
4. Check browser console for errors
5. Review Supabase Auth documentation: https://supabase.com/docs/guides/auth

---

**Configuration Complete!**

Your Supabase authentication is now properly configured to require email verification before users can access the LifeZinc application.
