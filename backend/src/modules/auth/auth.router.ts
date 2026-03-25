import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth';
import { verifyAndLogin } from './auth.controller';

const router = Router();

router.post('/verify', verifyToken, verifyAndLogin);

export default router;
