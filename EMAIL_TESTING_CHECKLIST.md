# 📧 EMAIL SYSTEM TESTING CHECKLIST

## ⚠️ PREREQUISITE: Set SMTP Password Secret

**BEFORE testing, you MUST manually set the SMTP password in Supabase:**

1. Go to: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs/settings/secrets
2. Click "Add new secret"
3. Name: `SMTP_PASS`
4. Value: `SMTP_Archi#bong1aaa...`
5. Click "Add secret"

---

## 🧪 Test 1: Direct Email Function Test

Test the edge function directly using curl:

```bash
./test-email.sh
```

**OR manually:**

```bash
curl -X POST "https://zelbbjeuaalevquxsajs.supabase.co/functions/v1/send-email" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbGJiamV1YWFsZXZxdXhzYWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODM2NjcsImV4cCI6MjA3OTA1OTY2N30.DXIzUcaF6XgP2DkVD0X3678ASZNSrmTr8O4vMoWIaaY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@example.com",
    "subject": "LifeZinc Test Email",
    "html": "<h1>Test Email</h1><p>If you receive this, email sending is working!</p>"
  }'
```

**Expected Response:**
```json
{"success":true,"message":"Email sent successfully"}
```

**Check:** Your email inbox (and spam folder)

---

## 🧪 Test 2: Email Verification Flow (End-to-End)

### Step 2a: Sign Up New User

1. Go to: https://lifezinc-app.vercel.app/ (or your deployed URL)
2. Click "Get Started" or "Sign Up"
3. Enter:
   - **Email:** YOUR_REAL_EMAIL@example.com
   - **Password:** Test123!@#
4. Click "Sign Up"

**Expected:** User redirected to "Check your email" page

### Step 2b: Check Email

1. Open your email inbox
2. Look for email from "LifeZinc Support <support@lifezinc.com>"
3. Subject: "Verify your LifeZinc account"
4. Check spam folder if not in inbox

**Expected:** Beautiful HTML email with "Verify Email Address" button

### Step 2c: Click Verification Link

1. Click "Verify Email Address" button in email
2. **OR** copy/paste the URL from the email into browser

**Expected:**
- Redirected to app
- See "Email verified successfully!" message
- Automatically logged in
- Can access journal and other features

### Step 2d: Verify in Database

```sql
SELECT id, email, email_verified, created_at
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com'
);
```

**Expected:** `email_verified = true`

---

## 🧪 Test 3: Password Reset Flow (End-to-End)

### Step 3a: Request Password Reset

1. Go to: https://lifezinc-app.vercel.app/
2. Click "Login"
3. Click "Forgot Password?"
4. Enter: YOUR_VERIFIED_EMAIL@example.com
5. Click "Send Reset Link"

**Expected:** See "Password reset email sent" message

### Step 3b: Check Email

1. Open your email inbox
2. Look for email from "LifeZinc Support <support@lifezinc.com>"
3. Subject: "Reset your LifeZinc password"
4. Check spam folder if not in inbox

**Expected:** Beautiful HTML email with "Reset Password" button

### Step 3c: Click Reset Link

1. Click "Reset Password" button in email
2. **OR** copy/paste the URL from the email into browser

**Expected:**
- Redirected to "Reset Password" page
- See form to enter new password

### Step 3d: Set New Password

1. Enter new password: NewPassword123!@#
2. Confirm password: NewPassword123!@#
3. Click "Reset Password"

**Expected:**
- See "Password updated successfully!" message
- Redirected to login page

### Step 3e: Login with New Password

1. Go to login page
2. Enter:
   - Email: YOUR_EMAIL@example.com
   - Password: NewPassword123!@#
3. Click "Login"

**Expected:** Successfully logged in and redirected to journal

---

## ✅ Success Criteria

- [ ] Direct email test receives email within 1 minute
- [ ] Email verification email received within 1 minute
- [ ] Email verification link works and sets `email_verified = true`
- [ ] User can access app after email verification
- [ ] Password reset email received within 1 minute
- [ ] Password reset link works and allows new password
- [ ] User can login with new password
- [ ] All emails render correctly (not plain text)
- [ ] All emails end up in inbox (not spam)

---

## 🐛 Troubleshooting

### Issue: "SMTP configuration incomplete" error

**Solution:** SMTP_PASS secret not set in Supabase Dashboard. Follow prerequisite step above.

### Issue: Email not received after 5 minutes

**Possible causes:**
1. SMTP password incorrect - check Porkbun account
2. Porkbun SMTP service down - check status
3. Email blocked by recipient server - check spam folder
4. Rate limiting on Porkbun - wait 10 minutes and retry

**Debug:**
```bash
# Check Supabase edge function logs
# Go to: https://supabase.com/dashboard/project/zelbbjeuaalevquxsajs/logs/edge-functions
# Look for "send-email" function logs
# Check for SMTP connection errors
```

### Issue: Email in spam folder

**Solution:** Add `support@lifezinc.com` to contacts / safe senders list

### Issue: Verification link doesn't work

**Possible causes:**
1. Token expired (expires after 24 hours)
2. Token already used
3. URL malformed (check for line breaks in email)

**Debug:**
```sql
SELECT email_verification_token, email_verification_token_expires_at
FROM user_profiles
WHERE user_id = 'USER_ID_HERE';
```

---

## 📊 Monitoring

After testing, monitor these metrics:

1. **Email Delivery Rate**
   - Check Supabase edge function logs
   - Count successful vs failed sends

2. **Email Open Rate**
   - Currently not tracked
   - Consider adding tracking pixels later

3. **Verification Rate**
   - Query: `SELECT COUNT(*) FROM user_profiles WHERE email_verified = true`
   - Compare to total signups

4. **Time to Verify**
   - Track time between signup and verification
   - Target: <5 minutes for 90% of users

---

## 🚀 Next Steps After Email Works

1. ✅ Configure Stripe payments
2. ✅ Test payment flow end-to-end
3. ✅ Add rate limiting to email function (5 emails/hour per user)
4. ✅ Add email delivery monitoring
5. ✅ Consider transactional email service (SendGrid, Postmark) for production scale
