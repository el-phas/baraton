import lodgingBookingRoutes from './routes/lodgingBookingRoutes.js';
import conferenceBookingRoutes from './routes/conferenceBookingRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import lodgingRoutes from './routes/lodgingRoutes.js';
import conferenceRoutes from './routes/conferenceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import webhookRoutes from './routes/webhook.js';
import testEmailRoutes from './routes/testEmail.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { sequelize } from './config/db.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();

// Request logging middleware (early in the chain)
app.use(requestLogger);

// Raw body for Paystack webhook (must come before express.json)
app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }));
// CORS whitelist: allow local dev and the production frontends.
// Can be configured via env: CORS_WHITELIST="https://a,https://b"
const defaultWhitelist = [
  'https://baratonhotel.vercel.app',
  'https://baratonhotel-a9qp-c91rozmfg-elphas-simiyus-projects.vercel.app',
  'https://baratonhotel-a9qp.vercel.app',
  'https://admincreater.vercel.app'
];
const envList = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : [];
const whitelist = envList.length ? envList.map(s => s.trim()) : defaultWhitelist;

console.log('CORS whitelist:', whitelist);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // allow any localhost origin (different dev ports)
    if (origin.startsWith && origin.startsWith('http://localhost')) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // explicitly deny by returning false (no Access-Control-Allow-Origin header)
      callback(null, false);
    }
  }
}));
app.use(express.json());

// Routes
app.use('/api/lodging-bookings', lodgingBookingRoutes);
app.use('/api/conference-bookings', conferenceBookingRoutes);
app.use('/api/lodgings', lodgingRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/test-email', testEmailRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync();
    logger.info('Database synced successfully');
  } catch (err) {
    logger.error('Database connection failed', { 
      error: err.message || err,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
    });
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, { port: PORT });
  });
})();
