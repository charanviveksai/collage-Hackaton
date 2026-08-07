import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import resumeRoutes from './routes/resume.js';
import analyzeRoutes from './routes/analyze.js';
import coverLetterRoutes from './routes/coverLetter.js';
import historyRoutes from './routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limit AI endpoints to prevent abuse
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a few minutes before trying again.' },
});

app.use('/api/resume/analyze', aiLimiter);
app.use('/api/cover-letter', aiLimiter);

// API Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/resume', analyzeRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', coverLetterRoutes);
app.use('/api', historyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Resume Assistant API',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Resume Assistant API Server running on port ${PORT}`);
});

export default app;
