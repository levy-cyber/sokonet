import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { initiateMpesaDeposit } from '../services/mpesaService.js';
import { createNotification } from '../services/notificationService.js';

export const getWallet = async (req, res) => {
  const wallet = await Wallet.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { balance: 0, currency: 'KES', pendingDeposits: 0 } },
    { new: true, upsert: true }
  );
  res.json(wallet);
};

export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(transactions);
};

export const depositFunds = async (req, res) => {
  const { amount, phone } = req.body;
  if (!amount || amount <= 0 || !phone) {
    return res.status(400).json({ message: 'Amount and phone number are required.' });
  }

  const wallet = await Wallet.findOneAndUpdate(
    { user: req.user._id },
    { $inc: { pendingDeposits: amount } },
    { new: true, upsert: true }
  );

  const transaction = await Transaction.create({
    user: req.user._id,
    type: 'deposit',
    amount,
    status: 'pending',
    reference: `MPESA-${Date.now()}`,
    description: `Deposit request via MPesa for ${phone}`,
  });

  const mpesaResponse = await initiateMpesaDeposit({ amount, phone, reference: transaction.reference });
  await createNotification(req.user._id, 'Wallet deposit initiated', `A deposit of KES ${amount} is pending confirmation.`);

  res.json({ wallet, transaction, mpesaResponse });
};

export const withdrawFunds = async (req, res) => {
  const { amount, phone } = req.body;
  if (!amount || amount <= 0 || !phone) {
    return res.status(400).json({ message: 'Amount and phone number are required.' });
  }

  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet || wallet.balance < amount) {
    return res.status(400).json({ message: 'Insufficient wallet balance.' });
  }

  wallet.balance -= amount;
  await wallet.save();

  const transaction = await Transaction.create({
    user: req.user._id,
    type: 'withdraw',
    amount,
    status: 'completed',
    reference: `WITHDRAW-${Date.now()}`,
    description: `Withdrawal to MPesa ${phone}`,
  });

  await createNotification(req.user._id, 'Withdrawal completed', `KES ${amount} has been sent to ${phone}.`);
  res.json({ wallet, transaction });
};
