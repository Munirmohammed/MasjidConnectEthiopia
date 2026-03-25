import { api } from './api';

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export const prayerService = {
  getTimes: (city: string, date?: string) => {
    const query = date ? `?city=${encodeURIComponent(city)}&date=${date}` : `?city=${encodeURIComponent(city)}`;
    return api.get<{ city: string; date: string; timings: PrayerTimings }>(`/prayer${query}`);
  },
  getCities: () => api.get<string[]>('/prayer/cities'),
};
