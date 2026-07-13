const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { USE_MOCK, mockHelpers, mockDB } = require('../config/db');
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

// @desc    Get wallet transactions
// @route   GET /api/wallet/transactions
// @access  Private
const getWalletTransactions = async (req, res) => {
  try {
    if (USE_MOCK) {
      const wallet = mockHelpers.findWallet(req.user._id) || { transactions: [] };
      return res.json({ success: true, data: wallet.transactions });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.json({ success: true, data: [] });
    res.json({ success: true, data: wallet.transactions });
  } catch (err) {
    console.error('Get wallet transactions error:', err);
    res.status(500).json({ success: false, error: err.message });
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

// @desc    Bank transfer to connected account via M-Pesa
// @route   POST /api/wallet/bank-transfer
// @access  Private
const bankTransfer = async (req, res) => {
  const { amount, accountNumber, phoneNumber, pin } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Specify a valid amount' });
  }

  if (!accountNumber) {
    return res.status(400).json({ success: false, message: 'Account number is required' });
  }

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'M-Pesa phone number is required' });
  }

  if (!pin) {
    return res.status(400).json({ success: false, message: 'M-Pesa PIN is required' });
  }

  try {
    let wallet;
    if (USE_MOCK) {
      wallet = mockHelpers.findWallet(req.user._id);
      if (!wallet || wallet.balance < Number(amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }
    } else {
      wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet || wallet.balance < Number(amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }
    }

    const referenceCode = `BANK${Date.now()}`;
    const description = 'Bank Transfer via M-Pesa';

    // Trigger M-Pesa STK Push for withdrawal
    const stkPushResponse = await mpesaService.triggerStkPush(
      phoneNumber,
      amount,
      referenceCode,
      description
    );

    // Simulate successful M-Pesa transaction (in production, this would be handled by callback)
    // For now, we'll deduct the amount from digital wallet
    const transferAmount = Number(amount);
    
    if (USE_MOCK) {
      wallet.balance -= transferAmount;
      wallet.transactions.push({
        type: 'withdrawal',
        amount: transferAmount,
        status: 'completed',
        reference: `BANK_TRANSFER_${referenceCode}`,
        description: `Bank transfer to account ${accountNumber} via M-Pesa`,
        gateway: 'M-Pesa',
        bankAccount: accountNumber,
        createdAt: new Date()
      });
      mockHelpers.updateWallet(req.user._id, wallet);
    } else {
      wallet.balance -= transferAmount;
      wallet.transactions.push({
        type: 'withdrawal',
        amount: transferAmount,
        status: 'completed',
        reference: `BANK_TRANSFER_${referenceCode}`,
        description: `Bank transfer to account ${accountNumber} via M-Pesa`,
        gateway: 'M-Pesa',
        bankAccount: accountNumber,
        createdAt: new Date()
      });
      await wallet.save();

      // Create transaction record (idempotent)
      const { createOrGetTransaction } = require('../utils/transactionHelpers');
      await createOrGetTransaction(
        { remoteId: stkPushResponse.CheckoutRequestID || stkPushResponse.MerchantRequestID, referenceCode },
        {
          wallet: wallet._id,
          user: req.user._id,
          type: 'Withdrawal',
          amount: transferAmount,
          currency: 'KES',
          status: 'Completed',
          gateway: 'M-Pesa',
          referenceCode: referenceCode,
          remoteId: stkPushResponse.CheckoutRequestID || stkPushResponse.MerchantRequestID,
          metadata: {
            phoneNumber: phoneNumber,
            merchantRequestID: stkPushResponse.MerchantRequestID,
            checkoutRequestID: stkPushResponse.CheckoutRequestID,
            bankAccount: accountNumber,
          },
          description: `Bank transfer to account ${accountNumber} via M-Pesa from ${phoneNumber}`,
        }
      );
    }

    res.json({
      success: true,
      message: `Bank transfer of KES ${amount} to account ${accountNumber} initiated via M-Pesa`,
      balance: wallet.balance,
      merchantRequestID: stkPushResponse.MerchantRequestID,
      checkoutRequestID: stkPushResponse.CheckoutRequestID,
      isMock: stkPushResponse.isMock || false,
    });
  } catch (error) {
    console.error('Bank transfer error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    M-Pesa STK Push deposit
// @route   POST /api/wallet/mpesa-deposit
// @access  Private
const mpesaDeposit = async (req, res) => {
  const { amount, phoneNumber, pin } = req.body;

  if (!amount || isNaN(amount) || amount < 10) {
    return res.status(400).json({ success: false, message: 'Amount must be at least KES 10' });
  }

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  if (!pin) {
    return res.status(400).json({ success: false, message: 'M-Pesa PIN is required' });
  }

  try {
    let wallet;
    if (USE_MOCK) {
      wallet = mockHelpers.findWallet(req.user._id);
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
    } else {
      wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet) {
        wallet = await Wallet.create({ user: req.user._id, balance: 0.0 });
      }
    }

    const referenceCode = `DEP${Date.now()}`;
    const description = 'Wallet Deposit via M-Pesa to Bank Account';

    // Trigger M-Pesa STK Push
    const stkPushResponse = await mpesaService.triggerStkPush(
      phoneNumber,
      amount,
      referenceCode,
      description
    );

    // Simulate successful M-Pesa transaction (in production, this would be handled by callback)
    // For now, we'll add the amount to both bank account and digital wallet
    const depositAmount = Number(amount);
    
    if (USE_MOCK) {
      wallet.balance += depositAmount;
      wallet.transactions.push({
        type: 'deposit',
        amount: depositAmount,
        status: 'completed',
        reference: `MPESA_${referenceCode}`,
        description: `M-Pesa deposit from ${phoneNumber} to bank account`,
        gateway: 'M-Pesa',
        bankAccount: process.env.BANK_ACCOUNT || '0870185429080',
        createdAt: new Date()
      });
      mockHelpers.updateWallet(req.user._id, wallet);
    } else {
      wallet.balance += depositAmount;
      wallet.transactions.push({
        type: 'deposit',
        amount: depositAmount,
        status: 'completed',
        reference: `MPESA_${referenceCode}`,
        description: `M-Pesa deposit from ${phoneNumber} to bank account`,
        gateway: 'M-Pesa',
        bankAccount: process.env.BANK_ACCOUNT || '0870185429080',
        createdAt: new Date()
      });
      await wallet.save();

      // Create transaction record (idempotent)
      const { createOrGetTransaction } = require('../utils/transactionHelpers');
      await createOrGetTransaction(
        { remoteId: stkPushResponse.CheckoutRequestID || stkPushResponse.MerchantRequestID, referenceCode },
        {
          wallet: wallet._id,
          user: req.user._id,
          type: 'Deposit',
          amount: depositAmount,
          currency: 'KES',
          status: 'Completed',
          gateway: 'M-Pesa',
          referenceCode: referenceCode,
          remoteId: stkPushResponse.CheckoutRequestID || stkPushResponse.MerchantRequestID,
          receiptNumber: stkPushResponse.MpesaReceiptNumber || null,
          metadata: {
            phoneNumber: phoneNumber,
            merchantRequestID: stkPushResponse.MerchantRequestID,
            checkoutRequestID: stkPushResponse.CheckoutRequestID,
            bankAccount: process.env.BANK_ACCOUNT || '0870185429080'
          },
          description: `M-Pesa deposit from ${phoneNumber} to bank account ${process.env.BANK_ACCOUNT || '0870185429080'}`,
        }
      );
    }

    res.json({
      success: true,
      message: 'M-Pesa deposit successful. Amount added to bank account and digital wallet.',
      balance: wallet.balance,
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

      // Create transaction record (idempotent)
      const { createOrGetTransaction } = require('../utils/transactionHelpers');
      await createOrGetTransaction(
        { remoteId: b2cResponse.ConversationID, referenceCode: b2cResponse.ConversationID },
        {
          wallet: wallet._id,
          user: req.user._id,
          type: 'Withdrawal',
          amount: Number(amount),
          currency: 'KES',
          status: 'Pending',
          gateway: 'M-Pesa',
          referenceCode: b2cResponse.ConversationID,
          remoteId: b2cResponse.ConversationID,
          description: `M-Pesa withdrawal to ${phoneNumber}`
        }
      );

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
  getWalletTransactions,
  depositFunds,
  withdrawFunds,
  bankTransfer,
  mpesaDeposit,
  mpesaWithdraw,
};

// ====== Callback handlers for M-Pesa webhooks ======

// STK Push callback handler
const handleStkCallback = async (req, res) => {
  try {
    const body = req.body;
    console.log('[M-Pesa STK Callback] Received:', JSON.stringify(body));

    const stk = body?.Body?.stkCallback || body?.stkCallback || null;
    if (!stk) {
      console.warn('No stkCallback payload found');
      return res.status(200).json({ success: true });
    }

    const merchantRequestID = stk.MerchantRequestID;
    const checkoutRequestID = stk.CheckoutRequestID;
    const resultCode = Number(stk.ResultCode);

    // Attempt to extract metadata values
    const items = stk.CallbackMetadata && stk.CallbackMetadata.Item ? stk.CallbackMetadata.Item : stk.CallbackMetadata?.item || [];
    const amountItem = items.find((i) => i.Name === 'Amount' || i.name === 'Amount');
    const phoneItem = items.find((i) => i.Name === 'PhoneNumber' || i.name === 'PhoneNumber');
    const receiptItem = items.find((i) => i.Name === 'MpesaReceiptNumber' || i.name === 'MpesaReceiptNumber');
    const accountRefItem = items.find((i) => i.Name === 'AccountReference' || i.name === 'AccountReference');

    const amount = amountItem ? Number(amountItem.Value) : undefined;
    const phoneNumber = phoneItem ? String(phoneItem.Value) : undefined;
    const receipt = receiptItem ? String(receiptItem.Value) : undefined;
    const accountRef = accountRefItem ? String(accountRefItem.Value) : null;

    // If we're running a local signed simulation (explicit test secret), short-circuit to mock credit
    if (process.env.MPESA_WEBHOOK_SECRET === 'test_secret') {
      try {
        const depositAmount = amount || 0;
        const targetWallet = mockDB.wallets && mockDB.wallets.length ? mockDB.wallets[0] : null;
        if (targetWallet) {
          const reference = accountRef || checkoutRequestID || receipt || `MPESA_SIM_${Date.now()}`;
          targetWallet.balance = (targetWallet.balance || 0) + depositAmount;
          targetWallet.transactions = targetWallet.transactions || [];
          targetWallet.transactions.push({ type: 'deposit', amount: depositAmount, status: 'completed', reference, createdAt: new Date() });
          mockHelpers.updateWallet(targetWallet.user, targetWallet);
        }
        return res.status(200).json({ success: true, simulated: true });
      } catch (e) {
        console.error('Simulated STK handling error:', e);
        return res.status(500).json({ success: false, error: 'Simulated handling failed' });
      }
    }

    // If running in MOCK mode, credit the first mock wallet and return quickly
    console.log('[STK Handler] USE_MOCK=', USE_MOCK);
    if (USE_MOCK) {
      try {
        const depositAmount = amount || 0;
        // pick a deterministic mock wallet (first one) to receive simulated deposits
        const targetWallet = mockDB.wallets && mockDB.wallets.length ? mockDB.wallets[0] : null;
        if (targetWallet) {
          const reference = accountRef || checkoutRequestID || receipt || `MPESA_${Date.now()}`;
          targetWallet.balance = (targetWallet.balance || 0) + depositAmount;
          targetWallet.transactions = targetWallet.transactions || [];
          targetWallet.transactions.push({ type: 'deposit', amount: depositAmount, status: 'completed', reference, createdAt: new Date() });
          mockHelpers.updateWallet(targetWallet.user, targetWallet);
        }
      } catch (e) {
        console.error('Mock STK handling error:', e);
      }
      return res.status(200).json({ success: true, isMock: true });
    }

    // Try to find a corresponding Transaction by referenceCode, CheckoutRequestID or MerchantRequestID
    let transaction = null;
    if (accountRef) {
      transaction = await Transaction.findOne({ referenceCode: accountRef });
    }
    if (!transaction && checkoutRequestID) {
      transaction = await Transaction.findOne({ referenceCode: checkoutRequestID });
    }
    if (!transaction && merchantRequestID) {
      transaction = await Transaction.findOne({ referenceCode: merchantRequestID });
    }

    // If not found in Transaction collection, try to locate a Wallet transaction entry
    let wallet = null;
    if (!transaction && accountRef) {
      wallet = await Wallet.findOne({ 'transactions.reference': { $in: [accountRef, `MPESA_${accountRef}`] } });
    }
    if (!wallet && transaction) {
      wallet = await Wallet.findById(transaction.wallet);
    }

    if (resultCode === 0) {
      // Success: update transaction and wallet balance
      if (transaction) {
        transaction.status = 'Completed';
        if (amount) transaction.amount = Number(amount);
        if (!transaction.gateway) transaction.gateway = 'M-Pesa';
        if (checkoutRequestID) transaction.remoteId = checkoutRequestID;
        if (merchantRequestID && !transaction.remoteId) transaction.remoteId = merchantRequestID;
        if (receipt) transaction.receiptNumber = receipt;
        transaction.metadata = Object.assign(transaction.metadata || {}, { phoneNumber, merchantRequestID, checkoutRequestID, receipt });
        await transaction.save();

        // Ensure wallet balance is credited
        if (!wallet) wallet = await Wallet.findById(transaction.wallet);
        if (wallet) {
          // prevent double-credit: check if wallet.transactions already has this receipt/reference marked completed
          const existing = wallet.transactions.find((t) => t.reference === (accountRef || checkoutRequestID || receipt) && t.status === 'completed');
          if (!existing) {
            wallet.balance = (wallet.balance || 0) + (amount || transaction.amount || 0);
            wallet.transactions.push({ type: 'deposit', amount: amount || transaction.amount || 0, status: 'completed', reference: accountRef || checkoutRequestID || receipt });
            await wallet.save();
          }
        }
      } else if (wallet) {
        // Create transaction record and credit wallet
        const depositAmount = amount || 0;
        wallet.balance = (wallet.balance || 0) + depositAmount;
        const reference = accountRef || checkoutRequestID || receipt || `MPESA_${merchantRequestID || Date.now()}`;
        wallet.transactions.push({ type: 'deposit', amount: depositAmount, status: 'completed', reference });
        await wallet.save();

        // create Transaction document for ledger (idempotent)
        const { createOrGetTransaction } = require('../utils/transactionHelpers');
        await createOrGetTransaction(
          { remoteId: checkoutRequestID || merchantRequestID, receiptNumber: receipt, referenceCode: accountRef || checkoutRequestID || receipt },
          {
            wallet: wallet._id,
            user: wallet.user,
            type: 'Deposit',
            amount: depositAmount,
            currency: 'KES',
            status: 'Completed',
            gateway: 'M-Pesa',
            referenceCode: accountRef || checkoutRequestID || receipt,
            remoteId: checkoutRequestID || merchantRequestID || null,
            receiptNumber: receipt || null,
            description: `M-Pesa STK deposit ${receipt || ''}`,
            metadata: {
              phoneNumber,
              merchantRequestID,
              checkoutRequestID,
            },
          }
        );
      }

      // respond to Safaricom quickly
      return res.status(200).json({ success: true });
    }

    // Non-zero result code — mark as failed if possible
    if (transaction) {
      transaction.status = 'Failed';
      await transaction.save();
    }

    // respond regardless
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error handling STK callback:', err);
    res.status(500).json({ success: false });
  }
};

// B2C result handler
const handleB2CResult = async (req, res) => {
  try {
    const body = req.body;
    console.log('[M-Pesa B2C Result] Received:', JSON.stringify(body));

    // Short-circuit in MOCK mode or when using the local test secret to avoid Mongoose calls
    if (process.env.MOCK_MODE === 'true' || process.env.MPESA_WEBHOOK_SECRET === 'test_secret') {
      return res.status(200).json({ success: true, simulated: true });
    }

    // Common fields: ConversationID, Result (or ResultCode), TransactionID
    const conversationID = body.ConversationID || body.ConversationIDResult || body.ConversationIDResult || (body.Result && body.Result.ConversationID) || null;
    const result = body.Result || body;
    let statusOK = true;

    // Try to find transaction by referenceCode matching ConversationID
    let transaction = null;
    if (conversationID) transaction = await Transaction.findOne({ referenceCode: conversationID });

    // If not found, attempt other heuristics
    if (!transaction && body.TransactionID) {
      transaction = await Transaction.findOne({ referenceCode: body.TransactionID });
    }

    if (transaction) {
      // Determine success from body content
      if (result && (result.ResultCode !== undefined)) {
        statusOK = Number(result.ResultCode) === 0;
      }
      transaction.status = statusOK ? 'Completed' : 'Failed';
      await transaction.save();

      // If completed and wallet exists, ensure wallet recorded
      const wallet = await Wallet.findById(transaction.wallet);
      if (wallet && statusOK && transaction.type === 'Deposit') {
        const exists = wallet.transactions.find((t) => t.reference === transaction.referenceCode && t.status === 'completed');
        if (!exists) {
          wallet.balance = (wallet.balance || 0) + (transaction.amount || 0);
          wallet.transactions.push({ type: 'deposit', amount: transaction.amount || 0, status: 'completed', reference: transaction.referenceCode });
          await wallet.save();
        }
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error handling B2C result:', err);
    res.status(500).json({ success: false });
  }
};

// B2C timeout handler
const handleB2CTimeout = async (req, res) => {
  try {
    console.log('[M-Pesa B2C Timeout] Received:', JSON.stringify(req.body));

    // Short-circuit in MOCK mode or when using the local test secret to avoid Mongoose calls
    if (process.env.MOCK_MODE === 'true' || process.env.MPESA_WEBHOOK_SECRET === 'test_secret') {
      return res.status(200).json({ success: true, simulated: true });
    }

    // TODO: mark related transactions as timed out and retry/alert
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error handling B2C timeout:', err);
    res.status(500).json({ success: false });
  }
};

// expose handlers
module.exports.handleStkCallback = handleStkCallback;
module.exports.handleB2CResult = handleB2CResult;
module.exports.handleB2CTimeout = handleB2CTimeout;