// server.mjs - feature-authentication-onboarding-zimkhitha branch 
import express from 'express';
import https from 'https';
import fs from 'fs';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import onboardingRoutes from './routes/onboardingRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helmet security headers
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

// MongoDB connection
mongoose.connect(process.env.ATLAS_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed', err));

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