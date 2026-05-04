import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark';
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
  setTheme: (theme: 'light' | 'dark') => void;
  setArabicFont: (font: string) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      arabicFont: 'font-kfgq',
      arabicFontSize: 32,
      translationFontSize: 16,
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      setArabicFont: (font) => set({ arabicFont: font }),
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setTranslationFontSize: (size) => set({ translationFontSize: size }),
    }),
    {
      name: 'quran-settings',
    }
  )
);
