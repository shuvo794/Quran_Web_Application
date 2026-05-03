import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
  setArabicFont: (font: string) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      arabicFont: 'font-amiri',
      arabicFontSize: 32,
      translationFontSize: 16,
      setArabicFont: (font) => set({ arabicFont: font }),
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setTranslationFontSize: (size) => set({ translationFontSize: size }),
    }),
    {
      name: 'quran-settings',
    }
  )
);
