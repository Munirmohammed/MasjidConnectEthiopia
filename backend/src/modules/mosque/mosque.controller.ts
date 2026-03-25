import { Request, Response } from 'express';
import { z } from 'zod';
import { getMosques, getMosqueById, createMosque } from './mosque.service';

const createSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const listMosques = async (req: Request, res: Response) => {
  try {
    const { city, search } = req.query as { city?: string; search?: string };
    const mosques = await getMosques(city, search);
    res.json(mosques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mosques' });
  }
};

export const getMosque = async (req: Request, res: Response) => {
  try {
    const mosque = await getMosqueById(req.params.id);
    if (!mosque) return res.status(404).json({ error: 'Mosque not found' });
    res.json(mosque);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mosque' });
  }
};

export const addMosque = async (req: Request, res: Response) => {
  try {
    const data = createSchema.parse(req.body);
    const mosque = await createMosque(data);
    res.status(201).json(mosque);
  } catch (error) {
    throw error;
  }
};
