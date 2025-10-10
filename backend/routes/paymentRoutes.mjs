import { Router } from "express";
import { createPayment, getPaymentById, getAllPayments } from "../controllers/paymentController.mjs";
import { authMiddleware } from "../middleware/secure.mjs"; // ensure authenticated access

const router = Router();

// Protect all payment routes with authentication
router.use(authMiddleware);

// Payment endpoints
router.post("/", createPayment);       // Create a new payment
router.get("/", getAllPayments);       // Get all payments (history)
router.get("/:id", getPaymentById);    // Get a single payment by ID

export default router;
//-------------------------------------------------------------------End of File----------------------------------------------------------//