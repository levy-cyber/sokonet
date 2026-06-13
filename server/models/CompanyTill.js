const mongoose = require('mongoose');

const companyTillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Company Till',
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'KES',
    },
    transactions: [{
      type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer'],
      },
      amount: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
      reference: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompanyTill', companyTillSchema);
