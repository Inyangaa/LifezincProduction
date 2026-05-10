# Email Verification Setup Guide

This guide explains how to configure email verification for LifeZinc using Supabase Auth.

## Overview

LifeZinc now requires users to verify their email address before they can fully access the application. This is implemented using Supabase's built-in email confirmation feature.

## Supabase Configuration

To enable email verification, you need to configure your Supabase project:

### 1. Enable Email Confirmation

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth**
4. Enable **"Confirm email"**
5. Set **"Email confirmation required"** to **ON**
6. Click **Save**

### 2. Configure Email Templates (Optional)

You can customize the verification email template:

1. In the Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Select **"Confirm signup"**
3. Customize the email subject and body
4. Use the `{{ .ConfirmationURL }}` variable for the verification link
5. Save your changes

### 3. Email Provider Configuration

Supabase provides a default email service for development, but for production you should configure your own SMTP provider:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Enter your SMTP credentials:
   - Host
   - Port
   - Username
   - Password
   - Sender email
   - Sender name
3. Test the connection
4. Save settings

**Recommended Email Providers:**
- SendGrid
- AWS SES
- Resend
- Mailgun
- Postmark

## User Flow

### Signup Flow

1. User fills out signup form with name, email, and password
2. App creates account in Supabase (user is NOT automatically logged in)
3. Supabase sends verification email to user's address
4. User sees "Check Your Email" screen with:
   - Confirmation that account was created
   - Instructions to check email
   - Option to resend verification email
5. User clicks verification link in email
6. User is redirected to app and sees success message
7. User can now log in and access full app

### Login Flow for Unverified Users

1. User tries to log in with unverified email
2. Supabase returns "Email not confirmed" error
3. App shows "Check Your Email" screen
4. App automatically resends verification email
5. User must verify email before they can log in

## Implementation Details

### Components Created

1. **EmailVerificationPage.tsx**
   - Handles the verification link callback
   - Verifies the token from URL hash
   - Shows success or error states
   - Redirects to journal on success

2. **EmailVerificationPendingPage.tsx**
   - Shown after signup and when login fails due to unverified email
   - Displays user's email address
   - Provides instructions
   - Allows resending verification email
   - Link back to login

### Updated Components

1. **SignUpPage.tsx**
   - No longer auto-logs in users after signup
   - Shows EmailVerificationPendingPage instead
   - Handles signup errors

2. **LoginPage.tsx**
   - Detects "Email not confirmed" error
   - Shows EmailVerificationPendingPage for unverified users
   - Automatically triggers resend of verification email

3. **App.tsx**
   - Added 'verify-email' route
   - Detects verification hash in URL
   - Routes to EmailVerificationPage when hash contains type=signup

4. **AuthContext.tsx**
   - Updated emailRedirectTo to use hash routing
   - Ensures proper redirect after email verification

## Testing

### Test Email Verification Flow

1. **Sign Up:**
   ```
   - Go to signup page
   - Create account with valid email
   - Should see "Check Your Email" screen
   - Check email inbox (and spam folder)
   ```

2. **Verify Email:**
   ```
   - Click verification link in email
   - Should redirect to app
   - Should see success message
   - Should be able to continue to journal
   ```

3. **Login Before Verification:**
   ```
   - Try to log in before verifying email
   - Should see "Check Your Email" screen
   - Should receive new verification email
   - Must verify before accessing app
   ```

4. **Resend Email:**
   ```
   - On "Check Your Email" screen
   - Click "Resend Verification Email"
   - Should receive new email
   - Should see success message
   ```

## Production Checklist

Before deploying to production:

- [ ] Enable email confirmation in Supabase
- [ ] Configure production SMTP provider
- [ ] Customize email templates with branding
- [ ] Test full signup → verify → login flow
- [ ] Test resend email functionality
- [ ] Test with multiple email providers (Gmail, Outlook, etc.)
- [ ] Check email deliverability (inbox vs spam)
- [ ] Monitor email sending metrics in Supabase dashboard

## Troubleshooting

### Email Not Received

1. Check spam/junk folder
2. Verify SMTP settings in Supabase
3. Check Supabase logs for email sending errors
4. Test with different email provider
5. Verify email templates are enabled

### Verification Link Not Working

1. Check that emailRedirectTo matches your domain
2. Verify URL hash contains access_token and type
3. Check browser console for errors
4. Ensure Supabase site URL is configured correctly

### Users Can't Log In

1. Verify email confirmation is enabled in Supabase
2. Check that user's email_confirmed_at is set in auth.users table
3. Test resend verification email functionality
4. Clear browser cache and cookies

## Security Notes

- Email verification helps prevent spam accounts
- Verification tokens are time-limited (expires in 24 hours by default)
- Tokens can only be used once
- Supabase handles token generation and validation securely
- No sensitive data is stored client-side

## Support

For issues with Supabase email configuration:
- Supabase Docs: https://supabase.com/docs/guides/auth
- Supabase Support: https://supabase.com/support
