# LifeZinc Email Verification Template

## Supabase Email Template Configuration

To use the custom LifeZinc email copy, configure the email template in your Supabase Dashboard:

### Step 1: Access Email Templates

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select **"Confirm signup"**

### Step 2: Configure the Template

Use the following configuration:

**Subject Line:**
```
Verify Your LifeZinc Account 🌿
```

**HTML Email Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your LifeZinc Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f9f8; color: #2c514e;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f9f8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1AB0A8 0%, #76E5D3 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">LifeZinc</h1>
              <p style="margin: 8px 0 0 0; color: #e0f7f5; font-size: 14px;">Your Daily Emotional Wellness Companion</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #2c514e; font-size: 24px; font-weight: 600;">Hi there,</h2>

              <p style="margin: 0 0 20px 0; color: #4a5f5c; font-size: 16px; line-height: 1.6;">
                Welcome to LifeZinc — we're glad you're here.
              </p>

              <p style="margin: 0 0 30px 0; color: #4a5f5c; font-size: 16px; line-height: 1.6;">
                To complete your account setup, please verify your email address by clicking the button below:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #1AB0A8 0%, #76E5D3 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(26,176,168,0.3);">
                      Verify My Email
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #f0f9f8; border-radius: 12px; padding: 20px; margin: 0 0 30px 0;">
                <p style="margin: 0 0 10px 0; color: #4a5f5c; font-size: 14px; font-weight: 600;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin: 0; color: #1AB0A8; font-size: 14px; word-break: break-all;">
                  <a href="{{ .ConfirmationURL }}" style="color: #1AB0A8; text-decoration: none;">{{ .ConfirmationURL }}</a>
                </p>
              </div>

              <p style="margin: 0 0 20px 0; color: #4a5f5c; font-size: 16px; line-height: 1.6;">
                This quick step keeps your account safe and ensures you can access all your emotional wellness tools.
              </p>

              <p style="margin: 0; color: #6b7c7a; font-size: 14px; line-height: 1.6;">
                If you didn't create a LifeZinc account, you can safely ignore this message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f0f9f8; padding: 30px; text-align: center; border-top: 1px solid #d3ebe7;">
              <p style="margin: 0 0 8px 0; color: #2c514e; font-size: 16px; font-weight: 600;">
                Warmly,
              </p>
              <p style="margin: 0 0 4px 0; color: #4a5f5c; font-size: 16px;">
                The LifeZinc Team
              </p>
              <p style="margin: 0; color: #6b7c7a; font-size: 14px; font-style: italic;">
                Your Daily Emotional Wellness Companion
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**Plain Text Email Body (Fallback):**
```
Hi there,

Welcome to LifeZinc — we're glad you're here.

To complete your account setup, please verify your email address by clicking the link below:

{{ .ConfirmationURL }}

This quick step keeps your account safe and ensures you can access all your emotional wellness tools.

If you didn't create a LifeZinc account, you can safely ignore this message.

Warmly,
The LifeZinc Team
Your Daily Emotional Wellness Companion
```

### Step 3: Save Template

1. Click **Save** after pasting the template
2. Send a test email to verify formatting
3. Check both desktop and mobile display

## Important Notes

- **{{ .ConfirmationURL }}** is Supabase's variable for the verification link
- The link automatically includes the token and proper redirect
- Email is sent automatically when user signs up
- No additional code changes needed - Supabase handles sending

## Email Preview

The email will have:
- ✅ Beautiful branded header with teal gradient
- ✅ Clear "Verify My Email" button
- ✅ Fallback link in case button doesn't work
- ✅ Professional, friendly tone
- ✅ Mobile-responsive design
- ✅ Branded footer with team signature

## Testing

After configuring the template:

1. Create a new test account
2. Check your email inbox
3. Verify the email matches the design
4. Click "Verify My Email" button
5. Confirm redirect to app works
6. Verify you can access the app

## Troubleshooting

If emails aren't being sent:
1. Check **Authentication** → **Settings** → **Email Auth** is enabled
2. Verify "Confirm email" is turned ON
3. Check SMTP settings in production
4. Look at Supabase logs for email errors
5. Check spam folder

If email looks broken:
1. Some email clients don't support CSS - that's why we have plain text fallback
2. Test in multiple email clients (Gmail, Outlook, Apple Mail)
3. Use Litmus or Email on Acid for comprehensive testing
