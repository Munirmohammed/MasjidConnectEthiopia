import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth';
import { listKhutbahs, getKhutbah, addKhutbah } from './khutbah.controller';

const router = Router();

router.get('/', listKhutbahs);
router.get('/:id', getKhutbah);
router.post('/', verifyToken, addKhutbah);

export default router;
