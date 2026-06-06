import Escrow from '../models/Escrow.js';
import Order from '../models/Order.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { createNotification } from '../services/notificationService.js';

export const createEscrow = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  const order = await Order.findById(orderId).populate('buyer seller');
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  const existing = await Escrow.findOne({ order: orderId });
  if (existing) {
    return res.status(400).json({ message: 'Escrow is already active for this order.' });
  }

  const escrow = await Escrow.create({
    order: order._id,
    buyer: order.buyer,
    seller: order.seller,
    amount: order.amount,
    status: 'held',
  });

  await createNotification(order.buyer, 'Escrow created', `Funds for order ${order._id} are secured in escrow.`);
  await createNotification(order.seller, 'Escrow created', `Funds for order ${order._id} are held until delivery.`);
  res.status(201).json(escrow);
};

export const releaseEscrow = async (req, res) => {
  const { id } = req.params;
  const escrow = await Escrow.findById(id).populate('order buyer seller');
  if (!escrow) {
    return res.status(404).json({ message: 'Escrow entry not found.' });
  }

  if (escrow.status !== 'held') {
    return res.status(400).json({ message: 'Only held escrow can be released.' });
  }

  const sellerWallet = await Wallet.findOneAndUpdate(
    { user: escrow.seller },
    { $inc: { balance: escrow.amount } },
    { new: true, upsert: true }
  );

  await Transaction.create({
    user: escrow.seller,
    type: 'payment',
    amount: escrow.amount,
    status: 'completed',
    reference: `ESCROW-RELEASE-${Date.now()}`,
    description: `Escrow released for order ${escrow.order._id}`,
  });

  escrow.status = 'released';
  escrow.releaseDate = new Date();
  await escrow.save();

  const order = await Order.findById(escrow.order._id);
  order.status = 'released';
  order.escrowHeld = false;
  await order.save();

  await createNotification(escrow.buyer, 'Escrow released', `Payment for order ${order._id} was released to seller.`);
  await createNotification(escrow.seller, 'Payment released', `Escrow funds for order ${order._id} were transferred.`);
  res.json({ escrow, sellerWallet });
};

export const refundEscrow = async (req, res) => {
  const { id } = req.params;
  const escrow = await Escrow.findById(id).populate('order buyer seller');
  if (!escrow) {
    return res.status(404).json({ message: 'Escrow entry not found.' });
  }

  if (escrow.status !== 'held') {
    return res.status(400).json({ message: 'Only held escrow can be refunded.' });
  }

  const buyerWallet = await Wallet.findOneAndUpdate(
    { user: escrow.buyer },
    { $inc: { balance: escrow.amount } },
    { new: true, upsert: true }
  );

  await Transaction.create({
    user: escrow.buyer,
    type: 'refund',
    amount: escrow.amount,
    status: 'completed',
    reference: `ESCROW-REFUND-${Date.now()}`,
    description: `Escrow refund for order ${escrow.order._id}`,
  });

  escrow.status = 'refunded';
  escrow.releaseDate = new Date();
  await escrow.save();

  const order = await Order.findById(escrow.order._id);
  order.status = 'refunded';
  order.escrowHeld = false;
  await order.save();

  await createNotification(escrow.buyer, 'Escrow refunded', `Your payment for order ${order._id} was returned.`);
  await createNotification(escrow.seller, 'Escrow refunded', `Order ${order._id} was refunded to buyer.`);
  res.json({ escrow, buyerWallet });
};

export const getEscrows = async (req, res) => {
  const filters = {};
  if (req.user.role === 'seller') filters.seller = req.user._id;
  if (req.user.role === 'user') filters.buyer = req.user._id;
  const escrows = await Escrow.find(filters)
    .populate('order', 'amount status')
    .populate('buyer', 'name email')
    .populate('seller', 'name email');
  res.json(escrows);
};
