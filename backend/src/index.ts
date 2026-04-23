import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import quranRoutes from './routes/quranRoutes';
import prayerRoutes from './routes/prayerRoutes';
import qiblaRoutes from './routes/qiblaRoutes';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(express.json());
app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'islamic-app-api',
    env: config.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/quran', quranRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/qibla', qiblaRoutes);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Islamic App API running on port ${config.PORT}`);
});
