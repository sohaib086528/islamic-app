import { Router } from 'express';
import { quranController } from '../controllers/quranController';

const router = Router();

router.get('/surahs', quranController.getSurahs);
router.get('/surah/:id', quranController.getSurah);
router.get('/surah/:id/with-translation', quranController.getSurahWithTranslation);
router.get('/translations', quranController.getTranslations);
router.get('/reciters', quranController.getReciters);
router.get('/surah/:id/audio', quranController.getAudio);

export default router;