const express = require('express');
const {
  getServices,
  getMyServices,
  createService,
  getBookings,
  createBooking,
  updateBookingStatus,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getServices);
router.get('/mine', protect, getMyServices);
router.post('/', protect, createService);
router.get('/bookings', protect, getBookings);
router.post('/:id/book', protect, createBooking);
router.put('/bookings/:bookingId', protect, updateBookingStatus);

module.exports = router;
