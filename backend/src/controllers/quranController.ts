import { Request, Response, NextFunction } from 'express';
import { quranService } from '../services/quranService';

function getSingleString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

export const quranController = {
  getSurahs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await quranService.getSurahs();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getSurah: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(getSingleString(req.params.id, ''), 10);
      const edition = getSingleString(req.query.edition, 'quran-uthmani');
      const data = await quranService.getSurah(id, edition);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getSurahWithTranslation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(getSingleString(req.params.id, ''), 10);
      const translation = getSingleString(req.query.translation, 'en.sahih');
      const data = await quranService.getSurahWithTranslation(id, translation);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getTranslations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await quranService.getTranslations();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getReciters: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await quranService.getReciters();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getAudio: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(getSingleString(req.params.id, ''), 10);
      const reciter = getSingleString(req.query.reciter, 'ar.alafasy');
      const data = await quranService.getAudioBySurah(id, reciter);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
