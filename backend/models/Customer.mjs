// Customer Model

// Defines the schema for customer data in MongoDB
import mongoose from 'mongoose';

// Customer Schema
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 60 },
  middleName: { type: String, maxlength: 60 },
  lastName: { type: String, required: true, maxlength: 60 },
  idNumber: { type: String, required: true, unique: true, maxlength: 20 },
  accountNumber: { type: String, required: true, unique: true, maxlength: 20 },
  passwordHash: { type: String, required: true }, // Storing hashed password in the database - the controller handles password hashing
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

// Export the Customer model
export default mongoose.model('Customer', customerSchema);
//-------------------------------------------------------------------End of File----------------------------------------------------------//