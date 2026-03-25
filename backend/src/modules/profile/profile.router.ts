import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth';
import { getMyProfile, updateMyProfile } from './profile.controller';

const router = Router();

router.get('/', verifyToken, getMyProfile);
router.patch('/', verifyToken, updateMyProfile);

export default router;
