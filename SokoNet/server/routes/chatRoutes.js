import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendMessage, getMessages } from '../controllers/chatController.js';

const router = express.Router();
router.route('/').get(protect, getMessages).post(protect, sendMessage);

export default router;
