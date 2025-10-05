// Middleware for securing Express applications with HTTPS enforcement and security headers

// Enforce HTTPS and set security headers
export const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const proto = req.get('x-forwarded-proto') || req.protocol;
    if (proto !== 'https') {
      return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
    }
  }
  next();
};

// Middleware to set security headers
export const securityHeaders = (req, res, next) => {
  // HSTS
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');
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
    `frame-ancestors 'none'`
  ];
  res.setHeader('Content-Security-Policy', directives.join('; '));
  next();
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//