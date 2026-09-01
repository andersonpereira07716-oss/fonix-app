import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fonix.app',
  appName: 'fonix',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
