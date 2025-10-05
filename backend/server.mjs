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

// Auth routes
app.use('/api/auth', authRoutes);

// Basic frontend demo routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to International Banking System</h1>
    <a href="/register"><button>Get Started</button></a>
  `);
});

app.get('/register', (req, res) => {
  res.send('<h1>Register Page</h1>');
});

// NB: make sure your .env has ATLAS_URI for the connection string - you'll have to create your own .env file and also add the port number in there, mine is PORT=5000

// MongoDB connection
mongoose.connect(process.env.ATLAS_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed', err));

  // NB: make sure you generate your own keys and place them in the keys folder, this is ignored by git for security reasons - certificate.pem and privatekey.pem

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('./keys/privatekey.pem'),
  cert: fs.readFileSync('./keys/certificate.pem'),
  minVersion: 'TLSv1.3',
};

// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Secure server running on https://localhost:${PORT}`);
});
//-------------------------------------------------------------------End of File----------------------------------------------------------//