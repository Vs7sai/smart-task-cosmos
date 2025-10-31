import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.b83691846c244018b5bb29187564dca9',
  appName: 'FlowState',
  webDir: 'dist',
  server: {
    url: 'https://b8369184-6c24-4018-b5bb-29187564dca9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
