import { supabase } from '../lib/supabase';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Email send failed:', error);
      return {
        success: false,
        error: error.error || 'Failed to send email',
      };
    }

    const result = await response.json();
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error calling email function:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendVerificationEmail(userEmail: string, verifyUrl: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: userEmail,
    subject: 'Verify your LifeZinc account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your LifeZinc account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to LifeZinc!</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px;">Verify Your Email</h2>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 30px;">
                        Thank you for creating a LifeZinc account! We're excited to help you on your emotional wellness journey.
                      </p>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 30px;">
                        Please verify your email address by clicking the button below:
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${verifyUrl}"
                               style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 30px 0 0;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="color: #06b6d4; font-size: 14px; word-break: break-all; margin: 10px 0 0;">
                        ${verifyUrl}
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 10px;">
                        If you didn't create a LifeZinc account, you can safely ignore this email.
                      </p>
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} LifeZinc. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(userEmail: string, resetUrl: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: userEmail,
    subject: 'Reset your LifeZinc password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your LifeZinc password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Password Reset</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px;">Reset Your Password</h2>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 30px;">
                        We received a request to reset your LifeZinc password.
                      </p>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 30px;">
                        Click the button below to create a new password:
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${resetUrl}"
                               style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 30px 0 0;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="color: #06b6d4; font-size: 14px; word-break: break-all; margin: 10px 0 0;">
                        ${resetUrl}
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 10px;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                      </p>
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} LifeZinc. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
