import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // who made the payment (optional now, useful later)
    customerId: { type: String, index: true },

    // payment details
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, required: true, uppercase: true }, // e.g., "ZAR"
    provider: { type: String, required: true },                  // e.g., "ABSA"
    swiftCode: { type: String, required: true },                 // AAAA-BB-CC-123 style

    // card storage (sanitized)
    cardBrand: { type: String, enum: ["VISA", "MASTERCARD", "AMEX", "UNKNOWN"], default: "UNKNOWN" },
    cardLast4: { type: String, minlength: 4, maxlength: 4 },
    cardToken: { type: String },  // reference to tokenized PAN (never raw card data)
    expiryMonth: { type: Number, min: 1, max: 12 },
    expiryYear:  { type: Number, min: 2024, max: 2100 },

    // lifecycle/state
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "SENT_TO_SWIFT", "FAILED"],
      default: "PENDING",
      index: true
    },

    // audit (simple)
    createdByIp: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true, versionKey: false }
);

// Harden against operator injection (only whitelisted paths are persisted)
PaymentSchema.set("strict", "throw");

export default mongoose.model("Payment", PaymentSchema);
