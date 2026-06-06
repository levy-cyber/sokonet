import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';

const router = express.Router();
router.route('/').get(protect, getNotifications);
router.route('/:id/read').patch(protect, markNotificationRead);

export default router;
