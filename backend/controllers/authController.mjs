// Controller for handling Customer Authentication and Registration

// Imports necessary for the Auth Controller
import { validationResult } from 'express-validator';
import Customer from '../models/Customer.mjs';
import Employee, { employeeLoginSchema } from '../models/Employee.mjs';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt, hmacHex } from '../utils/encryption.mjs';

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

    // Additional defensive checks - sanity limits

    // prevent buffer overflow attempts
    const maxFieldLengthRegister = 200; 
    const fields = { firstName, middleName, lastName, idNumber, accountNumber, password };
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string' && value.length > maxFieldLengthRegister) {
        return res.status(400).json({ message: `${key} too long` });
      }
    }

    // Use deterministic HMACs for uniqueness checks & lookups
    const idHash = hmacHex(idNumber);
    const acctHash = hmacHex(accountNumber);

    // Check if customer already exists
   const existing = await Customer.findOne({ $or: [{ idNumber }, { accountNumber }] });
    if (existing) {
      return res.status(409).json({ message: 'Customer already exists' });
    }

    // Hash the password using Argon2id
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    // Create and save the new customer
    const customer = new Customer({
      firstName: encrypt(firstName),
      middleName: encrypt(middleName || ''),
      lastName: encrypt(lastName),
      idNumber: encrypt(idNumber),
      idNumberHash: idHash,
      accountNumber: encrypt(accountNumber),
      accountNumberHash: acctHash,
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
    const firstNameInput = nameParts[0].toLowerCase();
    const lastNameInput = nameParts.slice(1).join(' ').toLowerCase();

    // Find customer by first name, last name, and account number
    const acctHash = hmacHex(accountNumber);
    const customer = await Customer.findOne({ accountNumberHash: acctHash });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const passwordOk = await argon2.verify(customer.passwordHash, password);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const decryptedFirst = decrypt(customer.firstName).toLowerCase();
    const decryptedLast = decrypt(customer.lastName).toLowerCase();

    if (decryptedFirst !== firstNameInput || decryptedLast !== lastNameInput) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: customer._id, role: customer.role },
      process.env.JWT_SECRET,         // uses our secret from .env
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Send JWT in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,      // not accessible by JS
      secure: true,        // only over HTTPS
      sameSite: 'strict',  // CSRF protection
      maxAge: 60 * 60 * 1000 // 1 hour
    });

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

// GET /api/auth/me
export const getCurrentUser = async (req, res) => {
  try {
    // authMiddleware should decode the JWT and attach user info
    const userId = req.user?.id;

    if (!userId)
      return res.status(401).json({ message: "Not authenticated" });

    const customer = await Customer.findById(userId);
    if (!customer)
      return res.status(404).json({ message: "User not found" });

    res.json({
      fullName: `${decrypt(customer.firstName)} ${decrypt(customer.lastName)}`,
      accountNumber: decrypt(customer.accountNumber),
      role: customer.role,
    });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch all employees 
    const employees = await Employee.find({});
    let matchedEmployee = null;

    for (const emp of employees) {
      const decryptedEmail = decrypt(emp.email);
      if (decryptedEmail === email) {
        matchedEmployee = emp;
        break;
      }
    }

    if (!matchedEmployee) {
      console.log(`Login failed: No employee found for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password
    const isMatch = await matchedEmployee.comparePassword(password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`Login successful for: ${email}`);
    res.status(200).json({
      message: 'Login successful',
      employee: {
        firstName: matchedEmployee.firstName,
        lastName: matchedEmployee.lastName,
        email: decrypt(matchedEmployee.email),
        role: matchedEmployee.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//