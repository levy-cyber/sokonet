const express = require('express');
const router = express.Router();
const { getDashboardSummary, getWalletBalance } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getDashboardSummary);
router.get('/wallet-balance', protect, getWalletBalance);

module.exports = router;
