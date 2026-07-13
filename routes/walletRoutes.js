const express = require('express');
const {
  getWalletDetails,
  depositFunds,
  withdrawFunds,
  bankTransfer,
  mpesaDeposit,
  mpesaWithdraw,
  getWalletTransactions,
  handleStkCallback,
  handleB2CResult,
  handleB2CTimeout,
} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getWalletDetails);
router.get('/transactions', protect, getWalletTransactions);
router.post('/deposit', protect, depositFunds);
router.post('/withdraw', protect, withdrawFunds);
router.post('/bank-transfer', protect, bankTransfer);
router.post('/mpesa-deposit', protect, mpesaDeposit);
router.post('/mpesa-withdraw', protect, mpesaWithdraw);
// M-Pesa callback endpoints (called by Safaricom)
const { rawJsonParser, verifyHmacSignature } = require('../middleware/webhookVerifier');
router.post('/mpesa-callback', rawJsonParser(), verifyHmacSignature, handleStkCallback);
router.post('/mpesa-b2c-result', rawJsonParser(), verifyHmacSignature, handleB2CResult);
router.post('/mpesa-b2c-timeout', rawJsonParser(), verifyHmacSignature, handleB2CTimeout);
// Simulation endpoint for local testing (requires MPESA_CONSUMER_KEY=dummy_mpesa_consumer_key or ALLOW_MPESA_SIM=true)
router.post('/simulate-stk', protect, async (req, res) => {
  if (process.env.MPESA_CONSUMER_KEY !== 'dummy_mpesa_consumer_key' && process.env.ALLOW_MPESA_SIM !== 'true') {
    return res.status(403).json({ success: false, message: 'Simulation disabled' });
  }
  const { amount = 10, phoneNumber = '0710000000', reference } = req.body;
  const ref = reference || `SIMDEP${Date.now()}`;
  const simulated = {
    Body: {
      stkCallback: {
        MerchantRequestID: `MR_${Math.random().toString(36).substr(2,9)}`,
        CheckoutRequestID: `CH_${Math.random().toString(36).substr(2,9)}`,
        ResultCode: 0,
        ResultDesc: 'The service request is processed successfully.',
        CallbackMetadata: {
          Item: [
            { Name: 'Amount', Value: Number(amount) },
            { Name: 'MpesaReceiptNumber', Value: `RCT${Math.random().toString(36).substr(2,7)}` },
            { Name: 'Balance' , Value: 0 },
            { Name: 'TransactionDate', Value: new Date().toISOString() },
            { Name: 'PhoneNumber', Value: phoneNumber }
          ]
        }
      }
    }
  };

  // Call handler directly
  try {
    await handleStkCallback({ body: simulated }, { status: (code) => ({ json: (obj) => obj }) });
    res.json({ success: true, simulated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;