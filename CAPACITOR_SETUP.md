# FlowState - Android Setup with Capacitor

## 🚀 Getting Started

FlowState is now configured with Capacitor for native Android development!

### Prerequisites
- Node.js and npm installed
- Android Studio installed (for running on Android)
- Git installed

### Setup Steps

1. **Export to Github** (via Lovable UI)
   - Click the "Export to Github" button in Lovable
   - Clone your repository locally

2. **Install Dependencies**
   ```bash
   cd your-project-folder
   npm install
   ```

3. **Add Android Platform**
   ```bash
   npx cap add android
   ```

4. **Update Android Platform**
   ```bash
   npx cap update android
   ```

5. **Build the Web App**
   ```bash
   npm run build
   ```

6. **Sync with Native Platform**
   ```bash
   npx cap sync
   ```

7. **Run on Android**
   ```bash
   npx cap run android
   ```
   
   This will open Android Studio where you can:
   - Run on an emulator
   - Run on a physical device (USB debugging enabled)

### Development Workflow

After making changes to your code:
1. `git pull` (to get latest changes)
2. `npx cap sync` (sync web code to native)
3. `npx cap run android` (run the app)

### Features Enabled
- ✅ Haptic feedback on interactions
- ✅ Local storage with Capacitor Preferences
- ✅ Offline-first architecture
- ✅ Native Android feel and performance

### Hot Reload During Development
The app is configured to use the Lovable sandbox URL for hot reload:
`https://b8369184-6c24-4018-b5bb-29187564dca9.lovableproject.com`

This means changes you make in Lovable will reflect immediately in your running Android app!

### Capacitor Plugins Used
- `@capacitor/core` - Core Capacitor functionality
- `@capacitor/android` - Android platform integration
- `@capacitor/haptics` - Native haptic feedback
- `@capacitor/preferences` - Persistent local storage

### Need Help?
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Setup](https://developer.android.com/studio)
