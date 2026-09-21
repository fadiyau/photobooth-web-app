// src/utils/livePhotoStorage.js
/**
 * IndexedDB storage helper for Live Photo video clips.
 * Allows storing multi-megabyte video blobs reliably without sessionStorage quota limits.
 */

const DB_NAME = 'photobooth_db';
const STORE_NAME = 'live_clips';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save array of 6 video Blobs into IndexedDB
 * @param {Array<Blob|null>} clips
 */
export async function saveLiveClips(clips) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      clips.forEach((clip, index) => {
        if (clip) {
          store.put(clip, `clip_${index}`);
        } else {
          store.delete(`clip_${index}`);
        }
      });

      tx.oncomplete = () => {
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('photobooth_has_live_clips', 'true');
          } catch (e) {}
        }
        resolve(true);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save live clips to IndexedDB:', err);
    return false;
  }
}

/**
 * Retrieve array of 6 video Blobs from IndexedDB
 * @returns {Promise<Array<Blob|null>>}
 */
export async function getLiveClips() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const results = [null, null, null, null, null, null];
      let loaded = 0;

      for (let i = 0; i < 6; i++) {
        const req = store.get(`clip_${i}`);
        req.onsuccess = () => {
          results[i] = req.result || null;
          loaded++;
          if (loaded === 6) {
            resolve(results);
          }
        };
        req.onerror = () => {
          results[i] = null;
          loaded++;
          if (loaded === 6) {
            resolve(results);
          }
        };
      }
    });
  } catch (err) {
    console.warn('Failed to get live clips from IndexedDB:', err);
    return [null, null, null, null, null, null];
  }
}

/**
 * Clear all live video clips from IndexedDB
 */
export async function clearLiveClips() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const clearReq = store.clear();

      clearReq.onsuccess = () => {
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem('photobooth_has_live_clips');
          } catch (e) {}
        }
        resolve(true);
      };
      clearReq.onerror = () => reject(clearReq.error);
    });
  } catch (err) {
    console.warn('Failed to clear live clips:', err);
  }
}
