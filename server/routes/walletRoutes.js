const express = require('express');
const {
  getWalletDetails,
  depositFunds,
  withdrawFunds,
  bankTransfer,
  mpesaDeposit,
  mpesaWithdraw,
} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getWalletDetails);
router.post('/deposit', protect, depositFunds);
router.post('/withdraw', protect, withdrawFunds);
router.post('/bank-transfer', protect, bankTransfer);
router.post('/mpesa-deposit', protect, mpesaDeposit);
router.post('/mpesa-withdraw', protect, mpesaWithdraw);

module.exports = router;