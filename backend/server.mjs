// Import Necessary for the Server Setup
import express from 'express';
import https from 'https';
import fs from 'fs';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp'; 
import cookieParser from 'cookie-parser'; 
import morgan from 'morgan';

// Import Routes
import onboardingRoutes from './routes/onboardingRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';
import paymentRoutes from './routes/paymentRoutes.mjs';

// Import security middleware
import { enforceHTTPS, securityHeaders } from './middleware/secure.mjs';

// Import authentication middleware - this will be used once the dashboard and other pages are set up
import { authMiddleware } from './middleware/secure.mjs';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS only from your frontend origin
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'https://localhost:3000',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Parse incoming JSON
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    express.json({ limit: '10kb' })(req, res, next);
  } else {
    next();
  }
});

// Parse cookies
app.use(cookieParser());

// Prevent HTTP parameter Pollution
app.use(hpp());

// Sanitize MongoDB queries to prevent NoSQL injection
app.use(mongoSanitize({ replaceWith: '_'}));

// Prevent XSS attacks
app.use(xss());

app.use(morgan('tiny'));

/* SERCURITY HEADERS */

// Helmet security headers configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // custom CSP will be set in the security headers middleware
    frameguard: { action: 'deny' }, // x-frame-options
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // HSTS
  })
);

// Rate limit to prevent brute-force & DDoS - for endpoints
app.use(
  '/api/auth/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: { message: 'Too many requests, please try again later.' },
  })
);

// Global rate limit for all API routes (payments + others)
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  })
);

// Enforce HTTPS redirect and security headers - CSP, X-Frame, HSTS
app.use(enforceHTTPS);
app.use(securityHeaders);

/* Routes */

// Onboarding routes
app.use('/api/onboarding', onboardingRoutes);

// Auth routes - register and login
app.use('/api/auth', authRoutes);

// Payments routes
app.use('/api/payments', paymentRoutes);

// Basic frontend demo routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to International Banking System</h1>
    <a href="/register"><button>Get Started</button></a>
    <a href="/register"><button>Get Started</button></a>
    <a href="/login"><button>Login</button></a>
  `);
});

app.get('/start', (req, res) => { res.send('<h1>Get Started Page</h1>'); });

app.get('/register', (req, res) => { res.send('<h1>Register Page</h1>'); });

app.get('/login', (req, res) => { res.send('<h1>Login Page</h1><p>Use your full name, account number and password to log in.</p>'); });

/* 404 and Error Handling */

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: err.message });
  }
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Invalid input data', details: err.errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate entry' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

/* Database Connection - MongoDB */

// MongoDB connection
mongoose.connect(process.env.ATLAS_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed', err));

/* Setting up HTTPS Server Configuration */

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('./keys/privatekey.pem'),
  cert: fs.readFileSync('./keys/certificate.pem'),
  minVersion: 'TLSv1.3',
};

/* Start HTTPS Server */

// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Secure server running on https://localhost:${PORT}`);
});
//-------------------------------------------------------------------End of File----------------------------------------------------------//