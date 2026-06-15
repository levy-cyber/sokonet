const Escrow = require('../models/Escrow');
const Wallet = require('../models/Wallet');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const notificationService = require('../services/notificationService');

// @desc    Get all escrows (buyer, seller, or admin)
// @route   GET /api/escrow
// @access  Private
const getEscrows = async (req, res) => {
  try {
    let escrows;
    if (req.user.role === 'admin') {
      escrows = await Escrow.find({}).populate('buyer seller', 'name email phone').populate('order');
    } else if (req.user.role === 'seller') {
      escrows = await Escrow.find({ seller: req.user._id }).populate('buyer seller', 'name email phone').populate('order');
    } else {
      escrows = await Escrow.find({ buyer: req.user._id }).populate('buyer seller', 'name email phone').populate('order');
    }

    res.json({ success: true, count: escrows.length, data: escrows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Raise a dispute on locked escrow
// @route   POST /api/escrow/:id/dispute
// @access  Private
const raiseDispute = async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ success: false, message: 'Please provide a reason for the dispute' });
  }

  try {
    const escrow = await Escrow.findById(req.params.id);

    if (!escrow) {
      return res.status(404).json({ success: false, message: 'Escrow contract not found' });
    }

    // Check authorization: Only buyer or seller can dispute
    if (
      escrow.buyer.toString() !== req.user._id.toString() &&
      escrow.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to dispute this escrow' });
    }

    if (escrow.status !== 'Held') {
      return res.status(400).json({ success: false, message: `Escrow cannot be disputed. Status: ${escrow.status}` });
    }

    escrow.status = 'Disputed';
    escrow.disputeReason = reason;
    await escrow.save();

    // Update order payment status
    await Order.findByIdAndUpdate(escrow.order, { paymentStatus: 'Refunded' }); // Flagged as open issue/refund potential

    // Notify other party
    const notifier = req.user._id.toString() === escrow.buyer.toString() ? escrow.seller : escrow.buyer;
    await notificationService.createNotification(
      notifier,
      'Escrow Payment Disputed',
      `A dispute has been raised regarding payment of KES ${escrow.amount}. Reason: ${reason}`,
      'Escrow',
      `/escrow`
    );

    // Notify admins (implied in production dashboard)
    res.json({ success: true, message: 'Dispute raised successfully. Netsoko Admin review initiated.', data: escrow });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Resolve a dispute (Admin only)
// @route   POST /api/escrow/:id/resolve
// @access  Private/Admin
const resolveDispute = async (req, res) => {
  const { resolution } = req.body; // 'Refund' or 'Release'

  if (!resolution || !['Refund', 'Release'].includes(resolution)) {
    return res.status(400).json({ success: false, message: 'Specify resolution as either Refund or Release' });
  }

  try {
    const escrow = await Escrow.findById(req.params.id).populate('order');

    if (!escrow) {
      return res.status(404).json({ success: false, message: 'Escrow contract not found' });
    }

    if (escrow.status !== 'Disputed') {
      return res.status(400).json({ success: false, message: 'Escrow is not in Disputed status' });
    }

    if (resolution === 'Release') {
      escrow.status = 'Released';
      escrow.releasedAt = Date.now();
      escrow.disputeResolution = 'Admin ruled in favor of Seller. Funds released.';
      await escrow.save();

      // Credit Seller wallet
      const sellerWallet = await Wallet.findOne({ user: escrow.seller });
      if (sellerWallet) {
        sellerWallet.balance += escrow.amount;
        await sellerWallet.save();

        await Transaction.create({
          wallet: sellerWallet._id,
          user: escrow.seller,
          type: 'Escrow_Release',
          amount: escrow.amount,
          gateway: 'Wallet_Internal',
          status: 'Completed',
          description: `Dispute resolved: Funds released for order #${escrow.order._id}`,
        });
      }

      await Order.findByIdAndUpdate(escrow.order._id, { paymentStatus: 'Released', deliveryStatus: 'Delivered' });

      // Notify parties
      await notificationService.createNotification(
        escrow.seller,
        'Dispute Resolved: Funds Credited',
        `Admin resolved dispute on Order #${escrow.order._id}. KES ${escrow.amount} is added to your wallet.`,
        'Escrow'
      );

      await notificationService.createNotification(
        escrow.buyer,
        'Dispute Resolved: Funds Released',
        `Admin resolved dispute on Order #${escrow.order._id} in favor of the Seller.`,
        'Escrow'
      );
    } else {
      // Refund
      escrow.status = 'Refunded';
      escrow.disputeResolution = 'Admin ruled in favor of Buyer. Funds refunded.';
      await escrow.save();

      // Credit Buyer wallet
      const buyerWallet = await Wallet.findOne({ user: escrow.buyer });
      if (buyerWallet) {
        buyerWallet.balance += escrow.amount;
        await buyerWallet.save();

        await Transaction.create({
          wallet: buyerWallet._id,
          user: escrow.buyer,
          type: 'Escrow_Refund',
          amount: escrow.amount,
          gateway: 'Wallet_Internal',
          status: 'Completed',
          description: `Dispute resolved: Funds refunded for order #${escrow.order._id}`,
        });
      }

      await Order.findByIdAndUpdate(escrow.order._id, { paymentStatus: 'Refunded', deliveryStatus: 'Cancelled' });

      // Notify parties
      await notificationService.createNotification(
        escrow.buyer,
        'Dispute Resolved: Refunded',
        `Admin resolved dispute on Order #${escrow.order._id}. KES ${escrow.amount} is returned to your wallet.`,
        'Escrow'
      );

      await notificationService.createNotification(
        escrow.seller,
        'Dispute Resolved: Refunded to Buyer',
        `Admin resolved dispute on Order #${escrow.order._id} in favor of the Buyer.`,
        'Escrow'
      );
    }

    res.json({ success: true, message: `Dispute resolved with: ${resolution}`, data: escrow });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getEscrows,
  raiseDispute,
  resolveDispute,
};
