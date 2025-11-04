import mongoose from "mongoose";
import Payment from '../models/Payment.mjs';
import { decrypt } from '../utils/encryption.mjs';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const swiftRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

// Utility to safely decrypt a value
const safeDecrypt = (value, fallback = "N/A") => {
  try {
    return value ? decrypt(value) : fallback;
  } catch {
    return fallback;
  }
};

// Mask card number for display
const maskCard = (encryptedCardLast4) => {
  const last4 = safeDecrypt(encryptedCardLast4);
  return last4 !== "N/A" ? `**** **** **** ${last4}` : "N/A";
};

// GET pending payments
export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "PENDING" }).lean();

    const safePayments = payments.map((p) => ({
      id: p._id,
      customerId: safeDecrypt(p.customerId),
      amount: p.amount,
      currency: p.currency,
      provider: safeDecrypt(p.provider),
      swiftCode: safeDecrypt(p.swiftCode),
      cardBrand: p.cardBrand,
      cardLast4: maskCard(p.cardLast4),
      createdAt: p.createdAt,
    }));

    res.status(200).json(safePayments);
  } catch (err) {
    console.error("Error fetching pending payments:", err);
    res.status(500).json({ message: "Server error while fetching payments." });
  }
};

// POST verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, action, swiftCode } = req.body;
    const employeeId = req.employee?.id || req.employee?._id;

    if (!paymentId || !objectIdRegex.test(paymentId))
      return res.status(400).json({ message: "Invalid payment ID format." });

    if (!["ACCEPT", "REJECT"].includes(action))
      return res.status(400).json({ message: "Invalid action. Use ACCEPT or REJECT." });

    // sanitize SWIFT code by removing hyphens for validation
const sanitizedSwift = swiftCode ? swiftCode.replace(/-/g, "") : "";
if (sanitizedSwift && !swiftRegex.test(sanitizedSwift)) {
  return res.status(400).json({ message: "Invalid SWIFT/BIC code format." });
}


    const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: paymentId, status: "PENDING" },
      {
        $set: {
          status: newStatus,
          verifiedBy: employeeId,
          verifiedAt: new Date(),
          swiftValidated: !!swiftCode,
        },
      },
      { new: true }
    ).lean();

    if (!updatedPayment)
      return res.status(404).json({ message: "Payment not found or already processed." });

    // decrypt sensitive fields before returning
    const decryptedPayment = {
      ...updatedPayment,
      customerId: safeDecrypt(updatedPayment.customerId),
      provider: safeDecrypt(updatedPayment.provider),
      swiftCode: safeDecrypt(updatedPayment.swiftCode),
      cardLast4: maskCard(updatedPayment.cardLast4),
    };

    res.status(200).json({
      message: `Payment ${action.toLowerCase()}ed successfully.`,
      updatedPayment: decryptedPayment,
    });
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ message: "Server error while verifying payment." });
  }
};

// GET processed payments
export const getProcessedPayments = async (req, res) => {
  try {
    const employeeId = req.employee?.id || req.employee?._id;

    const payments = await Payment.find({
      verifiedBy: employeeId,
      status: { $in: ["ACCEPTED", "REJECTED"] },
    })
      .sort({ verifiedAt: -1 })
      .lean();

    const decryptedPayments = payments.map((p) => ({
      ...p,
      customerId: safeDecrypt(p.customerId),
      provider: safeDecrypt(p.provider),
      swiftCode: safeDecrypt(p.swiftCode),
      cardLast4: maskCard(p.cardLast4),
    }));

    res.status(200).json(decryptedPayments);
  } catch (err) {
    console.error("Error fetching processed payments:", err);
    res.status(500).json({ message: "Server error while fetching processed payments." });
  }
};
