import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRawStorageItem, removeRawStorageItem, setRawStorageItem } from '../utils/storage.js';
import { DEFAULT_PAGE_SIZE } from '../utils/constants.js';

const storage = {
  getItem: (name) => getRawStorageItem(name),
  setItem: (name, value) => setRawStorageItem(name, value),
  removeItem: (name) => removeRawStorageItem(name)
};

const usePreferencesStore = create(
  persist(
    (set) => ({
      theme: 'light',
      pageSize: DEFAULT_PAGE_SIZE,
      lastFilters: {},
      setTheme: (theme) => set({ theme }),
      setPageSize: (pageSize) => set({ pageSize }),
      setLastFilters: (filters) => set({ lastFilters: filters })
    }),
    {
      name: 'chubb-preferences',
      storage
    }
  )
);

export default usePreferencesStore;
