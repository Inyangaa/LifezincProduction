# Porkbun SMTP Deployment Checklist

Quick checklist for deploying the Porkbun SMTP email functionality.

## Pre-Deployment Checklist

### 1. Verify Porkbun Credentials
- [ ] Test login to Porkbun webmail with `inyang@lifezinc.com`
- [ ] Confirm password is correct and active
- [ ] Verify SMTP access is enabled for the mailbox
- [ ] Check that forwarding is configured for:
  - `support@lifezinc.com` → `inyang@lifezinc.com`
  - `feedback@lifezinc.com` → `inyang@lifezinc.com`
  - `partners@lifezinc.com` → `inyang@lifezinc.com`

### 2. Update Environment Variables
- [ ] Add SMTP variables to `.env` file (for reference only)
- [ ] **IMPORTANT**: Replace `YOUR_PORKBUN_EMAIL_PASSWORD_FOR_INYANG` with actual password

## Deployment Steps

### Step 1: Deploy Edge Function

```bash
# Deploy the send-email function to Supabase
supabase functions deploy send-email
```

Expected output:
```
✓ Deployed Function send-email
  URL: https://zelbbjeuaalevquxsajs.supabase.co/functions/v1/send-email
```

### Step 2: Set Supabase Secrets

```bash
# Set all required secrets (replace with actual values)
supabase secrets set SMTP_HOST=smtp.porkbun.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=inyang@lifezinc.com
supabase secrets set SMTP_PASS=ACTUAL_PASSWORD_HERE
supabase secrets set SMTP_FROM_NAME="LifeZinc Support"
supabase secrets set SMTP_FROM_EMAIL=support@lifezinc.com
```

**Alternative: Set via Dashboard**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** → **send-email** → **Settings**
4. Add secrets in the **Environment Variables** section

### Step 3: Configure Supabase Auth SMTP (Recommended)

1. Go to Supabase Dashboard
2. **Authentication** → **Settings** → **SMTP Settings**
3. Enable **Custom SMTP**
4. Enter:
   - Host: `smtp.porkbun.com`
   - Port: `587`
   - Username: `inyang@lifezinc.com`
   - Password: (actual password)
   - Sender Email: `support@lifezinc.com`
   - Sender Name: `LifeZinc Support`
5. Click **Test Connection**
6. Click **Save**

## Testing

### Test 1: Direct Edge Function Call

```bash
# Replace with your actual values
curl -X POST \
  'https://zelbbjeuaalevquxsajs.supabase.co/functions/v1/send-email' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "YOUR_TEST_EMAIL@gmail.com",
    "subject": "LifeZinc SMTP Test",
    "html": "<h1>Test Email</h1><p>If you receive this, Porkbun SMTP is working!</p>"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Test 2: Sign Up Flow

1. Open LifeZinc app in incognito/private mode
2. Click "Sign Up"
3. Enter a test email address (use a real email you can access)
4. Complete signup
5. Check the test email inbox
6. Verify:
   - [ ] Email arrives within 1-2 minutes
   - [ ] FROM shows as "LifeZinc Support <support@lifezinc.com>"
   - [ ] Subject is "Verify your LifeZinc account"
   - [ ] Email design looks correct (gradient header, button)
   - [ ] Verification button link is clickable
7. Click "Verify Email Address" button
8. Verify:
   - [ ] Redirects to LifeZinc app
   - [ ] Shows success message
   - [ ] Can now log in

### Test 3: Password Reset Flow

1. On login page, click "Forgot Password?"
2. Enter a registered email address
3. Check email inbox
4. Verify:
   - [ ] Email arrives
   - [ ] FROM shows as "LifeZinc Support <support@lifezinc.com>"
   - [ ] Subject is "Reset your LifeZinc password"
   - [ ] Reset button link works

### Test 4: Email Headers

1. Receive a test email
2. View full email headers
3. Check for:
   - [ ] `From: "LifeZinc Support" <support@lifezinc.com>`
   - [ ] `Return-Path: inyang@lifezinc.com` (or similar)
   - [ ] SPF pass (if configured)
   - [ ] DKIM pass (if configured)

## Troubleshooting

### Issue: Email Not Sending

**Check Edge Function Logs:**
```bash
# Or view in Supabase Dashboard → Edge Functions → send-email → Logs
```

Common errors:
- `SMTP authentication failed` → Wrong password
- `Connection timeout` → Firewall blocking port 587
- `SMTP configuration incomplete` → Secrets not set

**Fix:**
1. Verify secrets are set: `supabase secrets list`
2. Check password is correct
3. Try port 465 instead of 587 (update secret)

### Issue: Email Goes to Spam

**Solutions:**
1. Add SPF record to DNS:
   ```
   v=spf1 include:_spf.porkbun.com ~all
   ```

2. Enable DKIM in Porkbun (if available)

3. Add DMARC record:
   ```
   v=DMARC1; p=none; rua=mailto:inyang@lifezinc.com
   ```

4. Warm up the email domain by sending to known addresses first

### Issue: "FROM" Shows Wrong Address

If emails show `From: inyang@lifezinc.com` instead of `support@lifezinc.com`:

1. Check `SMTP_FROM_EMAIL` secret is set correctly
2. Verify Porkbun allows custom FROM addresses
3. Some SMTP servers require FROM to match auth user (in this case, it won't work)

**Workaround:** Use `Reply-To: support@lifezinc.com` header instead

## Production Checklist

Before going live:

- [ ] All secrets are set in production Supabase project
- [ ] Test email from production app works
- [ ] SPF/DKIM records are configured
- [ ] Email templates are reviewed and approved
- [ ] Unsubscribe mechanism in place (if needed for marketing emails)
- [ ] Rate limiting configured (if needed)
- [ ] Monitoring/alerts set up for email delivery
- [ ] Backup email method configured (optional)

## Monitoring

### Check Email Sending Stats

1. Supabase Dashboard → Edge Functions → send-email
2. View invocation count and errors
3. Set up alerts for failures

### Porkbun Mailbox

1. Regularly check `inyang@lifezinc.com` inbox
2. Monitor for bounce-backs
3. Review sending limits

## Security Reminders

- [ ] Never commit `SMTP_PASS` to git
- [ ] Rotate password every 90 days
- [ ] Use strong password (16+ characters)
- [ ] Enable 2FA on Porkbun account
- [ ] Monitor for unauthorized access

## Files Reference

- **Edge Function**: `supabase/functions/send-email/index.ts`
- **Email Service**: `src/utils/emailService.ts`
- **Environment**: `.env` (local), Supabase Secrets (production)
- **Setup Guide**: `PORKBUN_SMTP_SETUP.md`
- **This Checklist**: `SMTP_DEPLOYMENT_CHECKLIST.md`

## Support Contacts

- **Porkbun Support**: https://porkbun.com/contact
- **Supabase Support**: https://supabase.com/support
- **Email Issues**: Check logs first, then contact Porkbun

---

**Last Updated**: November 27, 2025
**Status**: Ready for deployment
