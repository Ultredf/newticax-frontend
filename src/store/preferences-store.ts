import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  categories: string[];
  notifications: boolean;
  darkMode: boolean;
  emailUpdates: boolean;
  autoPlay: boolean;
  readingMode: 'comfortable' | 'compact';
  fontSize: 'small' | 'medium' | 'large';
  setCategoryPreferences: (categories: string[]) => void;
  setNotifications: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setEmailUpdates: (enabled: boolean) => void;
  setAutoPlay: (enabled: boolean) => void;
  setReadingMode: (mode: 'comfortable' | 'compact') => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      categories: [],
      notifications: true,
      darkMode: false,
      emailUpdates: true,
      autoPlay: false,
      readingMode: 'comfortable',
      fontSize: 'medium',
      
      setCategoryPreferences: (categories) => set({ categories }),
      setNotifications: (notifications) => set({ notifications }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setEmailUpdates: (emailUpdates) => set({ emailUpdates }),
      setAutoPlay: (autoPlay) => set({ autoPlay }),
      setReadingMode: (readingMode) => set({ readingMode }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'preferences-storage',
    }
  )
);