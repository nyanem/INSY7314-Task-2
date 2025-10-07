// The input data is Validated and Sanitized before it gets to the Controller

// Imports necessary for the Auth Route Setup
import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController.mjs';

// Create router
const router = express.Router();

// A strong password is ensured by password regex - must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

// Register route
router.post(
  '/register',
  [
    body('firstName')
      .trim()
      .escape()
      .isLength({ min: 1, max: 60 })
      .withMessage('First name must be 1–60 characters long.')
      .matches(/^[A-Za-z'\- ]+$/)
      .withMessage('First name may contain only letters, spaces, apostrophes, or hyphens.'),

    body('middleName')
      .optional({ checkFalsy: true })
      .trim()
      .escape()
      .isLength({ max: 60 })
      .withMessage('Middle name must be less than 60 characters.')
      .matches(/^[A-Za-z'\- ]*$/)
      .withMessage('Middle name may contain only letters, spaces, apostrophes, or hyphens.'),

    body('lastName')
      .trim()
      .escape()
      .isLength({ min: 1, max: 60 })
      .withMessage('Last name must be 1–60 characters long.')
      .matches(/^[A-Za-z'\- ]+$/)
      .withMessage('Last name may contain only letters, spaces, apostrophes, or hyphens.'),

    body('accountNumber')
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 6, max: 20 })
      .matches(/^[A-Za-z0-9\-]+$/)
      .withMessage('Account number may contain only letters, numbers, or hyphens.'),

    body('accountNumber')
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 6, max: 20 })
      .matches(/^[A-Za-z0-9\-]+$/)
      .withMessage('Account number may contain only letters, numbers, or hyphens.'),

    body('password')
      .matches(passwordRegex)
      .withMessage(
        'Password must be at least 12 characters long and include uppercase, lowercase, number, and special character.'
      ),
  ],
  register
);

// Login route using username
router.post(
  '/login',
  [
    body('userName')
      .notEmpty()
      .trim()
      .escape()
      .matches(/^[A-Za-z'\- ]+ [A-Za-z'\- ]+$/)
      .withMessage('Provide both first and last name, letters, spaces, apostrophes, or hyphens only.'),

    body('accountNumber')
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 6, max: 20 })
      .matches(/^[A-Za-z0-9\-]+$/)
      .withMessage('Account number may contain only letters, numbers, or hyphens.'),

    body('password')
      .notEmpty()
      .matches(passwordRegex)
      .withMessage('Invalid password format.')
  ],
  login
);

// Export the router
export default router;
//-------------------------------------------------------------------End of File----------------------------------------------------------//