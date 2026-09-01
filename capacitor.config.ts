import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fonix.app',
  appName: 'fonix',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      showSpinner: false
    }
  },
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
