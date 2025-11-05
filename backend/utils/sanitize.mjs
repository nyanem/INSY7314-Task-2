// Sanization for the application inputs

export const sanitizeString = (str, allowedPattern = /^[a-zA-Z0-9 .,@'-]+$/) => {
  if (typeof str !== 'string') return '';
  str = str.trim();
  str = str.split('').filter(c => allowedPattern.test(c)).join('');
  return str;
};

export const sanitizeNumber = (num) => {
  if (typeof num === 'string') {
    num = num.replace(/[^0-9.]/g, '');
  }
  const parsed = parseFloat(num);
  return isNaN(parsed) ? null : parsed;
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return null;
  email = email.trim().toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return valid ? email : null;
};

export const sanitizeObject = (obj, stringPattern = /^[a-zA-Z0-9 .,@'-]+$/) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key], stringPattern);
    } else if (typeof obj[key] === 'number') {
      sanitized[key] = sanitizeNumber(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key], stringPattern);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//