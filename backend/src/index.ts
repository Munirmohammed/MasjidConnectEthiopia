import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import './config/firebase';
import './config/database';
import './config/redis';

import { errorHandler } from './middlewares/errorHandler';

import authRouter from './modules/auth/auth.router';
import profileRouter from './modules/profile/profile.router';
import mosqueRouter from './modules/mosque/mosque.router';
import imamRouter from './modules/imam/imam.router';
import khutbahRouter from './modules/khutbah/khutbah.router';
import eventRouter from './modules/event/event.router';
import communityRouter from './modules/community/community.router';
import donationRouter from './modules/donation/donation.router';
import prayerRouter from './modules/prayer/prayer.router';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/mosques', mosqueRouter);
app.use('/api/imams', imamRouter);
app.use('/api/khutbahs', khutbahRouter);
app.use('/api/events', eventRouter);
app.use('/api/community', communityRouter);
app.use('/api/donations', donationRouter);
app.use('/api/prayer', prayerRouter);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

export default app;
