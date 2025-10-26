import { Router } from "express";
import { createPayment, getPaymentById, getAllPayments, getPaymentsByCustomer } from "../controllers/paymentController.mjs";
import { authMiddleware } from "../middleware/secure.mjs"; // ensure authenticated access

const router = Router();

// Protect all payment routes with authentication
router.use(authMiddleware);

// Payment endpoints (all protected by authMiddleware)
router.post("/createPayment", createPayment); // Create a new payment
router.get("/", getAllPayments);             // Get all payments (history)
router.get("/myPayments", getPaymentsByCustomer); // Get payments for the logged-in user
router.get("/:id", getPaymentById);          // Get a single payment by ID


export default router;
//-------------------------------------------------------------------End of File----------------------------------------------------------//