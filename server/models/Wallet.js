const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0.0,
      min: [0, 'Balance cannot be negative'],
    },
    currency: {
      type: String,
      default: 'KES',
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ['deposit', 'withdraw', 'escrow_hold', 'escrow_release', 'refund'],
        },
        amount: Number,
        status: {
          type: String,
          enum: ['pending', 'completed', 'failed'],
          default: 'pending',
        },
        reference: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wallet', walletSchema);