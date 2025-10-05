// Import Necessary for the Server Setup
import express from 'express';
import https from 'https';
import fs from 'fs';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import onboardingRoutes from './routes/onboardingRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware - allows requests from frontend - React app
app.use(cors());
app.use(express.json());

// Helmet security headers configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    frameguard: { action: 'deny' }, // this is an X-Frame-Options
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  })
);

// Onboarding routes
app.use('/api/onboarding', onboardingRoutes);

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