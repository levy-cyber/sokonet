import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();
router.route('/').get(protect, admin, getAnalytics);

export default router;
