import { Router } from 'express';
import { getPendingPayments, verifyPayment } from '../controllers/employeeController.mjs';
import { employeeAuthMiddleware } from '../middleware/employeeAuth.mjs';

const router = Router();

router.use(employeeAuthMiddleware);

router.get('/pendingPayments', getPendingPayments);
router.post('/verifyPayment', verifyPayment);

export default router;
//-------------------------------------------------------------------End of File----------------------------------------------------------//