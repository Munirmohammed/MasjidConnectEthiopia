import { Request, Response } from 'express';
import { getImams, getImamById } from './imam.service';

export const listImams = async (req: Request, res: Response) => {
  try {
    const { mosqueId } = req.query as { mosqueId?: string };
    const imams = await getImams(mosqueId);
    res.json(imams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch imams' });
  }
};

export const getImam = async (req: Request, res: Response) => {
  try {
    const imam = await getImamById(req.params.id);
    if (!imam) return res.status(404).json({ error: 'Imam not found' });
    res.json(imam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch imam' });
  }
};
