const express = require('express');
const router = express.Router();
const {
  registerUser, authUser, getUserProfile, sendOTP, verifyOTP, resendOTP,
  forgotPassword, resetPassword, adminLogin,
  requestAccountDeletion, confirmAccountDeletion, cleanupAbandonedRegistrations,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/admin-login', adminLogin);
router.post('/request-delete', protect, requestAccountDeletion);
router.post('/confirm-delete', protect, confirmAccountDeletion);
router.post('/cleanup-abandoned', protect, adminOnly, cleanupAbandonedRegistrations);

module.exports = router;