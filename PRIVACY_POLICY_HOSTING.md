# How to Host Your Privacy Policy

Your privacy policy must be publicly accessible via a URL for app store submission. Here are your options:

## Option 1: Add to Your Existing Website (Best)

If you have a website for LifeZinc:

1. Create a page at: `https://yourwebsite.com/privacy`
2. Copy the PRIVACY_POLICY.md content
3. Convert to HTML or use your CMS
4. Publish and make accessible
5. Use this URL in app store submissions

## Option 2: GitHub Pages (Free & Easy)

### Quick Setup:

1. **Create a new repository** (or use existing):
   - Go to GitHub.com
   - New repository: `lifezinc-privacy`
   - Public repository

2. **Create index.html**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LifeZinc Privacy Policy</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 { color: #1AB0A8; }
        h2 { color: #0F766E; margin-top: 2em; }
        h3 { color: #0D9488; }
        a { color: #1AB0A8; }
        .last-updated {
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <!-- Paste your privacy policy HTML here -->
</body>
</html>
```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Pages section
   - Source: Deploy from main branch
   - Save

4. **Access your policy**:
   - URL: `https://yourusername.github.io/lifezinc-privacy/`
   - Use this URL in app stores

### Convert Markdown to HTML:

Use one of these tools:
- https://markdowntohtml.com/
- https://markdown-it.github.io/
- VS Code extension: "Markdown Preview Enhanced"

## Option 3: Vercel/Netlify (Free)

### Vercel:

1. Install Vercel CLI: `npm install -g vercel`
2. Create `privacy/index.html` with your policy
3. Run: `vercel`
4. Follow prompts
5. Get URL: `https://your-project.vercel.app/privacy`

### Netlify:

1. Go to netlify.com
2. Drag and drop folder with `index.html`
3. Get URL: `https://your-site.netlify.app/`

## Option 4: Google Sites (Free & Very Easy)

1. Go to sites.google.com
2. Create new site
3. Add text with your privacy policy
4. Publish
5. Get URL: `https://sites.google.com/view/lifezinc-privacy`

## Option 5: Notion (Free)

1. Create Notion page
2. Paste privacy policy
3. Click Share > Share to web
4. Toggle on "Share to web"
5. Copy public URL
6. Use in app store listings

## Requirements for App Stores

Your privacy policy URL must:
- [ ] Be publicly accessible (no login required)
- [ ] Load quickly
- [ ] Be mobile-friendly
- [ ] Remain available indefinitely
- [ ] Match the app's actual practices
- [ ] Be in English (and other languages if supporting them)

## What to Update in Privacy Policy

Before publishing, replace placeholders:

1. **Contact Email:**
   - Replace `privacy@lifezinc.com` with your actual email
   - Replace `support@lifezinc.com` with your actual support email

2. **Last Updated Date:**
   - Update to publication date

3. **Mailing Address:**
   - Add your business address (required in some jurisdictions)
   - Can use virtual office or registered agent

4. **Website URLs:**
   - Replace placeholder URLs with actual URLs

5. **Company Name:**
   - If operating as LLC, update accordingly

## After Publishing

1. **Test the URL:**
   - Open in browser
   - Test on mobile
   - Verify all links work

2. **Save the URL:**
   - You'll need it for both app stores
   - Keep it accessible

3. **Add to App:**
   - Link from Settings > Privacy Policy
   - Include in About section

4. **Keep Updated:**
   - Update when practices change
   - Notify users of significant changes
   - Update "Last Updated" date

## Recommended: Add to Your App

Update your settings page to link to the privacy policy:

```tsx
// In SettingsPage.tsx or similar
<a
  href="https://your-privacy-policy-url.com"
  target="_blank"
  className="text-teal-500 hover:underline"
>
  Privacy Policy
</a>
```

## Quick Checklist

Before submitting to app stores:
- [ ] Privacy policy written and reviewed
- [ ] Contact emails added (replace placeholders)
- [ ] Date updated to current date
- [ ] Converted to HTML or published
- [ ] Hosted on public URL
- [ ] URL tested on mobile and desktop
- [ ] URL added to app store listings
- [ ] URL linked from within the app
- [ ] URL saved for future reference

## Example URLs to Use

**Google Play Console:**
- Field: "Privacy Policy"
- Enter: `https://your-site.com/privacy`

**App Store Connect:**
- Field: "Privacy Policy URL"
- Enter: `https://your-site.com/privacy`

---

**Recommendation:**
Use GitHub Pages for quick, free hosting with full control. It's professional, reliable, and easy to update.
