// Customer Model

// Defines the schema for customer data in MongoDB
import mongoose from 'mongoose';

// Customer Schema
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // Storing hashed password in the database - the controller handles password hashing
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

// Export the Customer model
export default mongoose.model('Customer', customerSchema);
//-------------------------------------------------------------------End of File----------------------------------------------------------//