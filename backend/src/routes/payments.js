import { Router } from "express";
import Payment from "../models/Payment.js";
import { paymentCreateSchema } from "../validation/paymentSchema.js";
import { v4 as uuid } from "uuid";

const router = Router();

/**
 * POST /api/payments
 * Creates a payment in PENDING status.
 * EXPECTS ONLY DERIVED CARD METADATA (brand, last4, expiry); NEVER PAN/CVV.
 */
router.post("/", async (req, res, next) => {
  try {
    // Structural + regex validation
    const parsed = paymentCreateSchema.parse(req.body);

    // Simulate tokenization (in real life from a payment gateway)
    const fakeToken = `tok_${uuid()}`;

    const doc = await Payment.create({
      ...parsed,
      cardToken: fakeToken,
      createdByIp: req.ip,
      userAgent: req.get("user-agent")
    });

    // Return a safe payload (don’t expose internals)
    return res.status(201).json({
      id: doc._id,
      amount: doc.amount,
      currency: doc.currency,
      provider: doc.provider,
      swiftCode: doc.swiftCode,
      cardBrand: doc.cardBrand,
      cardLast4: doc.cardLast4,
      expiryMonth: doc.expiryMonth,
      expiryYear: doc.expiryYear,
      status: doc.status,
      createdAt: doc.createdAt
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/payments/:id
 * Fetch a single payment by id (history view optional).
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Using Mongoose findById avoids string interpolation → resists injection
    const doc = await Payment.findById(id).lean();

    if (!doc) return res.status(404).json({ error: "Payment not found" });

    // Return safe fields only
    const {
      _id, amount, currency, provider, swiftCode,
      cardBrand, cardLast4, expiryMonth, expiryYear,
      status, createdAt, updatedAt
    } = doc;

    return res.json({
      id: _id, amount, currency, provider, swiftCode,
      cardBrand, cardLast4, expiryMonth, expiryYear,
      status, createdAt, updatedAt
    });
  } catch (err) {
    next(err);
  }
});

export default router;
