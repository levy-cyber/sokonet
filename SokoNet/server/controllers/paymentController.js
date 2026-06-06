import Transaction from '../models/Transaction.js';
import { sendNotificationToUser } from '../services/notificationService.js';

// Initiate a payment (placeholder)
export const initiatePayment = async (req, res) => {
  const { userId, amount, currency = 'KES', source = 'mpesa' } = req.body;
  if (!userId || !amount) return res.status(400).json({ message: 'userId and amount are required' });

  // create a placeholder transaction
  const tx = await Transaction.create({ user: userId, amount, currency, source, status: 'pending' });

  // notify user (via socket) that payment was initiated
  sendNotificationToUser(userId, { type: 'payment_initiated', txId: tx._id, amount });

  res.status(201).json({ transaction: tx });
};

// Confirm a payment (placeholder)
export const confirmPayment = async (req, res) => {
  const { txId, success = true } = req.body;
  if (!txId) return res.status(400).json({ message: 'txId is required' });

  const tx = await Transaction.findById(txId);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });

  tx.status = success ? 'completed' : 'failed';
  await tx.save();

  // notify user about payment result
  sendNotificationToUser(tx.user.toString(), { type: 'payment_result', txId: tx._id, success, amount: tx.amount });

  res.json({ transaction: tx });
};
