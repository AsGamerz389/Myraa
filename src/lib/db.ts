/**
 * IndexedDB storage for imported character assets (PMX, textures, profile)
 */

const DB_NAME = 'myraa_character_storage';
const DB_VERSION = 1;
const STORE_NAME = 'character_assets';

export interface StoredCharacterData {
  id: string;
  name: string;
  pmxBuffer: ArrayBuffer;
  textures: Record<string, string>; // path/filename -> dataUrl
  profile: any;
  importedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCharacterToDB(data: StoredCharacterData): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(data);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadCharacterFromDB(id: string = 'current'): Promise<StoredCharacterData | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function hasImportedCharacter(id: string = 'current'): Promise<boolean> {
  const char = await loadCharacterFromDB(id);
  return char !== null && char.pmxBuffer !== undefined;
}

export async function clearImportedCharacter(id: string = 'current'): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
