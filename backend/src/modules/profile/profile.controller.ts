import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth';
import { getProfile, updateProfile } from './profile.service';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().max(300).optional(),
  avatar: z.string().url().optional(),
  city: z.string().optional(),
});

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getProfile(req.user!.email!);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateSchema.parse(req.body);
    const user = await updateProfile(req.user!.email!, data);
    res.json(user);
  } catch (error) {
    throw error;
  }
};
