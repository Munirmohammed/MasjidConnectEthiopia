import axios from 'axios';
import { cacheGet, cacheSet } from '../../utils/cache';

const ETHIOPIAN_CITIES: Record<string, { lat: number; lng: number }> = {
  'Addis Ababa': { lat: 9.0054, lng: 38.7636 },
  'Dire Dawa': { lat: 9.5931, lng: 41.8661 },
  'Harar': { lat: 9.3119, lng: 42.1197 },
  'Jimma': { lat: 7.6667, lng: 36.8333 },
  'Adama': { lat: 8.5400, lng: 39.2700 },
  'Bahir Dar': { lat: 11.5936, lng: 37.3906 },
};

export const getPrayerTimes = async (city: string, date: string) => {
  const cacheKey = `prayer_times:${city}:${date}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const coords = ETHIOPIAN_CITIES[city];
  if (!coords) throw new Error(`City "${city}" not supported`);

  const { data } = await axios.get(
    `https://api.aladhan.com/v1/timings/${date}`,
    { params: { latitude: coords.lat, longitude: coords.lng, method: 3 } }
  );

  const timings = data.data.timings;
  await cacheSet(cacheKey, timings, 86400); // 24h TTL
  return timings;
};

export const getSupportedCities = () => Object.keys(ETHIOPIAN_CITIES);
