const express = require('express');
const {
  getWalletDetails,
  depositFunds,
  withdrawFunds,
} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getWalletDetails);
router.post('/deposit', protect, depositFunds);
router.post('/withdraw', protect, withdrawFunds);

module.exports = router;