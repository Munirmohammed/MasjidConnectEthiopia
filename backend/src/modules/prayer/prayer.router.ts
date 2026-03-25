import { Router } from 'express';
import { prayerTimes, cities } from './prayer.controller';

const router = Router();

router.get('/', prayerTimes);
router.get('/cities', cities);

export default router;
