// Customer Model

// Defines the schema for customer data in MongoDB
import mongoose from 'mongoose';

// Customer Schema
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 255 },
  middleName: { type: String, maxlength: 255 },
  lastName: { type: String, required: true, maxlength: 255 },
  idNumber: { type: String, required: true, unique: true, maxlength: 255 },
  idNumberHash: { type: String, required: true, unique: true, maxlength: 64 },
  accountNumber: { type: String, required: true, unique: true, maxlength: 255 },
  accountNumberHash: { type: String, required: true, unique: true, maxlength: 64 },
  passwordHash: { type: String, required: true }, // Storing hashed password in the database - the controller handles password hashing
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

// Export the Customer model
export default mongoose.model('Customer', customerSchema);
//-------------------------------------------------------------------End of File----------------------------------------------------------//