import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createProduct, getProducts, getSellerProducts } from '../controllers/productController.js';

const router = express.Router();
router.route('/').get(getProducts).post(protect, createProduct);
router.route('/seller').get(protect, getSellerProducts);

export default router;
