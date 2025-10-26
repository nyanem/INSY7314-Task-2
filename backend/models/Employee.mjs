// Employee model with password hashing and validation

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { sanitizeString } from '../utils/sanitize.mjs'; 
import { encrypt, decrypt } from '../utils/encryption.mjs';

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, default: 'employee' },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook: sanitize, encrypt email, hash password
employeeSchema.pre('save', async function (next) {
  this.firstName = sanitizeString(this.firstName);
  this.lastName = sanitizeString(this.lastName);

  // Encrypt email before saving
  if (this.isModified('email')) {
    const sanitizedEmail = sanitizeString(this.email.toLowerCase());
    this.email = encrypt(sanitizedEmail);
  }

  // Hash password only if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// Compare password method
employeeSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Decrypt email for display
employeeSchema.methods.getDecryptedEmail = function () {
  return decrypt(this.email);
};

// Zod input validation for login
export const employeeLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default mongoose.model('Employee', employeeSchema);
//-------------------------------------------------------------------End of File----------------------------------------------------------//