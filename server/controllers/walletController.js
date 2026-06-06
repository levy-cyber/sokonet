const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const mpesaService = require('../services/mpesaService');
const stripeService = require('../services/stripeService');
const notificationService = require('../services/notificationService');

// @desc    Get user wallet details
// @route   GET /api/wallet
// @access  Private
const getWalletDetails = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id, balance: 0.0 });
    }

    const transactions = await Transaction.find({ wallet: wallet._id }).sort({ createdAt: -1 });

    res.json({ success: true, balance: wallet.balance, currency: wallet.currency, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Trigger M-Pesa STK Push Deposit
// @route   POST /api/wallet/deposit/mpesa
// @access  Private
const triggerMpesaDeposit = async (req, res) => {
  const { amount, phone } = req.body;

  if (!amount || !phone) {
    return res.status(400).json({ success: false, message: 'Amount and phone number are required' });
  }

  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    const referenceCode = `DEP_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create pending transaction in ledger
    const transaction = await Transaction.create({
      wallet: wallet._id,
      user: req.user._id,
      type: 'Deposit',
      amount: Number(amount),
      gateway: 'M-Pesa',
      status: 'Pending',
      referenceCode,
      description: 'M-Pesa STK Push deposit',
    });

    const response = await mpesaService.triggerStkPush(phone, amount, referenceCode, 'SokoNet Deposit');

    // If sandbox / mock mode
    if (response.isMock) {
      // Simulate successful webhook callback immediately for testing convenience
      setTimeout(async () => {
        const checkWallet = await Wallet.findById(wallet._id);
        checkWallet.balance += Number(amount);
        await checkWallet.save();

        transaction.status = 'Completed';
        await transaction.save();

        await notificationService.createNotification(
          req.user._id,
          'M-Pesa Deposit Completed',
          `KES ${amount} has been successfully credited to your wallet via M-Pesa.`,
          'Wallet'
        );
      }, 3000);

      return res.json({
        success: true,
        message: 'STK Push sent. Processing simulation...',
        checkoutRequestId: response.CheckoutRequestID,
      });
    }

    res.json({
      success: true,
      message: 'STK Push initiated successfully',
      checkoutRequestId: response.CheckoutRequestID,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Simulate instant credit (Sandbox Helper)
// @route   POST /api/wallet/deposit/mock
// @access  Private
const mockWalletDeposit = async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Specify a valid amount' });
  }

  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    wallet.balance += Number(amount);
    await wallet.save();

    await Transaction.create({
      wallet: wallet._id,
      user: req.user._id,
      type: 'Deposit',
      amount: Number(amount),
      gateway: 'Wallet_Internal',
      status: 'Completed',
      referenceCode: `MCK_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      description: 'Sandbox simulator instant balance load',
    });

    await notificationService.createNotification(
      req.user._id,
      'Sandbox Credit Received',
      `Simulated load of KES ${amount} completed.`,
      'Wallet'
    );

    res.json({ success: true, balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Safaricom Daraja API Webhook Callback Handler
// @route   POST /api/wallet/mpesa-callback
// @access  Public
const handleMpesaCallback = async (req, res) => {
  const { Body } = req.body;

  try {
    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ success: false, message: 'Invalid callback format' });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

    console.log(`[M-Pesa Webhook Received] ResultCode: ${ResultCode} | ResultDesc: ${ResultDesc}`);

    // Locate pending transaction
    // Safaricom doesn't return account reference directly inside top-level callback sometimes, so we locate by tracking requests or checkoutRequestId in production
    // For this boilerplate we search for transactions where referenceCode exists
    if (ResultCode === 0) {
      // Success. Extract details
      const items = CallbackMetadata.Item;
      const amountItem = items.find(i => i.Name === 'Amount');
      const mpesaRef = items.find(i => i.Name === 'MpesaReceiptNumber');
      const phoneItem = items.find(i => i.Name === 'PhoneNumber');

      const amount = amountItem ? amountItem.Value : 0;
      const receipt = mpesaRef ? mpesaRef.Value : '';

      // Find first pending M-Pesa transaction for that amount and update
      const transaction = await Transaction.findOne({
        gateway: 'M-Pesa',
        status: 'Pending',
        amount: Number(amount),
      });

      if (transaction) {
        transaction.status = 'Completed';
        transaction.referenceCode = receipt;
        await transaction.save();

        const wallet = await Wallet.findById(transaction.wallet);
        wallet.balance += Number(amount);
        await wallet.save();

        await notificationService.createNotification(
          transaction.user,
          'M-Pesa Deposit Confirmed',
          `KES ${amount} credited. Ref: ${receipt}`,
          'Wallet'
        );
      }
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('M-Pesa Callback processing error:', error.message);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Internal Server Error' });
  }
};

// @desc    Trigger Credit/Debit Card Deposit (Stripe Client Secret retrieval)
// @route   POST /api/wallet/deposit/stripe
// @access  Private
const triggerStripeDeposit = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }

  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    const metadata = { userId: req.user._id.toString(), walletId: wallet._id.toString() };

    const paymentIntent = await stripeService.createPaymentIntent(amount, 'kes', metadata);

    // Auto complete simulation
    setTimeout(async () => {
      wallet.balance += Number(amount);
      await wallet.save();

      await Transaction.create({
        wallet: wallet._id,
        user: req.user._id,
        type: 'Deposit',
        amount: Number(amount),
        gateway: 'Stripe',
        status: 'Completed',
        referenceCode: paymentIntent.id,
        description: 'Stripe Card Payment Deposit',
      });

      await notificationService.createNotification(
        req.user._id,
        'Card Deposit Succeeded',
        `KES ${amount} has been credited to your wallet via Stripe card.`,
        'Wallet'
      );
    }, 2000);

    res.json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      id: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Withdraw wallet funds to M-Pesa phone number
// @route   POST /api/wallet/withdraw
// @access  Private
const triggerWithdrawal = async (req, res) => {
  const { amount, phone } = req.body;

  if (!amount || !phone) {
    return res.status(400).json({ success: false, message: 'Amount and phone number are required' });
  }

  try {
    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet || wallet.balance < Number(amount)) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance for withdrawal' });
    }

    // Deduct balance
    wallet.balance -= Number(amount);
    await wallet.save();

    const payoutCode = `WTH_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create withdrawal transaction
    await Transaction.create({
      wallet: wallet._id,
      user: req.user._id,
      type: 'Withdrawal',
      amount: Number(amount),
      gateway: 'M-Pesa',
      status: 'Completed',
      referenceCode: payoutCode,
      description: `Withdrawal payout to M-Pesa mobile line ${phone}`,
    });

    // Call M-Pesa B2C service
    await mpesaService.triggerPayout(phone, amount, 'SokoNet Payout');

    await notificationService.createNotification(
      req.user._id,
      'Withdrawal Processed',
      `KES ${amount} has been sent to your M-Pesa number ${phone}. Payout code: ${payoutCode}`,
      'Wallet'
    );

    res.json({ success: true, balance: wallet.balance, message: 'Withdrawal completed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getWalletDetails,
  triggerMpesaDeposit,
  mockWalletDeposit,
  handleMpesaCallback,
  triggerStripeDeposit,
  triggerWithdrawal,
};
