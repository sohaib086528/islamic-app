import axios from 'axios';
import { config } from '../config/env';
import { cache } from '../utils/cache';

const api = axios.create({ baseURL: config.QURAN_API_BASE, timeout: 10000 });

export const quranService = {
  async getSurahs() {
    const key = 'surahs';
    const cached = cache.get(key);
    if (cached) return cached;
    const { data } = await api.get('/surah');
    cache.set(key, data.data, 86400);
    return data.data;
  },

  async getSurah(id: number, edition = 'quran-uthmani') {
    const key = `surah-${id}-${edition}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const { data } = await api.get(`/surah/${id}/${edition}`);
    cache.set(key, data.data, 86400);
    return data.data;
  },

  async getSurahWithTranslation(id: number, translationEdition: string) {
    const key = `surah-trans-${id}-${translationEdition}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const [arabic, translation] = await Promise.all([
      api.get(`/surah/${id}/quran-uthmani`),
      api.get(`/surah/${id}/${translationEdition}`),
    ]);
    const result = { arabic: arabic.data.data, translation: translation.data.data };
    cache.set(key, result, 86400);
    return result;
  },

  async getTranslations() {
    const key = 'translations';
    const cached = cache.get(key);
    if (cached) return cached;
    const { data } = await api.get('/edition?format=text&type=translation');
    cache.set(key, data.data, 86400);
    return data.data;
  },

  async getReciters() {
    const key = 'reciters';
    const cached = cache.get(key);
    if (cached) return cached;
    const { data } = await api.get('/edition?format=audio&type=versebyverse');
    cache.set(key, data.data, 86400);
    return data.data;
  },

  async getAudioBySurah(surahId: number, reciterEdition: string) {
    const key = `audio-${surahId}-${reciterEdition}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const { data } = await api.get(`/surah/${surahId}/${reciterEdition}`);
    cache.set(key, data.data, 86400);
    return data.data;
  },
};
