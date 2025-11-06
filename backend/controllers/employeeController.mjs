import mongoose from "mongoose";
import Payment from '../models/Payment.mjs';
import Customer from "../models/Customer.mjs";
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

// Get decrypted customer name by ID
const customerCache = {};
const getCustomerNameCached = async (customerId) => {
  if (!customerId) return "Unknown Customer";

  // Decrypt first
  const decryptedId = safeDecrypt(customerId);
  if (!mongoose.Types.ObjectId.isValid(decryptedId)) return "Unknown Customer";

  if (customerCache[decryptedId]) return customerCache[decryptedId];

  const customer = await Customer.findById(decryptedId).lean();
  if (!customer) return "Unknown Customer";

  const name = `${safeDecrypt(customer.firstName)} ${safeDecrypt(customer.lastName)}`.trim();
  customerCache[decryptedId] = name;
  return name;
};


// -----------------------------------------------------------
// GET pending payments
// -----------------------------------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, action, swiftCode, comment } = req.body;
    const employeeId = req.employee?.id || req.employee?._id;

    if (!paymentId || !objectIdRegex.test(paymentId))
      return res.status(400).json({ message: "Invalid payment ID format." });

    if (!["ACCEPT", "REJECT"].includes(action))
      return res.status(400).json({ message: "Invalid action. Use ACCEPT or REJECT." });

    const sanitizedSwift = swiftCode ? swiftCode.replace(/-/g, "").toUpperCase() : "";
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
          swiftValidated: !!sanitizedSwift,
          comment: comment || null,
        },
      },
      { new: true }
    ).lean();

    if (!updatedPayment)
      return res.status(404).json({ message: "Payment not found or already processed." });

    const customerName = await getCustomerNameCached(updatedPayment.customerId);

    const decryptedPayment = {
      ...updatedPayment,
      customerId: safeDecrypt(updatedPayment.customerId),
      customerName, 
      provider: safeDecrypt(updatedPayment.provider),
      swiftCode: safeDecrypt(updatedPayment.swiftCode),
      cardLast4: maskCard(updatedPayment.cardLast4),
      comment: updatedPayment.comment || "",
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


// -----------------------------------------------------------
// GET processed payments
// -----------------------------------------------------------
export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "PENDING" }).lean();

    const safePayments = await Promise.all(
      payments.map(async (p) => ({
        id: String(p._id),
        customerId: safeDecrypt(p.customerId),
        customerName: await getCustomerNameCached(p.customerId),
        amount: p.amount,
        currency: p.currency,
        provider: safeDecrypt(p.provider),
        swiftCode: safeDecrypt(p.swiftCode),
        cardBrand: p.cardBrand,
        cardLast4: maskCard(p.cardLast4),
        createdAt: p.createdAt,
        status: p.status || "PENDING",
        comment: p.comment || "",
      }))
    );

    res.status(200).json(safePayments);
  } catch (err) {
    console.error("Error fetching pending payments:", err);
    res.status(500).json({ message: "Server error while fetching payments." });
  }
};

// -----------------------------------------------------------
// GET processed payments
// -----------------------------------------------------------
export const getProcessedPayments = async (req, res) => {
  try {
    const employeeId = req.employee?.id || req.employee?._id;

    const payments = await Payment.find({
      verifiedBy: employeeId,
      status: { $in: ["ACCEPTED", "REJECTED"] },
    })
      .sort({ verifiedAt: -1 })
      .lean();

    const decryptedPayments = await Promise.all(
      payments.map(async (p) => ({
        ...p,
        customerId: safeDecrypt(p.customerId),
        customerName: await getCustomerNameCached(p.customerId),
        provider: safeDecrypt(p.provider),
        swiftCode: safeDecrypt(p.swiftCode),
        cardLast4: maskCard(p.cardLast4),
        comment: p.comment || "", // include comment field
      }))
    );

    res.status(200).json(decryptedPayments);
  } catch (err) {
    console.error("Error fetching processed payments:", err);
    res.status(500).json({ message: "Server error while fetching processed payments." });
  }
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//