const express = require('express');
const { getShops, getShopById, getMyShop, getMyProducts, updateMyShop } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getShops);
router.get('/mine', protect, getMyShop);
router.get('/mine/products', protect, getMyProducts);
router.get('/my', protect, getMyShop);
router.get('/my/products', protect, getMyProducts);
router.put('/mine', protect, updateMyShop);
router.get('/:id', getShopById);

module.exports = router;
