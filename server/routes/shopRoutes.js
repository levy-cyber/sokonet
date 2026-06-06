const express = require('express');
const { getShops, getShopById, getMyShop, updateMyShop } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getShops);
router.get('/mine', protect, getMyShop);
router.put('/mine', protect, updateMyShop);
router.get('/:id', getShopById);

module.exports = router;
