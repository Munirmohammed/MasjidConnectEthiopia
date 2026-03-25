import { Router } from 'express';
import { listImams, getImam } from './imam.controller';

const router = Router();

router.get('/', listImams);
router.get('/:id', getImam);

export default router;
