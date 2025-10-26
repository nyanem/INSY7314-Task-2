import { paymentCreateSchema } from "../validation/paymentSchema.mjs";
import { v4 as uuid } from "uuid";
import { encrypt, decrypt } from "../utils/encryption.mjs";
import Payment from '../models/Payment.mjs';

/**
 * POST /api/payments/createPayment
 * Creates a payment using Stripe and saves to MongoDB
 */
export const createPayment = async (req, res, next) => {
  try {
    // Validate input
    const parsed = paymentCreateSchema.parse(req.body);

    // Get customerId from JWT
    const customerId = req.user.id;

    const internalPaymentId = uuid();

    const doc = await Payment.create({
      customerId: encrypt(customerId),
      amount: parsed.amount,
      currency: parsed.currency,
      provider: encrypt(parsed.provider),
      swiftCode: encrypt(parsed.swiftCode),
      cardBrand: parsed.cardBrand,
      cardNumber: parsed.cardNumber ? encrypt(parsed.cardNumber) : undefined,
      cardHolderName: encrypt(parsed.cardHolderName),
      cardLast4: encrypt(parsed.cardLast4),
      expiryMonth: parsed.expiryMonth,
      expiryYear: parsed.expiryYear,
      cardToken: "none",
      status: 'PENDING',
      stripeId: internalPaymentId,
      createdByIp: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Return safe details to frontend
    res.status(201).json({
      id: doc._id,
      customerId,
      amount: doc.amount,
      currency: doc.currency,
      provider: parsed.provider,
      swiftCode: parsed.swiftCode,
      cardBrand: doc.cardBrand,
      cardLast4: parsed.cardLast4,
      expiryMonth: doc.expiryMonth,
      expiryYear: doc.expiryYear,
      status: doc.status,
      stripeId: internalPaymentId,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error('Payment creation error:', err);
    next(err);
  }
};

/**
 * GET /api/payments
 * Get all payments history - Admin View
 */
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
      paymentId: p.stripeId,
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
 * Fetch a single payment by ID
 */
export const getPaymentById = async (req, res, next) => {
  try {

    const { id } = req.params;

    // Fetch payment from Database
    const doc = await Payment.findById(id).lean();
    if (!doc) return res.status(404).json({ error: 'Payment not found' });

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
      stripeId: doc.stripeId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments/myPayments
 * Get all payments for the currently logged-in customer - Customer View
 */
export const getPaymentsByCustomer = async (req, res, next) => {
  try {
    // Fetch all payments
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();

    const customerPayments = payments.filter(p => decrypt(p.customerId) === req.user.id);

    const safePayments = customerPayments.map(p => {
      // Create a short reference from the stripeId
      const shortRef = p.stripeId.slice(0, 8);
        return {
          id: p._id,
          amount: p.amount,
          currency: p.currency,
          provider: decrypt(p.provider),
          swiftCode: decrypt(p.swiftCode),
          cardBrand: p.cardBrand,
          cardLast4: decrypt(p.cardLast4),
          expiryMonth: p.expiryMonth,
          expiryYear: p.expiryYear,
          status: p.status,
          paymentId: shortRef,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        };
    });

    // Return to frontend
    res.json(safePayments);
    } catch (err) {
      console.error("Error fetching customer payments:", err);
      next(err);
    }
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//