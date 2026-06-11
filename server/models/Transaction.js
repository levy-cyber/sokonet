const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Deposit', 'Withdrawal', 'Payment', 'Payout', 'Escrow_Hold', 'Escrow_Release', 'Escrow_Refund'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'KES',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    gateway: {
      type: String,
      enum: ['M-Pesa', 'Stripe', 'Wallet_Internal'],
      required: true,
    },
    referenceCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
