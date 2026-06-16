const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/mine', protect, getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
