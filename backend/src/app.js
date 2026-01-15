//EXPRESS APPLICATION SETUP

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';
import { sanitizeInput } from './middlewares/sanitize.middleware.js';

const app = express();

// Trust proxy (required for Vercel/Heroku/AWS secure cookies)
app.set('trust proxy', 1);


app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL ,
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.ip;
  }
});

app.use('/api/', limiter);




app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Cookie parser
app.use(cookieParser());

// Sanitize all input (protect against XSS)
app.use(sanitizeInput);

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ESUT Bookshop API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});



app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;