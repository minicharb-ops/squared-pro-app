import { CapacitorConfig } from '@capacitor/cli';

const config: any = {
  appId: "com.imbrokeapps.squaredpro",
  appName: "Squared Pro",
  webDir: "dist",
  assets: {
    ios: { "path": "assets" },
    android: { "path": "assets" }
  }, // <-- Fixed: Closes the assets configuration safely
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      // This ensures the camera doesn't conflict with the webview
    }
  }
};

export default config;