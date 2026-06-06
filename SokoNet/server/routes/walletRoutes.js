import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWallet, getTransactions, depositFunds, withdrawFunds } from '../controllers/walletController.js';

const router = express.Router();
router.route('/').get(protect, getWallet);
router.route('/transactions').get(protect, getTransactions);
router.route('/deposit').post(protect, depositFunds);
router.route('/withdraw').post(protect, withdrawFunds);

export default router;
