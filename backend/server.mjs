// server.mjs
import express from 'express';
import https from 'https';
import fs from 'fs';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

// Import Routes
import onboardingRoutes from './routes/onboardingRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';

// Import security middleware
import { enforceHTTPS, securityHeaders } from './middleware/secure.mjs';

// Load env
dotenv.config();

// Create app
const app = express();

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(hpp());

// Note: replaceWith prevents express-mongo-sanitize trying to mutate getters in some envs
app.use(mongoSanitize({ replaceWith: '_' }));
app.use(xss());

app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/auth', authLimiter);

// Only enforce HTTPS redirects in non-test environments
if (process.env.NODE_ENV !== 'test') {
  app.use(enforceHTTPS);
}

// Custom security headers (CSP, etc.)
app.use(securityHeaders);

// Routes
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/auth', authRoutes);

// Demo routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to International Banking System</h1>
    <a href="/register"><button>Get Started</button></a>
    <a href="/login"><button>Login</button></a>
  `);
});
app.get('/start', (req, res) => res.send('<h1>Get Started Page</h1>'));
app.get('/register', (req, res) => res.send('<h1>Register Page</h1>'));
app.get('/login', (req, res) => res.send('<h1>Login Page</h1><p>Use your full name, account number and password to log in.</p>'));

// MongoDB connection
if (!process.env.ATLAS_URI) {
  console.error('Warning: ATLAS_URI not set in .env');
}
mongoose.connect(process.env.ATLAS_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed', err));

// Start server: HTTP in test (CI), HTTPS otherwise
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'test') {
  // Start simple HTTP server for CI/testing environment
  http.createServer(app).listen(PORT, () => {
    console.log(`Test HTTP server running on http://localhost:${PORT}`);
  });
} else {
  // Start HTTPS server (production/dev)
  try {
    const httpsOptions = {
      key: fs.readFileSync('./keys/privatekey.pem'),
      cert: fs.readFileSync('./keys/certificate.pem'),
      minVersion: 'TLSv1.3',
    };
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`Secure server running on https://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start HTTPS server (keys missing?):', err.message);
    // Fallback to HTTP if you want (NOT recommended for production)
    // http.createServer(app).listen(PORT, () => console.log(`HTTP server running on http://localhost:${PORT}`));
  }
}

//-------------------------------------------------------------------End of File----------------------------------------------------------//