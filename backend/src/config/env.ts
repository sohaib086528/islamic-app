import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:8081').split(','),
  QURAN_API_BASE: process.env.QURAN_API_BASE || 'https://api.alquran.cloud/v1',
  ALADHAN_API_BASE: process.env.ALADHAN_API_BASE || 'https://api.aladhan.com/v1',
};