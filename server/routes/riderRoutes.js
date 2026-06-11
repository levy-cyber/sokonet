const express = require('express');
const {
  registerRider,
  updateRiderLocation,
  toggleRiderAvailability,
  getActiveRiders,
  getRiderProfile,
} = require('../controllers/riderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/register', protect, registerRider);
router.put('/location', protect, authorize('rider', 'admin'), updateRiderLocation);
router.put('/availability', protect, authorize('rider', 'admin'), toggleRiderAvailability);
router.get('/active', protect, getActiveRiders);
router.get('/profile', protect, getRiderProfile);

module.exports = router;
