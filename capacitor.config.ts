import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'iiotca_front_end',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    androidScheme: "http",
    cleartext: true,
    allowNavigation: [
      "http://192.168.0.197/api/*"
    ]
  }
};

export default config;
