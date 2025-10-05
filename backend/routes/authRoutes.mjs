// The input data is Validated and Sanitized before it gets to the Controller

// Imports necessary for the Auth Route Setup
import express from 'express';
import { body } from 'express-validator';
import { register } from '../controllers/authController.mjs';

// Create router
const router = express.Router();

// A strong password is ensured by password regex - must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

// Registration route with validation
router.post(
  '/register', 
  [
    body('firstName').notEmpty().trim().escape(),
    body('middleName').optional().trim().escape(),
    body('lastName').notEmpty().trim().escape(),
    body('idNumber').isAlphanumeric().isLength({ min: 6 }).trim(),
    body('accountNumber').isNumeric().isLength({ min: 6 }).trim(),
    body('password').matches(passwordRegex)
  ], 
  register
);

// Export the router
export default router;
//-------------------------------------------------------------------End of File----------------------------------------------------------//