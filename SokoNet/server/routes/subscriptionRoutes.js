import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { createSubscription, getSubscription, getAllSubscriptions } from '../controllers/subscriptionController.js';

const router = express.Router();
router.route('/').get(protect, getSubscription).post(protect, createSubscription);
router.route('/all').get(protect, admin, getAllSubscriptions);

export default router;
