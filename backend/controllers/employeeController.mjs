import Payment from '../models/Payment.mjs';
import { decrypt } from '../utils/encryption.mjs';

export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'PENDING' }).lean();

    const safePayments = payments.map(p => ({
      id: p._id,
      customerId: decrypt(p.customerId),
      amount: p.amount,
      currency: p.currency,
      provider: decrypt(p.provider),
      swiftCode: decrypt(p.swiftCode),
      cardBrand: p.cardBrand,
      cardLast4: decrypt(p.cardLast4),
      createdAt: p.createdAt,
    }));

    res.json(safePayments);
  } catch (err) {
    console.error('Error fetching pending payments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, action } = req.body;
    if (!['ACCEPT', 'REJECT'].includes(action)) return res.status(400).json({ message: 'Invalid action' });

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    await payment.save();

    res.json({ message: `Payment ${action.toLowerCase()}ed successfully.` });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//