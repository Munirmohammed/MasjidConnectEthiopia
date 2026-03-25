import { Request, Response } from 'express';
import { z } from 'zod';
import { getKhutbahs, getKhutbahById, createKhutbah } from './khutbah.service';

const createSchema = z.object({
  title: z.string().min(1),
  audioUrl: z.string().url(),
  duration: z.number().int().positive(),
  imamId: z.string().cuid(),
  mosqueId: z.string().cuid(),
});

export const listKhutbahs = async (req: Request, res: Response) => {
  try {
    const { mosqueId, imamId, page, limit } = req.query as Record<string, string>;
    const result = await getKhutbahs(mosqueId, imamId, Number(page) || 1, Number(limit) || 20);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch khutbahs' });
  }
};

export const getKhutbah = async (req: Request, res: Response) => {
  try {
    const khutbah = await getKhutbahById(req.params.id);
    if (!khutbah) return res.status(404).json({ error: 'Khutbah not found' });
    res.json(khutbah);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch khutbah' });
  }
};

export const addKhutbah = async (req: Request, res: Response) => {
  try {
    const data = createSchema.parse(req.body);
    const khutbah = await createKhutbah(data);
    res.status(201).json(khutbah);
  } catch (error) {
    throw error;
  }
};
