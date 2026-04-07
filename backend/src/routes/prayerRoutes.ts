import { Router } from 'express';
import { prayerController } from '../controllers/prayerController';

const router = Router();

router.get('/times', prayerController.getTimings);
router.get('/methods', prayerController.getMethods);
router.get('/hijri', prayerController.getHijriDate);

export default router;