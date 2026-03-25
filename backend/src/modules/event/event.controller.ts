import { Request, Response } from 'express';
import { z } from 'zod';
import { getEvents, getEventById, createEvent } from './event.service';

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().datetime(),
  time: z.string(),
  location: z.string().optional(),
  mosqueId: z.string().cuid(),
  imageUrl: z.string().url().optional(),
});

export const listEvents = async (req: Request, res: Response) => {
  try {
    const { mosqueId, upcoming, page, limit } = req.query as Record<string, string>;
    const result = await getEvents(mosqueId, upcoming !== 'false', Number(page) || 1, Number(limit) || 20);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const addEvent = async (req: Request, res: Response) => {
  try {
    const data = createSchema.parse(req.body);
    const event = await createEvent({ ...data, date: new Date(data.date) });
    res.status(201).json(event);
  } catch (error) {
    throw error;
  }
};
