const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateDeliveryStatus,
  releaseOrderPayment,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/delivery', protect, updateDeliveryStatus);
router.put('/:id/release', protect, releaseOrderPayment);

module.exports = router;
