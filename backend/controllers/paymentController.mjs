import Payment from "../models/Payment.mjs";
import { paymentCreateSchema } from "../validation/paymentSchema.mjs";
import { v4 as uuid } from "uuid";
import { encrypt, decrypt } from "../utils/encryption.mjs";

/**
 * POST /api/payments
 * Creates a payment in PENDING status.
 */
export const createPayment = async (req, res, next) => {
  try {
    // Validate input
    const parsed = paymentCreateSchema.parse(req.body);

    // Tokenize card info
    const fakeToken = `tok_${uuid()}`;

    // Save payment with encrypted sensitive fields
    const doc = await Payment.create({
      customerId: encrypt(parsed.customerId),
      amount: parsed.amount,
      currency: parsed.currency,
      provider: encrypt(parsed.provider),
      swiftCode: encrypt(parsed.swiftCode),
      cardBrand: parsed.cardBrand,
      cardLast4: encrypt(parsed.cardLast4),
      expiryMonth: parsed.expiryMonth,
      expiryYear: parsed.expiryYear,
      cardToken: fakeToken,
      status: "PENDING",
      createdByIp: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Return safe info to frontend
    res.status(201).json({
      id: doc._id,
      customerId: parsed.customerId,
      amount: doc.amount,
      currency: doc.currency,
      provider: parsed.provider,
      swiftCode: parsed.swiftCode,
      cardBrand: doc.cardBrand,
      cardLast4: parsed.cardLast4,
      expiryMonth: doc.expiryMonth,
      expiryYear: doc.expiryYear,
      status: doc.status,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

// Get all payments (for history view or admin)
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();

    const safePayments = payments.map((p) => ({
      id: p._id,
      customerId: decrypt(p.customerId),
      amount: p.amount,
      currency: p.currency,
      provider: decrypt(p.provider),
      swiftCode: decrypt(p.swiftCode),
      cardBrand: p.cardBrand,
      cardLast4: decrypt(p.cardLast4),
      expiryMonth: p.expiryMonth,
      expiryYear: p.expiryYear,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    res.json(safePayments);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments/:id
 * Fetch a single payment by id (history view optional).
 */
export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await Payment.findById(id).lean();
    if (!doc) return res.status(404).json({ error: "Payment not found" });

    res.json({
      id: doc._id,
      customerId: decrypt(doc.customerId),
      amount: doc.amount,
      currency: doc.currency,
      provider: decrypt(doc.provider),
      swiftCode: decrypt(doc.swiftCode),
      cardBrand: doc.cardBrand,
      cardLast4: decrypt(doc.cardLast4),
      expiryMonth: doc.expiryMonth,
      expiryYear: doc.expiryYear,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//