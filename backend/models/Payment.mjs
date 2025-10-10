import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // Who made the payment (encrypted)
    customerId: { type: String, required: true, index: true },

    // Payment details
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, required: true, uppercase: true }, // e.g., "ZAR"
    provider: { type: String, required: true },                   // e.g., "ABSA"
    swiftCode: { type: String, required: true },                 // e.g., AAAA-BB-CC-123

    // Card storage (encrypted/sanitized)
    cardBrand: { type: String, enum: ["VISA", "MASTERCARD", "AMEX", "UNKNOWN"], default: "UNKNOWN" },
    cardLast4: { type: String, required: true },  // remove minlength/maxlength for encryption
    cardToken: { type: String },                  // reference to tokenized PAN (never raw card data)
    expiryMonth: { type: Number, min: 1, max: 12 },
    expiryYear: { type: Number, min: 2024, max: 2100 },

    // Lifecycle / state
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "SENT_TO_SWIFT", "FAILED"],
      default: "PENDING",
      index: true
    },

    // Audit
    createdByIp: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true, versionKey: false }
);

// Harden against operator injection (only whitelisted paths are persisted)
PaymentSchema.set("strict", "throw");

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
//-------------------------------------------------------------------End of File----------------------------------------------------------//