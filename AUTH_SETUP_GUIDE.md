# Authentication Setup Guide

## Overview
Complete authentication and session management guide for LifeZinc, including Supabase configuration and Vercel deployment URLs.

---

## 🔐 Auth Features Implemented

### ✅ Session Persistence
- **Auto-restore on refresh**: Sessions persist across page reloads using `localStorage`
- **Token auto-refresh**: Automatic token renewal before expiration
- **Session detection**: Checks for existing session on app initialization

### ✅ Login/Logout Flow
- **Unified login page**: Single entry point for authentication
- **Role selection**: Member vs Therapist login paths
- **Smart routing**: Automatically routes to appropriate page after login
- **Complete logout**: Clears all session data, localStorage, and sessionStorage

### ✅ Password Reset
- **Forgot password flow**: Email-based password reset
- **Secure tokens**: Uses Supabase Auth recovery tokens
- **Reset confirmation**: Visual feedback throughout process

### ✅ Email Verification
- **Signup verification**: Custom email verification system
- **Token-based**: Secure verification tokens
- **Dev mode**: Currently disabled for development

### ✅ Auth Callback Handler
- **Dedicated route**: `/auth/callback` for OAuth and email verification
- **Error handling**: Graceful error messages and redirects
- **Multi-flow support**: Handles OAuth, email verification, and password reset

---

## 🌐 Vercel Redirect URLs

### Required URLs in Supabase Dashboard

Configure these redirect URLs in your Supabase project:
**Dashboard → Authentication → URL Configuration → Redirect URLs**

#### Production URLs (replace `your-app.vercel.app` with your domain)

```
https://your-app.vercel.app
https://your-app.vercel.app/
https://your-app.vercel.app/#
https://your-app.vercel.app/#/
https://your-app.vercel.app/#/auth-callback
https://your-app.vercel.app/#/reset-password
https://your-app.vercel.app/#/verify-email
https://your-app.vercel.app/**
```

#### Local Development URLs

```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/#
http://localhost:5173/#/
http://localhost:5173/#/auth-callback
http://localhost:5173/#/reset-password
http://localhost:5173/#/verify-email
http://localhost:3000
http://localhost:3000/
http://localhost:3000/#
http://localhost:3000/#/
http://localhost:3000/#/auth-callback
```

### Site URL Configuration

**Dashboard → Authentication → URL Configuration → Site URL**

```
Production: https://your-app.vercel.app
Development: http://localhost:5173
```

---

## 📋 Supabase Auth Configuration

### Email Templates

#### Confirm Signup Template
```html
<h2>Confirm your email</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
```

#### Reset Password Template
```html
<h2>Reset your password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

#### Magic Link Template
```html
<h2>Magic Link</h2>
<p>Follow this link to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
```

### Auth Settings

**Dashboard → Authentication → Settings**

- ✅ Enable Email Confirmations: **OFF** (for dev mode)
- ✅ Enable Email Change Confirmations: **ON**
- ✅ Enable Password Recovery: **ON**
- ✅ Secure Email Change: **ON**
- ⚙️ Token Expiry: **3600** seconds (1 hour)
- ⚙️ Refresh Token Rotation: **ON**
- ⚙️ Session Duration: **604800** seconds (7 days)

---

## 🔧 Environment Variables

Required in `.env` and Vercel:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Email service (for custom verification emails)
VITE_SMTP_HOST=your-smtp-host
VITE_SMTP_PORT=587
VITE_SMTP_USER=your-smtp-user
VITE_SMTP_PASS=your-smtp-password
VITE_SMTP_FROM_EMAIL=noreply@yourdomain.com
VITE_SMTP_FROM_NAME=LifeZinc
```

---

## 🚀 Deployment Steps

### 1. Vercel Configuration

```json
// vercel.json (already configured)
{
  "rewrites": [
    {
      "source": "/((?!assets|manifest\\.json|sw\\.js|.*\\.png|.*\\.jpg|.*\\.svg).*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Environment Variables in Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Add all variables from `.env`
3. Set for: Production, Preview, Development
4. Redeploy after adding variables

### 3. Supabase Configuration

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add all redirect URLs listed above
3. Set Site URL to your production domain
4. Save changes

### 4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## 🧪 Testing Auth Flows

### Session Persistence Test
1. Sign in to the app
2. Refresh the page (F5 or Cmd+R)
3. ✅ Should remain logged in
4. Close browser and reopen
5. ✅ Should still be logged in (within 7 days)

### Logout Test
1. Sign in to the app
2. Navigate to Settings → Sign Out
3. ✅ Should redirect to signed-out page
4. Check localStorage: ✅ Should be cleared
5. Try to access protected pages: ✅ Should redirect to login

### Password Reset Test
1. Click "Forgot password?" on login page
2. Enter your email address
3. ✅ Should see success message
4. Check email for reset link
5. Click link → ✅ Should open reset password page
6. Enter new password
7. ✅ Should see success and redirect to login
8. Login with new password: ✅ Should work

### Login Routing Test
1. Logout if logged in
2. Go to login page
3. Enter credentials and sign in
4. ✅ First-time users → profile-setup
5. ✅ Therapists without profile → therapist-setup
6. ✅ Complete users → journal
7. ✅ Should NOT skip steps or auto-redirect incorrectly

---

## 🔍 Debugging

### Enable Debug Logs

All auth operations log to console. Open DevTools and filter by:
- `[Auth]` - AuthContext operations
- `[App]` - App routing and initialization
- `[AuthCallback]` - OAuth and callback handling
- `[routeAfterAuth]` - Post-login routing logic

### Common Issues

#### Issue: "Session not persisting"
**Solution:** Check that `persistSession: true` in `lib/supabase.ts`

#### Issue: "Redirect loop after login"
**Solution:** Check that `routeAfterAuth` logic doesn't have circular redirects

#### Issue: "OAuth redirect fails"
**Solution:** Verify redirect URL is added in Supabase Dashboard

#### Issue: "Password reset link invalid"
**Solution:** Ensure `type=recovery` is in hash params and redirectTo URL is correct

#### Issue: "Auto-logout on refresh"
**Solution:** Check browser localStorage is enabled and not cleared by extensions

---

## 📝 Auth Flow Diagrams

### Login Flow
```
User enters credentials
    ↓
signIn() called
    ↓
Supabase authenticates
    ↓
Session created in localStorage
    ↓
routeAfterAuth() determines destination
    ↓
Check: Profile exists?
    ├─ NO → profile-setup
    └─ YES → Check: Therapist without profile?
              ├─ YES → therapist-setup
              └─ NO → journal (main app)
```

### Logout Flow
```
User clicks "Sign Out"
    ↓
signOut() called
    ↓
Clear React state immediately
    ↓
Call supabase.auth.signOut()
    ↓
Clear localStorage (auth + custom keys)
    ↓
Clear sessionStorage
    ↓
Redirect to /#/signed-out
    ↓
Force page reload
```

### Password Reset Flow
```
User clicks "Forgot password"
    ↓
Enter email → Submit
    ↓
supabase.auth.resetPasswordForEmail()
    ↓
Email sent with recovery link
    ↓
User clicks link in email
    ↓
Redirects to /#/auth-callback
    ↓
AuthCallbackPage detects type=recovery
    ↓
Redirect to /#/reset-password
    ↓
User enters new password
    ↓
supabase.auth.updateUser()
    ↓
Success → Redirect to login
```

### Session Restoration Flow
```
Page loads
    ↓
AuthContext initializes
    ↓
supabase.auth.getSession()
    ↓
Check localStorage for session
    ├─ Found → Restore session
    │   ↓
    │   Validate token expiry
    │   ├─ Valid → Set user in state
    │   └─ Expired → Auto-refresh token
    └─ Not found → User is logged out
```

---

## 🔒 Security Considerations

### Session Security
- ✅ PKCE flow enabled for OAuth
- ✅ HTTP-only cookies not used (SPA architecture)
- ✅ Auto token refresh prevents session expiry
- ✅ Tokens stored in localStorage (XSS mitigation via CSP)

### Password Security
- ✅ Minimum 8 characters
- ✅ Must include uppercase, lowercase, number, special char
- ✅ Validated on client and server
- ✅ Bcrypt hashing by Supabase

### CSRF Protection
- ✅ Supabase handles CSRF with state parameter
- ✅ No cookies = No CSRF vulnerability

### Rate Limiting
- ⚠️ Configure in Supabase Dashboard
- Recommended: 10 requests/minute per IP

---

## 📚 Related Files

### Core Auth Files
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/lib/supabase.ts` - Supabase client configuration
- `src/utils/authRouting.ts` - Post-login routing logic

### Auth Pages
- `src/components/UnifiedLoginPage.tsx` - Login UI
- `src/components/UnifiedSignUpPage.tsx` - Signup UI
- `src/components/ForgotPasswordPage.tsx` - Password reset request
- `src/components/ResetPasswordPage.tsx` - New password entry
- `src/components/AuthCallbackPage.tsx` - OAuth/email callback handler
- `src/components/SignedOutPage.tsx` - Post-logout page

### Profile Setup
- `src/components/ProfileSetupPage.tsx` - Initial profile creation
- `src/components/TherapistSetupPage.tsx` - Therapist onboarding

---

## �� Production Checklist

Before deploying to production:

- [ ] Add all redirect URLs to Supabase Dashboard
- [ ] Set production Site URL in Supabase
- [ ] Configure environment variables in Vercel
- [ ] Enable email confirmations in Supabase (if desired)
- [ ] Set up custom email templates
- [ ] Configure SMTP for transactional emails
- [ ] Test OAuth flows (if using)
- [ ] Test password reset end-to-end
- [ ] Test session persistence across devices
- [ ] Verify logout clears all data
- [ ] Enable rate limiting in Supabase
- [ ] Add CSP headers for XSS protection
- [ ] Configure custom domain (if applicable)
- [ ] Test on multiple browsers/devices

---

## 📞 Support

### Supabase Support
- Documentation: https://supabase.com/docs/guides/auth
- Discord: https://discord.supabase.com

### Vercel Support
- Documentation: https://vercel.com/docs
- Discord: https://discord.gg/vercel

---

## 🔄 Recent Changes

### 2026-01-27
- ✅ Fixed session persistence on refresh
- ✅ Prevented auto-skip from login when not authenticated
- ✅ Enhanced logout to fully clear all session data
- ✅ Fixed password reset flow bugs
- ✅ Added dedicated auth callback route handler
- ✅ Improved routing logic after authentication
- ✅ Added comprehensive logging for debugging

---

## ⚡ Quick Reference

### Key URLs
| Purpose | URL Pattern |
|---------|-------------|
| Login | `/#/unified-login` |
| Signup | `/#/unified-signup` |
| Password Reset Request | `/#/forgot-password` |
| Password Reset Form | `/#/reset-password` |
| Auth Callback | `/#/auth-callback` |
| Email Verification | `/#/verify-email` |
| Signed Out | `/#/signed-out` |

### Key Functions
| Function | Location | Purpose |
|----------|----------|---------|
| `signIn()` | `AuthContext.tsx` | Authenticate user |
| `signOut()` | `AuthContext.tsx` | End session |
| `signUp()` | `AuthContext.tsx` | Create account |
| `routeAfterAuth()` | `authRouting.ts` | Determine post-login destination |

---

**Last Updated:** January 27, 2026
**Version:** 2.0
**Status:** ✅ Production Ready
