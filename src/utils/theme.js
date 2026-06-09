import { getRawStorageItem } from './storage.js';

export const ThemeMode = {
  light: 'light',
  dark: 'dark'
};

const PREFERENCES_KEY = 'chubb-preferences';

export function getPreferredTheme() {
  if (typeof window === 'undefined') {
    return ThemeMode.light;
  }

  try {
    const raw = getRawStorageItem(PREFERENCES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const storedTheme = parsed?.state?.theme ?? parsed?.theme;
      if (storedTheme === ThemeMode.dark || storedTheme === ThemeMode.light) {
        return storedTheme;
      }
    }
  } catch {
    // ignore malformed persisted theme and fall back to system preference
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeMode.dark : ThemeMode.light;
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('theme-dark', theme === ThemeMode.dark);
  document.documentElement.setAttribute('data-theme', theme);
}
