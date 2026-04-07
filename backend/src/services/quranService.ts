import axios from 'axios';
import { config } from '../config/env';

const api = axios.create({
  baseURL: config.QURAN_API_BASE,
  timeout: 10000,
});

export const quranService = {
  async getSurahs() {
    const { data } = await api.get('/surah');
    return data.data;
  },

  async getSurah(id: number, edition = 'quran-uthmani') {
    const { data } = await api.get(`/surah/${id}/${edition}`);
    return data.data;
  },

  async getSurahWithTranslation(id: number, translationEdition: string) {
    const [arabic, translation] = await Promise.all([
      api.get(`/surah/${id}/quran-uthmani`),
      api.get(`/surah/${id}/${translationEdition}`),
    ]);
    return {
      arabic: arabic.data.data,
      translation: translation.data.data,
    };
  },

  async getTranslations() {
    const { data } = await api.get('/edition?format=text&type=translation');
    return data.data;
  },

  async getReciters() {
    const { data } = await api.get('/edition?format=audio&type=versebyverse');
    return data.data;
  },

  async getAudioBySurah(surahId: number, reciterEdition: string) {
    const { data } = await api.get(`/surah/${surahId}/${reciterEdition}`);
    return data.data;
  },
};