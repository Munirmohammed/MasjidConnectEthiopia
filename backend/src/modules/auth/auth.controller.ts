import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { findOrCreateUser } from './auth.service';

export const verifyAndLogin = async (req: AuthRequest, res: Response) => {
  try {
    const { uid, email } = req.user!;
    const user = await findOrCreateUser(uid, email!);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
};
