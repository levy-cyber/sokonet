const express = require('express');
const router = express.Router();
const {
  getServices, getServiceById, createService, getMyServices, updateService, deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getServices);
router.get('/mine', protect, getMyServices);
router.get('/:id', getServiceById);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
