import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth';
import { initiate, verify, stats, myDonations } from './donation.controller';

const router = Router();

router.get('/stats', stats);
router.get('/mine', verifyToken, myDonations);
router.post('/initiate', verifyToken, initiate);
router.post('/verify', verify); // webhook — no auth

export default router;
