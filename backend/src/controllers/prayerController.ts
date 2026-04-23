import { Request, Response, NextFunction } from 'express';
import { prayerService } from '../services/prayerService';

export const prayerController = {
  getTimings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lng, city, country, method, school } = req.query;
      const parsedMethod = method ? parseInt(method as string, 10) : 2;
      const parsedSchool = school ? parseInt(school as string, 10) : 0;

      if (lat && lng) {
        const data = await prayerService.getTimingsByCoords(
          parseFloat(lat as string),
          parseFloat(lng as string),
          parsedMethod,
          parsedSchool
        );
        return res.json({ success: true, data });
      }

      if (city && country) {
        const data = await prayerService.getTimingsByCity(
          city as string,
          country as string,
          parsedMethod,
          parsedSchool
        );
        return res.json({ success: true, data });
      }

      return res.status(400).json({
        success: false,
        message: 'Please provide either lat and lng, or city and country.',
      });
    } catch (err) {
      next(err);
    }
  },

  getMethods: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await prayerService.getMethods();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getHijriDate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query;
      const data = await prayerService.getHijriDate(date as string | undefined);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
