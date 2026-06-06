import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile, getUsers, getDashboardAnalytics } from '../controllers/userController.js';

const router = express.Router();

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.route('/').get(protect, admin, getUsers);
router.route('/analytics').get(protect, admin, getDashboardAnalytics);

export default router;
