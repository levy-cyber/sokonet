const express = require('express');
const { registerUser, authUser, getUserProfile, forgotPassword, resetPassword, adminLogin, webauthnRegisterOptions, webauthnRegister, webauthnAuthenticate, webauthnRemove } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.post('/webauthn/register-options', protect, webauthnRegisterOptions);
router.post('/webauthn/register', protect, webauthnRegister);
router.post('/webauthn/authenticate', webauthnAuthenticate);
router.post('/webauthn/remove', protect, webauthnRemove);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/admin-login', adminLogin);

module.exports = router;