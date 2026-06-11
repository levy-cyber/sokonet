const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { USE_MOCK, mockHelpers } = require('../config/db');
const mpesaService = require('../services/mpesaService');

// @desc    Get user wallet details
// @route   GET /api/wallet
// @access  Private
const getWalletDetails = async (req, res) => {
  try {
    let wallet;
    
    if (USE_MOCK) {
      wallet = mockHelpers.findWallet(req.user._id);
      if (!wallet) {
        // Create wallet if doesn't exist
        wallet = {
          _id: 'wallet' + Date.now(),
          user: req.user._id,
          balance: 1000,
          currency: 'KES',
          transactions: [{
            type: 'deposit',
            amount: 1000,
            status: 'completed',
            reference: 'SIGNUP_BONUS',
            createdAt: new Date()
          }],
          createdAt: new Date()
        };
      }
      res.json({ 
        success: true, 
        balance: wallet.balance, 
        currency: wallet.currency, 
        transactions: wallet.transactions,
        bankAccount: {
          paybill: process.env.BANK_PAYBILL || '247247',
          account: process.env.BANK_ACCOUNT || '0870185429080'
        }
      });
    } else {
      wallet = await Wallet.findOne({ user: req.user._id });

      if (!wallet) {
        wallet = await Wallet.create({ user: req.user._id, balance: 0.0 });
      }

      res.json({ 
        success: true, 
        balance: wallet.balance, 
        currency: wallet.currency, 
        transactions: wallet.transactions,
        bankAccount: {
          paybill: process.env.BANK_PAYBILL || '247247',
          account: process.env.BANK_ACCOUNT || '0870185429080'
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Mock deposit (for testing without payment gateways)
// @route   POST /api/wallet/deposit
// @access  Private
const depositFunds = async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Specify a valid amount' });
  }

  try {
    if (USE_MOCK) {
      let wallet = mockHelpers.findWallet(req.user._id);
      if (!wallet) {
        wallet = {
          _id: 'wallet' + Date.now(),
          user: req.user._id,
          balance: 0,
          currency: 'KES',
          transactions: [],
          createdAt: new Date()
        };
      }
      
      wallet.balance += Number(amount);
      wallet.transactions.push({
        type: 'deposit',
        amount: Number(amount),
        status: 'completed',
        reference: 'TEST_DEPOSIT',
        createdAt: new Date()
      });
      
      mockHelpers.updateWallet(req.user._id, wallet);
      res.json({ success: true, balance: wallet.balance, transactions: wallet.transactions });
    } else {
      const wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet) {
        wallet = await Wallet.create({ user: req.user._id, balance: 0.0 });
      }

      wallet.balance += Number(amount);
      wallet.transactions.push({
        type: 'deposit',
        amount: Number(amount),
        status: 'completed',
        reference: 'MANUAL_DEPOSIT',
        createdAt: new Date()
      });
      await wallet.save();

      res.json({ success: true, balance: wallet.balance, transactions: wallet.transactions });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Withdraw funds (mock for testing)
// @route   POST /api/wallet/withdraw
// @access  Private
const withdrawFunds = async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Specify a valid amount' });
  }

  try {
    if (USE_MOCK) {
      let wallet = mockHelpers.findWallet(req.user._id);
      if (!wallet || wallet.balance < Number(amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      wallet.balance -= Number(amount);
      wallet.transactions.push({
        type: 'withdraw',
        amount: Number(amount),
        status: 'completed',
        reference: 'TEST_WITHDRAW',
        createdAt: new Date()
      });
      
      mockHelpers.updateWallet(req.user._id, wallet);
      res.json({ success: true, balance: wallet.balance, transactions: wallet.transactions });
    } else {
      const wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet || wallet.balance < Number(amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      wallet.balance -= Number(amount);
      wallet.transactions.push({
        type: 'withdraw',
        amount: Number(amount),
        status: 'completed',
        reference: 'MANUAL_WITHDRAW',
        createdAt: new Date()
      });
      await wallet.save();

      res.json({ success: true, balance: wallet.balance, transactions: wallet.transactions });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Bank transfer to connected account
// @route   POST /api/wallet/bank-transfer
// @access  Private
const bankTransfer = async (req, res) => {
  const { amount, accountNumber } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Specify a valid amount' });
  }

  if (!accountNumber) {
    return res.status(400).json({ success: false, message: 'Account number is required' });
  }

  try {
    if (USE_MOCK) {
      let wallet = mockHelpers.findWallet(req.user._id);
      if (!wallet || wallet.balance < Number(amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      wallet.balance -= Number(amount);
      wallet.transactions.push({
        type: 'withdraw',
        amount: Number(amount),
        status: 'completed',
        reference: `BANK_TRANSFER_${accountNumber}`,
        createdAt: new Date()
      });
      
      mockHelpers.updateWallet(req.user._id, wallet);
      res.json({ 
        success: true, 
        balance: wallet.balance, 
        transactions: wallet.transactions,
        message: `Transfer of KES ${amount} to account ${accountNumber} initiated via Paybill ${process.env.BANK_PAYBILL || '247247'}`
      });
    } else {
      const wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet || wallet.balance < Number(amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      wallet.balance -= Number(amount);
      wallet.transactions.push({
        type: 'withdraw',
        amount: Number(amount),
        status: 'completed',
        reference: `BANK_TRANSFER_${accountNumber}`,
        createdAt: new Date()
      });
      await wallet.save();

      // Create transaction record
      await Transaction.create({
        wallet: wallet._id,
        user: req.user._id,
        type: 'Withdrawal',
        amount: Number(amount),
        currency: 'KES',
        status: 'Completed',
        gateway: 'Wallet_Internal',
        referenceCode: `BK${Date.now()}`,
        description: `Bank transfer to account ${accountNumber} via Paybill ${process.env.BANK_PAYBILL || '247247'}`
      });

      res.json({ 
        success: true, 
        balance: wallet.balance, 
        transactions: wallet.transactions,
        message: `Transfer of KES ${amount} to account ${accountNumber} initiated via Paybill ${process.env.BANK_PAYBILL || '247247'}`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    M-Pesa STK Push deposit
// @route   POST /api/wallet/mpesa-deposit
// @access  Private
const mpesaDeposit = async (req, res) => {
  const { amount, phoneNumber } = req.body;

  if (!amount || isNaN(amount) || amount < 10) {
    return res.status(400).json({ success: false, message: 'Amount must be at least KES 10' });
  }

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    const referenceCode = `DEP${Date.now()}`;
    const description = 'Wallet Deposit via M-Pesa';

    const stkPushResponse = await mpesaService.triggerStkPush(
      phoneNumber,
      amount,
      referenceCode,
      description
    );

    res.json({
      success: true,
      message: 'M-Pesa STK Push initiated. Please check your phone to complete the transaction.',
      merchantRequestID: stkPushResponse.MerchantRequestID,
      checkoutRequestID: stkPushResponse.CheckoutRequestID,
      isMock: stkPushResponse.isMock || false,
    });
  } catch (error) {
    console.error('M-Pesa deposit error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    M-Pesa B2C withdrawal
// @route   POST /api/wallet/mpesa-withdraw
// @access  Private
const mpesaWithdraw = async (req, res) => {
  const { amount, phoneNumber } = req.body;

  if (!amount || isNaN(amount) || amount < 10) {
    return res.status(400).json({ success: false, message: 'Amount must be at least KES 10' });
  }

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    if (USE_MOCK) {
      let wallet = mockHelpers.findWallet(req.user._id);
      if (!wallet || wallet.balance < Number(amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      wallet.balance -= Number(amount);
      wallet.transactions.push({
        type: 'withdraw',
        amount: Number(amount),
        status: 'completed',
        reference: `MPESA_WITHDRAW_${phoneNumber}`,
        createdAt: new Date()
      });
      
      mockHelpers.updateWallet(req.user._id, wallet);
      res.json({ 
        success: true, 
        balance: wallet.balance, 
        transactions: wallet.transactions,
        message: `Withdrawal of KES ${amount} to ${phoneNumber} initiated via M-Pesa`
      });
    } else {
      const wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet || wallet.balance < Number(amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      // Deduct balance first
      wallet.balance -= Number(amount);
      wallet.transactions.push({
        type: 'withdraw',
        amount: Number(amount),
        status: 'pending',
        reference: `MPESA_WITHDRAW_${phoneNumber}`,
        createdAt: new Date()
      });
      await wallet.save();

      // Trigger M-Pesa B2C
      const b2cResponse = await mpesaService.triggerPayout(
        phoneNumber,
        amount,
        'Wallet Withdrawal'
      );

      // Create transaction record
      await Transaction.create({
        wallet: wallet._id,
        user: req.user._id,
        type: 'Withdrawal',
        amount: Number(amount),
        currency: 'KES',
        status: 'Pending',
        gateway: 'M-Pesa',
        referenceCode: b2cResponse.ConversationID,
        description: `M-Pesa withdrawal to ${phoneNumber}`
      });

      res.json({
        success: true,
        balance: wallet.balance,
        transactions: wallet.transactions,
        message: `Withdrawal of KES ${amount} to ${phoneNumber} initiated via M-Pesa`,
        conversationID: b2cResponse.ConversationID,
        isMock: b2cResponse.isMock || false,
      });
    }
  } catch (error) {
    console.error('M-Pesa withdraw error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getWalletDetails,
  depositFunds,
  withdrawFunds,
  bankTransfer,
  mpesaDeposit,
  mpesaWithdraw,
};