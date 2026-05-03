import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.route.js';
import askRoutes from './routes/ask.route.js';
import { errorHandler } from './utils/errorHandler.js';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

import './services/queue.service.js';

const app = express();

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.use('/upload', uploadRoutes);
app.use('/ask', askRoutes);

// Structured 404 handler
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
