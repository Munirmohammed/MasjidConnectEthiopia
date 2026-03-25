import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await admin.auth().getUser(req.user.uid);
    if (user.customClaims?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Forbidden' });
  }
};
