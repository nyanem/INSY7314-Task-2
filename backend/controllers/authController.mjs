// Controller for handling Customer Authentication and Registration

// Imports necessary for the Auth Controller
import { validationResult } from 'express-validator';
import Customer from '../models/Customer.mjs';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// Register handler
export const register = async (req, res) => {
  // Validate input
  try {
    // Validate input before DB queries
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    // Destructure request body
    const { firstName, middleName, lastName, idNumber, accountNumber, password } = req.body;

    // Additional defensive checks (sanity limits)
    const maxFieldLengthRegister = 200; // prevent buffer overflow attempts
    const fields = { firstName, middleName, lastName, idNumber, accountNumber, password };
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string' && value.length > maxFieldLengthRegister) {
        return res.status(400).json({ message: `${key} too long` });
      }
    }

    // Check if customer already exists
   const existing = await Customer.findOne({ $or: [{ idNumber }, { accountNumber }] });
    if (existing) {
      return res.status(409).json({ message: 'Customer already exists' });
    }

    // Hash the password using Argon2id
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    // Create and save the new customer
    const customer = new Customer({
      firstName,
      middleName,
      lastName,
      idNumber,
      accountNumber,
      passwordHash,
    });
    await customer.save();

    // Respond with success
    res.status(201).json({
      message: 'Customer registered successfully',
      customerId: customer._id,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login handler with JWT token generation
export const login = async (req, res) => {
  // Validate input and authenticate user
  try {
    // Validate input before DB queries
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Destructure request body
    const { userName, accountNumber, password } = req.body;

    // Additional defensive checks - sanity limits
    const maxFieldLengthLogin = 200;
    for (const [key, value] of Object.entries({ userName, accountNumber, password })) {
      if (typeof value === 'string' && value.length > maxFieldLengthLogin) {
        return res.status(400).json({ message: `${key} too long` });
      }
    }

    // Split userName into first and last name - assuming space-separated
    const nameParts = userName.trim().split(' ');
    if (nameParts.length < 2) {
      return res.status(400).json({ message: 'Please provide both first and last name in userName' });
    }
    const firstName = nameParts[0].toLowerCase();
    const lastName = nameParts.slice(1).join(' ').toLowerCase();

    // Find customer by first name, last name, and account number
    const customer = await Customer.findOne({ firstName, lastName, accountNumber });
    if (!customer || !(await argon2.verify(customer.passwordHash, password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: customer._id, role: customer.role },
      process.env.JWT_SECRET,         // uses your secret from .env
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Authentication successful
    res.status(200).json({
      message: 'Login successful',
      token,                          // return the JWT token
      customerId: customer._id,
      role: customer.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//