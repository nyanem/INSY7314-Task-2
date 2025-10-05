// Controller for handling Customer Authentication and Registration

// Imports necessary for the Auth Controller
import { validationResult } from 'express-validator';
import Customer from '../models/Customer.mjs';
import argon2 from 'argon2';

// Registration handler
export const register = async (req, res) => {
  // Validate input
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Destructure request body
    const { firstName, middleName, lastName, idNumber, accountNumber, password } = req.body;

    // Check if customer already exists
    const existing = await Customer.findOne({ $or: [{ idNumber }, { accountNumber }] });
    if (existing) return res.status(409).json({ message: 'Customer already exists' });

    // Hash the password using Argon2id
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    // Create and save the new customer
    const customer = new Customer({ firstName, middleName, lastName, idNumber, accountNumber, passwordHash });
    await customer.save();

    // Respond with success
    res.status(201).json({ message: 'Customer registered successfully', customerId: customer._id });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//