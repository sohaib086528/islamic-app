import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

function load<T>(key: string, fallback: T): T {
  try {
    const val = storage.getString(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, val: unknown): void {
  storage.set(key, JSON.stringify(val));
}

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

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: load('theme', 'system'),
  language: load('language', 'en'),
  translationEdition: load('translationEdition', 'en.sahih'),
  reciterEdition: load('reciterEdition', 'ar.alafasy'),
  arabicScript: load('arabicScript', 'uthmani'),
  tajweedMode: load('tajweedMode', false),
  prayerMethod: load('prayerMethod', 2),
  madhab: load('madhab', 1),
  hijriOffset: load('hijriOffset', 0),
  hasCompletedOnboarding: load('hasCompletedOnboarding', false),

  setTheme: (theme) => {
    save('theme', theme);
    set({ theme });
  },
  setLanguage: (language) => {
    save('language', language);
    set({ language });
  },
  setTranslationEdition: (translationEdition) => {
    save('translationEdition', translationEdition);
    set({ translationEdition });
  },
  setReciterEdition: (reciterEdition) => {
    save('reciterEdition', reciterEdition);
    set({ reciterEdition });
  },
  setArabicScript: (arabicScript) => {
    save('arabicScript', arabicScript);
    set({ arabicScript });
  },
  setTajweedMode: (tajweedMode) => {
    save('tajweedMode', tajweedMode);
    set({ tajweedMode });
  },
  setPrayerMethod: (prayerMethod) => {
    save('prayerMethod', prayerMethod);
    set({ prayerMethod });
  },
  setMadhab: (madhab) => {
    save('madhab', madhab);
    set({ madhab });
  },
  setHijriOffset: (hijriOffset) => {
    save('hijriOffset', hijriOffset);
    set({ hijriOffset });
  },
  setOnboardingComplete: () => {
    save('hasCompletedOnboarding', true);
    set({ hasCompletedOnboarding: true });
  },
}));
