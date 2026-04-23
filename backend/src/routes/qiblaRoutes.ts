import { Router, Request, Response } from 'express';

const router = Router();

router.get('/direction', (req: Request, res: Response) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'lat and lng required' });
  }
  const φ1 = (parseFloat(lat as string) * Math.PI) / 180;
  const φ2 = (21.4225 * Math.PI) / 180;
  const Δλ = ((39.8262 - parseFloat(lng as string)) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;
  res.json({ success: true, data: { bearing, kaabaLat: 21.4225, kaabaLng: 39.8262 } });
});

export default router;
