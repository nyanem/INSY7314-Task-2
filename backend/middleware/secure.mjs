// Middleware for securing Express applications with HTTPS enforcement and security headers

import jwt from 'jsonwebtoken';

// Enforce HTTPS and set security headers
export const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const proto = req.get("x-forwarded-proto") || req.protocol;
    if (proto !== "https") {
      return res.redirect(301, `https://${req.get("host")}${req.originalUrl}`);
    }
  }
  next();
};

// Middleware to set security headers
export const securityHeaders = (req, res, next) => {
  // HSTS
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  // X-Frame-Options
  res.setHeader("X-Frame-Options", "DENY");
  // Basic CSP
  const frontend = process.env.FRONTEND_ORIGIN || "'self'";
  const directives = [
    `default-src 'self'`,
    `script-src 'self' ${frontend}`,
    `style-src 'self' ${frontend} 'unsafe-inline'`,
    `connect-src 'self' ${frontend}`,
    `img-src 'self' data:`,
    `font-src 'self' ${frontend} data:`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
  ];
  res.setHeader("Content-Security-Policy", directives.join("; "));
  next();
};

// Middleware to protect routes with JWT
export const authMiddleware = (req, res, next) => {
  try {
    // Try to get the token from header or cookies
    const authHeader = req.headers["authorization"];
    const cookieToken = req.cookies?.token; // if stored in cookies
    const token = authHeader?.split(" ")[1] || cookieToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify and decode the JWT using the secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to the request object
    req.user = decoded;

    next(); // proceed to the protected route
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//