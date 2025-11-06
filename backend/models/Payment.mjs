import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // Who made the payment (encrypted)
    customerId: { type: String, required: true, index: true },

    customerFirstName: { type: String, required: true },
    customerLastName: { type: String, required: true },

    // Payment details
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, required: true, uppercase: true },
    provider: { type: String, required: true }, 
    swiftCode: { type: String, required: true }, 

    // Card storage - Encrypted/Sanitized
    cardBrand: { type: String, enum: ["VISA", "MASTERCARD", "AMEX", "UNKNOWN"], default: "UNKNOWN" },
    cardNumber: { type: String, required: false },
    cardLast4: { type: String, required: true }, 
    cardHolderName: { type: String, required: false, maxlength: 255 },
    cardToken: { type: String, required: true }, 
    expiryMonth: { type: Number, required: true, min: 1, max: 12 },
    expiryYear: { type: Number, required: true, min: 2024, max: 2100 },

    stripeId: { type: String, required: true },

    // Lifecycle
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "SENT_TO_SWIFT", "FAILED"],
      default: "PENDING",
      index: true
    },

    // Employee Verification Section
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    verifiedAt: { type: Date },
    swiftValidated: { type: Boolean, default: false },
    comment: { type: String, default: null, maxlength: 1000 },

    // Audit
    createdByIp: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true, versionKey: false }
);

// Harden against operator injection - only whitelisted paths are persisted
PaymentSchema.set("strict", "throw");

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
//-------------------------------------------------------------------End of File----------------------------------------------------------//