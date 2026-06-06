const express = require('express');
const {
  getWalletDetails,
  triggerMpesaDeposit,
  mockWalletDeposit,
  handleMpesaCallback,
  triggerStripeDeposit,
  triggerWithdrawal,
} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getWalletDetails);
router.post('/deposit/mpesa', protect, triggerMpesaDeposit);
router.post('/deposit/mock', protect, mockWalletDeposit);
router.post('/mpesa-callback', handleMpesaCallback);
router.post('/deposit/stripe', protect, triggerStripeDeposit);
router.post('/withdraw', protect, triggerWithdrawal);

module.exports = router;
