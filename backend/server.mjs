// Import Necessary for the Server Setup
import express from 'express';
import https from 'https';
import fs from 'fs';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import Routes
import onboardingRoutes from './routes/onboardingRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';

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
  origin: process.env.FRONTEND_ORIGIN || '*',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Parse incoming JSON
app.use(express.json());

// Helmet security headers configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // custom CSP will be set in the security headers middleware
    frameguard: { action: 'deny' }, // x-frame-options
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // HSTS
  })
);

// Enforce HTTPS redirect and security headers - CSP, X-Frame, HSTS
app.use(enforceHTTPS);
app.use(securityHeaders);

// Onboarding routes
app.use('/api/onboarding', onboardingRoutes);

// Auth routes - register and login
app.use('/api/auth', authRoutes);

// Basic frontend demo routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to International Banking System</h1>
    <a href="/register"><button>Get Started</button></a>
    <a href="/register"><button>Get Started</button></a>
    <a href="/login"><button>Login</button></a>
  `);
});

app.get('/start', (req, res) => {
  res.send('<h1>Get Started Page</h1>');
});

app.get('/register', (req, res) => {
  res.send('<h1>Register Page</h1>');
});

app.get('/login', (req, res) => {
  res.send('<h1>Login Page</h1><p>Use your full name, account number and password to log in.</p>');
});

// NB: make sure your .env has ATLAS_URI for the connection string - you'll have to create your own .env file and also add the port number in there, mine is PORT=5000

// MongoDB connection


const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed', err));

  // NB: make sure you generate your own keys and place them in the keys folder, this is ignored by git for security reasons - certificate.pem and privatekey.pem

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('./keys/privatekey.pem'),
  cert: fs.readFileSync('./keys/certificate.pem'),
  minVersion: 'TLSv1.3',
};

// Start HTTP server for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



//-------------------------------------------------------------------End of File----------------------------------------------------------//