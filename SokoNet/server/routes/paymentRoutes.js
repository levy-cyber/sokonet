import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { initiatePayment, confirmPayment } from '../controllers/paymentController.js';

const router = express.Router();

// public for initiating (mobile/web) but protect for confirm
router.post('/initiate', initiatePayment);
router.post('/confirm', protect, confirmPayment);

export default router;
