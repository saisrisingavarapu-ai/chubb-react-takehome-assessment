function safeLocalStorage() {
  try {
    return window?.localStorage ?? null;
  } catch {
    return null;
  }
}

export function getRawStorageItem(key) {
  try {
    const storage = safeLocalStorage();
    return storage ? storage.getItem(key) : null;
  } catch {
    return null;
  }
}

export function setRawStorageItem(key, value) {
  try {
    const storage = safeLocalStorage();
    if (storage) {
      storage.setItem(key, value);
    }
  } catch {
    // swallow storage errors and continue safely
  }
}

export function removeRawStorageItem(key) {
  try {
    const storage = safeLocalStorage();
    if (storage) {
      storage.removeItem(key);
    }
  } catch {
    // ignore failures silently
  }
}

export function getStorageItem(key, fallback = null) {
  try {
    const raw = getRawStorageItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, payload) {
  try {
    setRawStorageItem(key, JSON.stringify(payload));
  } catch {
    // ignore failed writes
  }
}
