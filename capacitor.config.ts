import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trainsurvival.game',
  appName: '星航荒宇',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0e27',
      overlaysWebView: false,
    },
  },
  android: {
    backgroundColor: '#0a0e27',
  },
};

export default config;
