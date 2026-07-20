import { Capacitor } from '@capacitor/core';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';

export const checkForAppUpdates = async (forceImmediate = true) => {
  // Native Google Play updates strictly run on native Android builds
  if (Capacitor.getPlatform() !== 'android') {
    return;
  }

  try {
    const result = await AppUpdate.getAppUpdateInfo();

    // Check if Google Play reports a newer version code available
    if (result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
      
      if (forceImmediate && result.immediateUpdateAllowed) {
        // Blocks app usage with a native Play Store update screen
        await AppUpdate.performImmediateUpdate();
      } else if (result.flexibleUpdateAllowed) {
        // Downloads update silently in the background while they use the app
        await AppUpdate.startFlexibleUpdate();
      } else {
        // Fallback: Opens the Google Play Store page directly
        await AppUpdate.openAppStore();
      }
    }
  } catch (error) {
    console.warn('App Update check failed (likely running in a local debug build):', error);
  }
};