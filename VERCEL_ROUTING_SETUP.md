# Vercel SPA Routing Configuration

## Overview
This document confirms that React Router is properly configured for production deployment on Vercel, ensuring all routes work with direct URL navigation and page refreshes.

## Configuration

### vercel.json
The `vercel.json` file has been configured with:

1. **SPA Rewrite Rule**: All routes (except static assets) are rewritten to `/index.html`
   - Pattern: `/:path((?!assets|.*\.(png|jpg|jpeg|gif|svg|webp|ico|webmanifest|json|js|css)).*)`
   - This ensures React Router handles all routing on the client side

2. **Cache Headers**:
   - `index.html`: No caching (ensures users get latest version)
   - `assets/*`: Long-term caching (1 year, immutable)
   - Static files: Long-term caching (1 year, immutable)

## Public Routes (No Authentication Required)

The following routes are publicly accessible and will work with direct navigation:

### Legal Pages
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/crisis-disclaimer` - Crisis Disclaimer
- `/data-deletion` - Data Deletion Instructions

### Information Pages
- `/home` - Home page
- `/about` - About Us
- `/faq` - Frequently Asked Questions
- `/contact` - Contact page
- `/mission-vision` - Mission & Vision
- `/pricing` - Pricing plans
- `/faith` - Faith & Inspiration
- `/therapist-support` - Find a Therapist
- `/teens` - For Teens
- `/school-counselors` - For School Counselors

## Protected Routes (Authentication Required)

These routes require login and redirect to `/login` if not authenticated:
- `/journal` - Journal entries
- `/calendar` - Calendar view
- `/insights` - Analytics and insights
- `/tools` - Wellness tools
- `/favorites` - Saved favorites
- `/settings` - User settings
- `/profile` - User profile
- And more...

## How It Works

1. **User visits `/privacy` directly or refreshes the page**:
   - Vercel receives request for `/privacy`
   - No static file exists at `/privacy`
   - Vercel applies rewrite rule → serves `/index.html`
   - React app loads
   - React Router sees URL is `/privacy`
   - React Router renders `<PrivacyPage />` component

2. **User visits `/logo.svg`**:
   - Vercel receives request for `/logo.svg`
   - Static file exists in `dist/` folder
   - Vercel serves the file directly (bypasses rewrite)
   - Long-term cache headers applied

## Testing in Production

After deploying to Vercel, test these scenarios:

1. ✅ Direct URL navigation: `https://yourdomain.com/privacy`
2. ✅ Page refresh on any route: Refresh while on `/privacy` page
3. ✅ Browser back/forward buttons
4. ✅ Bookmarked URLs
5. ✅ Links shared on social media or email

All should work without 404 errors.

## Static Assets

Static files are served directly and bypass the SPA rewrite:
- `/assets/*` - Build assets (JS, CSS bundles)
- `*.png`, `*.jpg`, `*.svg` - Images
- `manifest.webmanifest` - PWA manifest
- `*.json` - JSON files
- `*.js`, `*.css` - JavaScript and CSS files

## Notes

- The configuration is production-ready
- No additional setup needed for Vercel deployment
- All public routes can be shared via direct URL
- SEO crawlers can access public pages directly
