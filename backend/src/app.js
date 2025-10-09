import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
// import mongoSanitize from "express-mongo-sanitize"; // Causing Express 5 compatibility issue
// import xss from "xss-clean"; // Causing Express 5 compatibility issue
import paymentsRouter from "./routes/payments.js";

const app = express();

// Core middleware with size limits for security
app.use(express.json({ 
  limit: "10kb",
  strict: true  // Only parse arrays and objects
}));
app.use(express.urlencoded({ 
  extended: false,
  limit: "10kb"
}));

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,  // tighten to your web origin in prod
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Alternative security: Manual input sanitization middleware
app.use((req, res, next) => {
  // Simple NoSQL injection prevention
  if (req.body) {
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (typeof obj[key] === 'string') {
          // Remove potential NoSQL operators and basic XSS attempts
          obj[key] = obj[key]
            .replace(/\$[a-zA-Z]+/g, '') // Remove $ operators
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .trim();
        }
      }
    };
    sanitizeObject(req.body);
  }
  next();
});

// Rate limiting
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too many requests from this IP, please try again later."
    }
  })
);

// Logging
app.use(morgan("tiny"));

// Routes
app.use("/api/payments", paymentsRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: "Validation failed", details: err.message });
  }
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: "Invalid input data", details: err.errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "Duplicate entry" });
  }
  
  res.status(500).json({ error: "Internal server error" });
});

export default app;
