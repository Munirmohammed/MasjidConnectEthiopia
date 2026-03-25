import { Request, Response } from 'express';
import { getPrayerTimes, getSupportedCities } from './prayer.service';

export const prayerTimes = async (req: Request, res: Response) => {
  try {
    const { city, date } = req.query as { city: string; date?: string };
    if (!city) return res.status(400).json({ error: 'city is required' });
    const today = date || new Date().toISOString().split('T')[0];
    const timings = await getPrayerTimes(city, today);
    res.json({ city, date: today, timings });
  } catch (error: any) {
    if (error.message?.includes('not supported')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch prayer times' });
  }
};

export const cities = (_req: Request, res: Response) => {
  res.json(getSupportedCities());
};
