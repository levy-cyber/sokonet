const express = require('express');
const {
  createRideRequest,
  getMyRideRequests,
  getPendingRideRequests,
  acceptRideRequest,
  updateRideStatus,
  getRideRequestById
} = require('../controllers/rideRequestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createRideRequest);
router.get('/my-rides', protect, getMyRideRequests);
router.get('/pending', protect, getPendingRideRequests);
router.put('/:id/accept', protect, acceptRideRequest);
router.put('/:id/status', protect, updateRideStatus);
router.get('/:id', protect, getRideRequestById);

module.exports = router;
