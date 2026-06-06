import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createShop, getShops, getShopProducts } from '../controllers/shopController.js';

const router = express.Router();
router.route('/').get(getShops).post(protect, createShop);
router.route('/:shopId/products').get(getShopProducts);

export default router;
