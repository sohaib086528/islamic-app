import axios from 'axios';
import { config } from '../config/env';

const api = axios.create({
  baseURL: config.ALADHAN_API_BASE,
  timeout: 10000,
});

function todayString() {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

export const prayerService = {
  async getTimingsByCoords(lat: number, lng: number, method = 2) {
    const { data } = await api.get(`/timings/${todayString()}`, {
      params: { latitude: lat, longitude: lng, method },
    });
    return data.data;
  },

  async getTimingsByCity(city: string, country: string, method = 2) {
    const { data } = await api.get(`/timingsByCity/${todayString()}`, {
      params: { city, country, method },
    });
    return data.data;
  },

  async getMethods() {
    const { data } = await api.get('/methods');
    return data.data;
  },

  async getHijriDate(date?: string) {
    const dateStr = date || todayString();
    const { data } = await api.get(`/gToH/${dateStr}`);
    return data.data;
  },
};