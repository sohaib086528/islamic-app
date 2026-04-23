import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ur' | 'bn' | 'hi';
  translationEdition: string;
  reciterEdition: string;
  arabicScript: 'uthmani' | 'indopak';
  tajweedMode: boolean;
  prayerMethod: number;
  madhab: number;
  hijriOffset: number;
  hasCompletedOnboarding: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'en' | 'ur' | 'bn' | 'hi') => void;
  setTranslationEdition: (edition: string) => void;
  setReciterEdition: (edition: string) => void;
  setArabicScript: (script: 'uthmani' | 'indopak') => void;
  setTajweedMode: (val: boolean) => void;
  setPrayerMethod: (method: number) => void;
  setMadhab: (madhab: number) => void;
  setHijriOffset: (offset: number) => void;
  setOnboardingComplete: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      translationEdition: 'en.sahih',
      reciterEdition: 'ar.alafasy',
      arabicScript: 'uthmani',
      tajweedMode: false,
      prayerMethod: 2,
      madhab: 1,
      hijriOffset: 0,
      hasCompletedOnboarding: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTranslationEdition: (translationEdition) => set({ translationEdition }),
      setReciterEdition: (reciterEdition) => set({ reciterEdition }),
      setArabicScript: (arabicScript) => set({ arabicScript }),
      setTajweedMode: (tajweedMode) => set({ tajweedMode }),
      setPrayerMethod: (prayerMethod) => set({ prayerMethod }),
      setMadhab: (madhab) => set({ madhab }),
      setHijriOffset: (hijriOffset) => set({ hijriOffset }),
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
