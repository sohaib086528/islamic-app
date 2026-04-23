import axios from 'axios';

const BASE_URL = 'https://api.salahnsujood.online/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quranApi = {
  getSurahs: () => apiClient.get('/quran/surahs').then((r) => r.data.data),

  getSurah: (id: number, edition?: string) =>
    apiClient
      .get(`/quran/surah/${id}`, { params: { edition } })
      .then((r) => r.data.data),

  getSurahWithTranslation: (id: number, translation: string) =>
    apiClient
      .get(`/quran/surah/${id}/with-translation`, { params: { translation } })
      .then((r) => r.data.data),

  getReciters: () => apiClient.get('/quran/reciters').then((r) => r.data.data),

  getTranslations: () =>
    apiClient.get('/quran/translations').then((r) => r.data.data),

  getAudio: (surahId: number, reciter: string) =>
    apiClient
      .get(`/quran/surah/${surahId}/audio`, { params: { reciter } })
      .then((r) => r.data.data),
};

export const prayerApi = {
  getTimings: (params: {
    lat?: number;
    lng?: number;
    city?: string;
    country?: string;
    method?: number;
    school?: number;
  }) => apiClient.get('/prayer/times', { params }).then((r) => r.data.data),

  getMethods: () => apiClient.get('/prayer/methods').then((r) => r.data.data),

  getHijriDate: (date?: string) =>
    apiClient.get('/prayer/hijri', { params: { date } }).then((r) => r.data.data),
};
