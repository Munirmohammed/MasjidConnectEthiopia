import { Router } from 'express';
import { verifyToken, isAdmin } from '../../middlewares/auth';
import { listMosques, getMosque, addMosque } from './mosque.controller';

const router = Router();

router.get('/', listMosques);
router.get('/:id', getMosque);
router.post('/', verifyToken, isAdmin, addMosque);

export default router;
