/**
 * Offline Cache Service for Red Seal Carpentry
 * Manages dual-layer redundancy: Service Worker caching & Capacitor / LocalStorage replication
 * ensuring study materials are 100% available on remote Canadian job sites without cellular access.
 */

const STORAGE_KEYS = {
  QUESTIONS: 'red_seal_offline_questions',
  GLOSSARY: 'red_seal_offline_glossary',
  LAST_SYNC: 'red_seal_offline_last_sync_time',
  CACHE_STATUS: 'red_seal_offline_cache_status'
};

export const offlineCacheService = {
  /**
   * Detects if the device currently has an active internet connection
   */
  isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  /**
   * Inspects storage to verify cached files and returns offline stats
   */
  async getOfflineStats() {
    try {
      const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      const cachedQ = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      const cachedG = localStorage.getItem(STORAGE_KEYS.GLOSSARY);
      
      const qCount = cachedQ ? JSON.parse(cachedQ).length : 0;
      const gCount = cachedG ? JSON.parse(cachedG).length : 0;
      
      const swActive = 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;

      let sizeInKb = 0;
      if (cachedQ) sizeInKb += (cachedQ.length * 2) / 1024;
      if (cachedG) sizeInKb += (cachedG.length * 2) / 1024;

      return {
        isOfflineReady: qCount > 0 && gCount > 0,
        questionsCount: qCount,
        glossaryCount: gCount,
        lastSync: lastSync ? new Date(lastSync).toLocaleString() : 'Never',
        storageSizeKb: Math.round(sizeInKb),
        serviceWorkerRegistered: 'serviceWorker' in navigator,
        serviceWorkerActive: swActive,
        onlineStatus: this.isOnline() ? 'Online' : 'Offline'
      };
    } catch (e) {
      console.error('Error calculating offline stats:', e);
      return {
        isOfflineReady: false,
        questionsCount: 0,
        glossaryCount: 0,
        lastSync: 'Error',
        storageSizeKb: 0,
        serviceWorkerRegistered: 'serviceWorker' in navigator,
        serviceWorkerActive: false,
        onlineStatus: 'Offline'
      };
    }
  },

  /**
   * Pre-fetches and backs up the questions and glossary into LocalStorage/Capacitor Cache for redundancy
   */
  async syncOfflineData() {
    try {
      // 1. Fetch fresh copies from the static public assets (which are fully offline cached by SW)
      const qRes = await fetch('/data/questions.json');
      const gRes = await fetch('/data/glossary.json');
      
      if (!qRes.ok || !gRes.ok) {
        throw new Error('Failed to retrieve static assets for offline sync.');
      }

      const questions = await qRes.json();
      const glossary = await gRes.json();

      // 2. Persist to local cache
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
      localStorage.setItem(STORAGE_KEYS.GLOSSARY, JSON.stringify(glossary));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      localStorage.setItem(STORAGE_KEYS.CACHE_STATUS, 'Fully Cached');

      return {
        success: true,
        questionsCount: questions.length,
        glossaryCount: glossary.length
      };
    } catch (e) {
      console.error('Offline sync failed, falling back to bundled resources:', e);
      return {
        success: false,
        error: e.message
      };
    }
  },

  /**
   * Retrieves cached questions, or falls back to standard bundled modules
   */
  getCachedQuestions(fallbackData) {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Failed to parse cached questions:', e);
    }
    return fallbackData;
  },

  /**
   * Retrieves cached glossary, or falls back to standard bundled modules
   */
  getCachedGlossary(fallbackData) {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.GLOSSARY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Failed to parse cached glossary:', e);
    }
    return fallbackData;
  }
};
