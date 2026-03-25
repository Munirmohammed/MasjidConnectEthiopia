import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth';
import { listEvents, getEvent, addEvent } from './event.controller';

const router = Router();

router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', verifyToken, addEvent);

export default router;
