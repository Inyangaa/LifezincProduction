# Porkbun SMTP Setup Guide for LifeZinc

This guide explains how to configure LifeZinc to send emails using Porkbun SMTP through the inyang@lifezinc.com mailbox.

## Email Architecture

### Real Mailbox
- **inyang@lifezinc.com** - The only real mailbox with SMTP access
- This mailbox has actual SMTP credentials and can send/receive emails

### Forwarding Addresses
These addresses forward to `inyang@lifezinc.com`:
- **support@lifezinc.com** - Customer support inquiries
- **feedback@lifezinc.com** - User feedback
- **partners@lifezinc.com** - Partnership inquiries

### How It Works
- **SMTP Authentication**: Always uses `inyang@lifezinc.com` credentials
- **FROM Address**: Emails can display as `LifeZinc Support <support@lifezinc.com>`
- **Replies**: Go to the forwarding address, which routes to `inyang@lifezinc.com`

## Step 1: Environment Variables

Add these variables to your `.env` file:

```bash
# Porkbun SMTP Configuration
SMTP_HOST=smtp.porkbun.com
SMTP_PORT=587
SMTP_USER=inyang@lifezinc.com
SMTP_PASS=YOUR_PORKBUN_EMAIL_PASSWORD_FOR_INYANG
SMTP_SECURE=false
SMTP_FROM_NAME=LifeZinc Support
SMTP_FROM_EMAIL=support@lifezinc.com
```

**Important Notes:**
- `SMTP_USER` must be exactly `inyang@lifezinc.com` (the real mailbox)
- `SMTP_FROM_EMAIL` can be `support@lifezinc.com` (the forwarding address)
- `SMTP_PORT=587` uses STARTTLS (recommended)
- `SMTP_PORT=465` would use implicit TLS/SSL (set `SMTP_SECURE=true`)
- Never commit the real `SMTP_PASS` to version control

## Step 2: Supabase Edge Function

A Supabase Edge Function has been created at `supabase/functions/send-email/index.ts` that:
- Accepts email requests from the frontend
- Uses the Deno SMTP client (`denomailer`)
- Authenticates with Porkbun using the credentials from environment variables
- Sends emails via `smtp.porkbun.com`

### Deploy the Edge Function

```bash
# Make sure Supabase CLI is installed and authenticated
supabase functions deploy send-email
```

### Set Environment Variables in Supabase

The Edge Function needs these environment variables (secrets):

```bash
supabase secrets set SMTP_HOST=smtp.porkbun.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=inyang@lifezinc.com
supabase secrets set SMTP_PASS=YOUR_PORKBUN_EMAIL_PASSWORD
supabase secrets set SMTP_FROM_NAME="LifeZinc Support"
supabase secrets set SMTP_FROM_EMAIL=support@lifezinc.com
```

Or set them in the Supabase Dashboard:
1. Go to your project in the Supabase Dashboard
2. Navigate to **Edge Functions** → **send-email**
3. Click **Settings** → **Secrets**
4. Add each environment variable

## Step 3: Email Service Utility

The `src/utils/emailService.ts` file provides functions to send emails:

### Send Verification Email

```typescript
import { sendVerificationEmail } from '../utils/emailService';

const result = await sendVerificationEmail(
  'user@example.com',
  'https://lifezinc.com/#type=signup&token=...'
);

if (result.success) {
  console.log('Verification email sent!');
} else {
  console.error('Failed to send email:', result.error);
}
```

### Send Password Reset Email

```typescript
import { sendPasswordResetEmail } from '../utils/emailService';

const result = await sendPasswordResetEmail(
  'user@example.com',
  'https://lifezinc.com/#type=recovery&token=...'
);
```

### Send Custom Email

```typescript
import { sendEmail } from '../utils/emailService';

const result = await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to LifeZinc!',
  html: '<h1>Welcome!</h1><p>Thanks for joining.</p>',
  text: 'Welcome! Thanks for joining.' // optional plain text version
});
```

## Step 4: Supabase Auth Configuration

LifeZinc uses Supabase's built-in email verification. To use custom SMTP:

### Option A: Configure Supabase SMTP (Recommended for Auth Emails)

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Settings** → **SMTP Settings**
3. Enable **Custom SMTP**
4. Enter:
   - **Host**: `smtp.porkbun.com`
   - **Port**: `587`
   - **Username**: `inyang@lifezinc.com`
   - **Password**: `YOUR_PORKBUN_EMAIL_PASSWORD`
   - **Sender Email**: `support@lifezinc.com`
   - **Sender Name**: `LifeZinc Support`
5. Click **Test Connection** to verify
6. **Save** settings

This configures Supabase to send all auth-related emails (verification, password reset, etc.) through Porkbun SMTP.

### Option B: Use Custom Email Function

If you want full control over email templates, disable Supabase's email confirmation and handle it manually:

1. In Supabase Dashboard → **Authentication** → **Settings**
2. Disable **"Confirm email"** in Email Auth settings
3. In your signup code, call the custom email function after creating the user

## Step 5: Testing

### Test the Edge Function Directly

```bash
curl -X POST \
  'https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello!</h1><p>This is a test.</p>"
  }'
```

### Test from the App

1. Sign up with a new test email address
2. Check that the verification email arrives
3. Verify:
   - Email arrives in inbox
   - FROM shows as "LifeZinc Support <support@lifezinc.com>"
   - Email content displays correctly
   - Verification link works

### Check Email Headers

When you receive a test email:
1. Open the email
2. View full headers (varies by email client)
3. Verify:
   - `From:` is "LifeZinc Support <support@lifezinc.com>"
   - `Reply-To:` can be set if needed
   - Authentication passes (SPF, DKIM if configured on Porkbun)

## Email Templates

### Verification Email Template

The verification email includes:
- **Subject**: "Verify your LifeZinc account"
- **Sender**: "LifeZinc Support <support@lifezinc.com>"
- **Design**: Modern, gradient header with cyan/blue colors
- **Content**: Welcome message, verification button, plain link fallback
- **Mobile-friendly**: Responsive HTML design

### Password Reset Email Template

The password reset email includes:
- **Subject**: "Reset your LifeZinc password"
- **Sender**: "LifeZinc Support <support@lifezinc.com>"
- **Design**: Consistent with verification email
- **Content**: Reset instructions, reset button, security notice

## Troubleshooting

### Email Not Sending

1. **Check Edge Function Logs**:
   - Go to Supabase Dashboard → Edge Functions → send-email → Logs
   - Look for errors

2. **Verify SMTP Credentials**:
   - Test login to Porkbun webmail with the same credentials
   - Ensure password is correct and hasn't expired

3. **Check SMTP Port**:
   - Port 587 uses STARTTLS (most common)
   - Port 465 uses implicit TLS
   - Some networks block these ports

4. **Review Porkbun Settings**:
   - Ensure SMTP access is enabled for the mailbox
   - Check if there are sending limits

### Email Goes to Spam

1. **Configure SPF Record**:
   - Add Porkbun's mail servers to your SPF record
   - Example: `v=spf1 include:_spf.porkbun.com ~all`

2. **Enable DKIM**:
   - Check if Porkbun provides DKIM signing
   - Add DKIM records to your DNS

3. **Set up DMARC**:
   - Add a DMARC policy to your domain
   - Example: `v=DMARC1; p=none; rua=mailto:inyang@lifezinc.com`

4. **Check Email Content**:
   - Avoid spam trigger words
   - Include plain text version
   - Have a proper unsubscribe link (if marketing emails)

### Environment Variables Not Loading

1. **For Edge Functions**:
   - Variables must be set as Supabase secrets
   - Cannot read from local `.env` file
   - Use `supabase secrets set` command

2. **For Local Development**:
   - Create `.env.local` file
   - Supabase CLI will use it for local function testing

## Security Best Practices

1. **Never Commit Secrets**:
   - Keep `SMTP_PASS` out of version control
   - Use `.env.example` for documentation

2. **Use Environment Variables**:
   - Store credentials in Supabase secrets
   - Rotate passwords periodically

3. **Limit Access**:
   - Only use the Edge Function for authenticated requests
   - Add rate limiting if needed

4. **Monitor Usage**:
   - Check Porkbun for unusual sending patterns
   - Set up alerts for high volume

## Files Created/Modified

### New Files:
1. `supabase/functions/send-email/index.ts` - Email sending Edge Function
2. `src/utils/emailService.ts` - Email utility functions
3. `PORKBUN_SMTP_SETUP.md` - This setup guide

### Modified Files:
1. `.env` - Added SMTP configuration variables

## Support

If you encounter issues:
1. Check the Edge Function logs in Supabase Dashboard
2. Verify SMTP credentials with Porkbun support
3. Test with a simple email first
4. Review error messages in browser console

---

**Note**: This setup uses the `inyang@lifezinc.com` mailbox for SMTP authentication but displays emails as coming from `support@lifezinc.com` through Porkbun's forwarding configuration.
