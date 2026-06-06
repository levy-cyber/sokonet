import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder, getOrders, updateOrderStatus, getOrderById } from '../controllers/orderController.js';

const router = express.Router();
router.route('/').get(protect, getOrders).post(protect, createOrder);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').patch(protect, updateOrderStatus);

export default router;
