# PWABuilder Deployment Guide

PWABuilder is the fastest way to generate native app packages from your PWA without writing native code.

## What is PWABuilder?

**PWABuilder** (pwabuilder.com) analyzes your Progressive Web App and generates:
- **Android package** (.aab file) for Google Play Store
- **iOS package** (Xcode project) for Apple App Store
- **Windows package** for Microsoft Store (optional)

**Benefits:**
- No native development experience needed
- Free to use
- Generates store-ready packages
- Regular updates and support

## Prerequisites

Before using PWABuilder, ensure:
- [ ] Your PWA is deployed and accessible via HTTPS
- [ ] manifest.json is configured correctly
- [ ] Service worker is registered and working
- [ ] App icons are in place (icon-192.png, icon-512.png)
- [ ] Privacy policy is hosted and accessible
- [ ] Screenshots are ready

## Step-by-Step Guide

### Step 1: Access PWABuilder

1. **Go to:** https://www.pwabuilder.com
2. **Enter your deployed LifeZinc URL** in the input field
   - Example: `https://lifezinc.com` or `https://your-app.vercel.app`
3. **Click "Start"**

### Step 2: Review PWA Score

PWABuilder analyzes your app and shows scores for:

**Manifest:**
- Should be green (passed)
- Checks for required fields, icons, display mode

**Service Worker:**
- Should be green (passed)
- Verifies offline functionality

**Security (HTTPS):**
- Should be green (passed)
- Required for PWAs

**If any score is low:**
- Click on the category to see issues
- Fix issues in your code
- Re-deploy and try again

### Step 3: Generate Android Package

**Click "Publish to Store" tab**

#### Android (Google Play) Setup

1. **Select "Android" option**

2. **Choose Package Type:**
   - **Trusted Web Activity (TWA)** ← Recommended
     - Wraps your PWA in native app
     - No code changes needed
     - Full PWA features
     - Smaller app size

3. **Fill in App Details:**

   **Package ID:**
   ```
   com.lifezinc.app
   ```
   - Must be unique
   - Cannot change after first publish
   - Use reverse domain notation

   **App Name:**
   ```
   LifeZinc
   ```

   **Launcher Name:**
   ```
   LifeZinc
   ```
   - Appears under app icon on home screen

   **App Version:**
   ```
   1.0.0
   ```
   - Increment for each update

   **App Version Code:**
   ```
   1
   ```
   - Integer, increment for each update
   - Must always increase

   **Host:**
   ```
   your-deployed-url.com
   ```
   - Your PWA's domain (without https://)

   **Start URL:**
   ```
   /
   ```
   - Usually just `/`

4. **Configure Advanced Options (Optional):**

   **Display Mode:**
   - `standalone` (recommended)
   - Makes app feel native

   **Status Bar Color:**
   ```
   #1AB0A8
   ```
   - Matches your theme color

   **Splash Screen:**
   - Background: `#ffffff`
   - Icon: Uses your maskable-icon-512.png

   **Signing:**
   - Choose "New Signing Key"
   - PWABuilder generates for you
   - Download and save the signing key (important!)

5. **Click "Generate Package"**

6. **Download Files:**
   - `app-release-signed.aab` - Upload to Play Store
   - `signing-key.zip` - SAVE THIS! Needed for updates
   - `assetlinks.json` - Upload to your website

7. **Important: Deploy assetlinks.json**

   PWABuilder provides an `assetlinks.json` file:

   **Where to put it:**
   ```
   https://your-site.com/.well-known/assetlinks.json
   ```

   **How to deploy:**
   - Create folder: `public/.well-known/`
   - Place `assetlinks.json` inside
   - Re-deploy your app
   - Verify it's accessible at the URL above

   **Why it's needed:**
   - Links your website to your Android app
   - Enables deep linking
   - Required for TWA to work properly

### Step 4: Generate iOS Package

**Back on PWABuilder:**

1. **Click "iOS" option**

2. **Download Xcode Project:**
   - PWABuilder generates an Xcode project
   - Downloads as .zip file
   - Extract the file

3. **Requirements:**
   - **Mac computer** with macOS (required for Xcode)
   - **Xcode** installed (free from Mac App Store)
   - **Apple Developer Account** (signed in)

4. **Open in Xcode:**
   - Locate the extracted folder
   - Double-click the `.xcodeproj` file
   - Opens in Xcode

5. **Configure Project:**

   **Bundle Identifier:**
   ```
   com.lifezinc.app
   ```
   - Should match Android package ID
   - Set in Xcode project settings

   **Signing:**
   - Select your team (Apple Developer account)
   - Xcode handles code signing automatically
   - Ensure "Automatically manage signing" is checked

   **Update Info.plist:**
   - App name
   - Version (1.0.0)
   - Build number (1)
   - Privacy descriptions if needed

6. **Build and Archive:**
   - Select "Any iOS Device" as destination
   - Product > Archive
   - Wait for build to complete
   - Archive appears in Organizer

7. **Upload to App Store:**
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow upload wizard
   - Upload succeeds → ready for App Store Connect

**Alternative if no Mac:**
- Use **MacInCloud** ($30/month for cloud Mac)
- Use **MacStadium** ($99/month for dedicated Mac)
- Find friend/coworker with Mac
- Consider waiting until you can access a Mac

### Step 5: Test Your Packages

**Before submitting to stores:**

**Test Android Package:**

1. **Install on Android device:**
   - Enable Developer Mode on device
   - Enable USB Debugging
   - Connect via USB
   - Install with ADB:
   ```bash
   adb install app-release-signed.aab
   ```

2. **Or use Google Play Console Internal Testing:**
   - Upload .aab to internal test track
   - Add yourself as tester
   - Install via Play Store

**Test iOS Package:**

1. **Install on iOS device (TestFlight):**
   - Upload build to App Store Connect
   - Add to TestFlight
   - Install on your iPhone
   - Test all features

2. **Verify:**
   - App installs correctly
   - All features work
   - Offline mode works
   - No console errors
   - Links open properly

## Common Issues and Solutions

### Issue: PWA Score Too Low

**Problem:** Manifest or service worker issues

**Solution:**
1. Check manifest.json syntax (use JSON validator)
2. Verify service worker is registered
3. Ensure HTTPS is working
4. Clear cache and refresh
5. Check browser console for errors

### Issue: assetlinks.json Not Found

**Problem:** Android app won't open or shows URL bar

**Solution:**
1. Verify file is at: `https://your-site.com/.well-known/assetlinks.json`
2. Check file is public and accessible
3. Ensure JSON is valid
4. Wait a few minutes for propagation
5. Test URL in browser

### Issue: iOS Build Fails

**Problem:** Code signing errors or build failures

**Solution:**
1. Ensure Apple Developer account is active
2. Check bundle identifier is unique
3. Update Xcode to latest version
4. Clean build folder (Cmd+Shift+K)
5. Try "Automatically manage signing"
6. Restart Xcode

### Issue: Icons Not Showing

**Problem:** App icons don't appear correctly

**Solution:**
1. Verify icon files exist at specified paths
2. Check icon dimensions are exact
3. Ensure manifest.json has correct icon entries
4. Re-generate package with PWABuilder
5. Clear app cache and reinstall

### Issue: App Opens in Browser

**Problem:** Android app opens browser instead of fullscreen

**Solution:**
1. Verify assetlinks.json is deployed correctly
2. Check TWA configuration in PWABuilder
3. Ensure start_url in manifest matches
4. Verify host setting is correct
5. Reinstall app after fixing

## Updating Your App

### For Android Updates:

1. **Make changes to your PWA**
2. **Deploy changes**
3. **Go to PWABuilder** and re-generate package
4. **Increment version numbers:**
   - Version: 1.0.1, 1.1.0, 2.0.0, etc.
   - Version Code: 2, 3, 4, etc. (must always increase)
5. **Use SAME signing key** (from original signing-key.zip)
6. **Upload new .aab** to Play Console

### For iOS Updates:

1. **Make changes to your PWA**
2. **Deploy changes**
3. **Open Xcode project**
4. **Increment version numbers:**
   - Version: 1.0.1
   - Build: 2
5. **Archive and upload** to App Store Connect

## Signing Key Management

### CRITICAL: Save Your Signing Key!

When PWABuilder generates your Android package, it creates a signing key.

**You MUST:**
- Download the `signing-key.zip` file
- Store it securely (password-protected location)
- Back it up in multiple locations
- NEVER share it publicly

**Why it's important:**
- Required to update your app
- Cannot be regenerated if lost
- Losing it means you can't update your app (must publish new app)

**Where to store:**
- Password manager (1Password, LastPass)
- Encrypted cloud storage (with backup)
- Hardware security key
- NOT in your code repository

## Advanced Options

### Custom Native Features (Optional)

If you need features beyond PWA capabilities:

**Use Capacitor Instead:**

```bash
npm install @capacitor/core @capacitor/cli
npx cap init LifeZinc com.lifezinc.app
npx cap add android
npx cap add ios
npx cap sync
```

**Benefits:**
- Access to native APIs
- Camera, push notifications, biometrics
- More control over native features

**Trade-off:**
- More complex setup
- Requires native development knowledge
- Longer build times

### Digital Asset Links Verification

**Test your assetlinks.json:**

1. Go to: https://developers.google.com/digital-asset-links/tools/generator
2. Enter your domain
3. Verify configuration is correct

## PWABuilder Alternatives

If PWABuilder doesn't work for you:

**For Android:**
- **Bubblewrap** (Google's CLI tool)
- **Capacitor** (Ionic framework)
- **Cordova** (older, but works)

**For iOS:**
- **Capacitor** (recommended)
- **PWA to App Store** service
- Build manually with Xcode

## Submission Checklist

### Before Using PWABuilder:
- [ ] PWA deployed on HTTPS
- [ ] manifest.json configured
- [ ] Service worker working
- [ ] Icons uploaded (192, 512, maskable)
- [ ] Privacy policy URL ready
- [ ] Screenshots prepared

### After PWABuilder:
- [ ] Android .aab file downloaded
- [ ] Signing key saved securely
- [ ] assetlinks.json deployed to website
- [ ] iOS Xcode project generated (if using Mac)
- [ ] Test packages on real devices
- [ ] Verify icons appear correctly
- [ ] Check offline functionality
- [ ] Test all features work in app

### Ready for Stores:
- [ ] Developer accounts active
- [ ] Privacy policy URL added
- [ ] Screenshots uploaded
- [ ] App descriptions written
- [ ] .aab file ready for Google Play
- [ ] iOS build uploaded to App Store Connect

## Timeline Estimate

**Using PWABuilder:**

**Android Package:**
- PWABuilder generation: 10 minutes
- assetlinks.json deployment: 5 minutes
- Testing: 30 minutes
- **Total: 45 minutes**

**iOS Package:**
- PWABuilder generation: 5 minutes
- Xcode configuration: 20 minutes
- Build and archive: 15 minutes
- Upload to App Store Connect: 10 minutes
- **Total: 50 minutes** (with Mac)

**Without Mac:**
- Wait time for Mac access or cloud Mac rental

## Resources

**Official Documentation:**
- PWABuilder: https://docs.pwabuilder.com/
- Google Play TWA: https://developer.chrome.com/docs/android/trusted-web-activity/
- Apple PWA: https://developer.apple.com/documentation/webkit

**Support:**
- PWABuilder GitHub: https://github.com/pwa-builder/PWABuilder
- Stack Overflow: Tag `pwa-builder`
- PWABuilder Discord: https://aka.ms/pwabuilderdiscord

**Tools:**
- PWA Asset Generator: https://github.com/elegantapp/pwa-asset-generator
- Maskable.app: https://maskable.app/
- Digital Asset Links: https://developers.google.com/digital-asset-links/tools/generator

## Troubleshooting Checklist

If something goes wrong:

1. **Check PWA requirements:**
   - [ ] HTTPS enabled
   - [ ] Valid manifest.json
   - [ ] Service worker registered
   - [ ] Icons present

2. **Verify PWABuilder inputs:**
   - [ ] Correct URL entered
   - [ ] Package ID valid format
   - [ ] Version numbers correct
   - [ ] Host matches deployed domain

3. **Test locally:**
   - [ ] App works in browser
   - [ ] Offline mode functions
   - [ ] No console errors
   - [ ] Icons load properly

4. **Review generated files:**
   - [ ] .aab file not corrupted
   - [ ] assetlinks.json valid JSON
   - [ ] Signing key downloaded
   - [ ] Xcode project opens

5. **Test installations:**
   - [ ] Android app installs
   - [ ] iOS app installs
   - [ ] Apps open properly
   - [ ] Features work in app

## Quick Start Summary

1. **Prepare:** Ensure PWA is deployed with all assets
2. **Visit:** https://www.pwabuilder.com
3. **Enter URL:** Your deployed LifeZinc URL
4. **Check Score:** Should be mostly green
5. **Generate Android:** Download .aab and signing key
6. **Deploy assetlinks.json:** To your website
7. **Generate iOS:** Download Xcode project
8. **Build iOS:** On Mac with Xcode
9. **Test Both:** Install on devices
10. **Submit:** Upload to Google Play and App Store Connect

---

**You're Ready!**

With PWABuilder, you can have store-ready packages in under an hour. The hard part is done – your PWA is already built. Now it's just packaging and submission!

**Next Steps:**
1. Use PWABuilder to generate packages
2. Test on devices
3. Upload to app store consoles
4. Complete store listings
5. Submit for review
6. Launch! 🚀
