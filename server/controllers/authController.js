const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Shop = require('../models/Shop');
const ActivityLog = require('../models/ActivityLog');
const generateToken = require('../utils/generateToken');
const { USE_MOCK, mockHelpers } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Helper to log activity
const logActivity = async (userId, action, targetType = 'System', target = null, metadata = {}, ip = '') => {
  try {
    await ActivityLog.create({ user: userId, action, targetType, target, metadata, ip });
  } catch (e) {
    console.error('Activity log error:', e.message);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, phone, password, roles, activeRole } = req.body;

  try {
    if (USE_MOCK) {
      const userExists = mockHelpers.findUser({ email }) || mockHelpers.findUser({ phone });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email or phone' });
      }
      const userRoles = Array.isArray(roles) && roles.length > 0 ? roles : ['buyer'];
      const userActiveRole = activeRole || userRoles[0] || 'buyer';
      const user = mockHelpers.createUser({
        name, email, phone,
        password: 'hashed_password',
        role: userRoles[0],
        roles: userRoles,
        activeRole: userActiveRole,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        rating: 5.0,
        status: 'active',
      });
      return res.status(201).json({
        success: true,
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone || '', role: user.role,
        roles: user.roles, activeRole: user.activeRole,
        avatar: user.avatar, token: generateToken(user._id),
      });
    }

    // === REGISTRATION LIMITS (max 2 accounts per email, max 2 per phone) ===
    const emailCount = await User.countDocuments({ email: email.toLowerCase(), deletedAt: null });
    if (emailCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'This email address has reached the maximum limit of 2 registered accounts.',
      });
    }

    const phoneCount = await User.countDocuments({ phone, deletedAt: null });
    if (phoneCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'This phone number has reached the maximum limit of 2 registered accounts.',
      });
    }

    const userRoles = Array.isArray(roles) && roles.length > 0 ? roles : ['buyer'];
    const userActiveRole = activeRole || userRoles[0] || 'buyer';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: userRoles[0],
      roles: userRoles,
      activeRole: userActiveRole,
      status: 'active',
    });

    // Create user wallet immediately with 0 balance
    await Wallet.create({
      user: user._id,
      balance: 0,
    });

    // If user is a seller, auto-create a Shop
    if (userRoles.includes('seller')) {
      await Shop.create({
        seller: user._id,
        name: `${name}'s Store`,
        description: `Welcome to my customized storefront on Netsoko!`,
        address: 'Stall 4, Biashara Street, Nairobi',
      });
    }

    await logActivity(user._id, 'User registered', 'User', user._id.toString(), { email, roles: userRoles }, req.ip);

    res.status(201).json({
      success: true,
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone || '', role: user.role,
      roles: user.roles, activeRole: user.activeRole,
      avatar: user.avatar, token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (USE_MOCK) {
      const user = mockHelpers.findUser({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      return res.json({
        success: true,
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone || '', role: user.role,
        roles: user.roles || [user.role],
        activeRole: user.activeRole || user.role,
        avatar: user.avatar, token: generateToken(user._id),
        isSuperAdmin: user.isSuperAdmin || false,
        isSupport: user.isSupport || false,
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check account status
    if (user.deletedAt) {
      return res.status(401).json({ success: false, message: 'This account has been deleted.' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support at support@sokonet.co.ke' });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Your account has been blocked. Contact support at support@sokonet.co.ke' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    await logActivity(user._id, 'User logged in', 'User', user._id.toString(), {}, req.ip);

    res.json({
      success: true,
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone || '', role: user.role,
      roles: user.roles || [user.role],
      activeRole: user.activeRole || user.role,
      avatar: user.avatar, token: generateToken(user._id),
      isSuperAdmin: user.isSuperAdmin || false,
      isSupport: user.isSupport || false,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    let user;
    if (USE_MOCK) {
      user = mockHelpers.findUser({ _id: req.user._id });
    } else {
      user = await User.findById(req.user._id);
    }

    if (user) {
      res.json({
        success: true,
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone || '', role: user.role,
        roles: user.roles || [user.role],
        activeRole: user.activeRole || user.role,
        avatar: user.avatar, rating: user.rating || 5.0,
        status: user.status || 'active',
        isSuperAdmin: user.isSuperAdmin || false,
        isSupport: user.isSupport || false,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send OTP for email verification
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    let user;
    if (USE_MOCK) {
      user = mockHelpers.findUser({ email });
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    if (USE_MOCK) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    } else {
      user.otp = await bcrypt.hash(otp, 10);
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    await emailService.sendOTP(email, otp, user.name);

    res.json({
      success: true,
      message: 'OTP sent successfully. Please check your email.',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    let user;
    if (USE_MOCK) {
      user = mockHelpers.findUser({ email });
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    let isValidOTP;
    if (USE_MOCK) {
      isValidOTP = user.otp === otp;
    } else {
      isValidOTP = await bcrypt.compare(otp, user.otp);
    }

    if (!isValidOTP) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    if (!USE_MOCK) await user.save();

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let user;
    if (USE_MOCK) {
      user = mockHelpers.findUser({ email });
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    const resetToken = generateResetToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);

    if (USE_MOCK) {
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiry = resetExpiry;
    } else {
      user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
      user.resetPasswordExpiry = resetExpiry;
      await user.save();
    }

    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    await emailService.sendPasswordReset(email, resetLink, user.name);

    res.json({
      success: true,
      message: 'Password reset link sent to your email.',
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    let user;
    if (USE_MOCK) {
      user = Object.values(mockHelpers.users || {}).find(u => u.resetPasswordToken === token);
    } else {
      user = await User.findOne({ resetPasswordExpiry: { $gt: new Date() } });
      if (user && user.resetPasswordToken) {
        const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isValidToken) user = null;
      }
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    if (!USE_MOCK) await user.save();

    res.json({ success: true, message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Admin / Super Admin login (by email + password)
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isSuperAdmin && !user.isSupport && user.role !== 'admin' && user.role !== 'support') {
      return res.status(403).json({ success: false, message: 'Access denied. Not an admin or support account.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await logActivity(user._id, 'Admin login', 'System', null, { email }, req.ip);

    res.json({
      success: true,
      token: generateToken(user._id),
      isAdmin: user.isSuperAdmin || user.role === 'admin',
      isSupport: user.isSupport || user.role === 'support',
      isSuperAdmin: user.isSuperAdmin || false,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roles: user.roles || [user.role],
      activeRole: user.activeRole || user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Request account deletion OTP
// @route   POST /api/auth/request-delete
// @access  Private
const requestAccountDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.deleteOtp = await bcrypt.hash(otp, 10);
    user.deleteOtpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    try {
      await emailService.sendOTP(user.email, otp, user.name, 'account deletion');
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
    }

    res.json({
      success: true,
      message: 'A verification code has been sent to your email. Enter it to confirm account deletion.',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Confirm account deletion with OTP
// @route   POST /api/auth/confirm-delete
// @access  Private
const confirmAccountDeletion = async (req, res) => {
  const { otp, reason } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: 'Verification code is required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.deleteOtp || !user.deleteOtpExpiry) {
      return res.status(400).json({ success: false, message: 'No deletion request found. Please request a verification code first.' });
    }

    if (user.deleteOtpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    const isValidOTP = await bcrypt.compare(otp, user.deleteOtp);
    if (!isValidOTP) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    // Soft delete the account
    user.deletedAt = new Date();
    user.deletionReason = reason || 'User requested deletion';
    user.deleteOtp = undefined;
    user.deleteOtpExpiry = undefined;
    user.status = 'blocked';
    await user.save();

    // Log the deletion
    await logActivity(
      user._id,
      'Account deleted by user',
      'User',
      user._id.toString(),
      { reason: reason || 'User requested', email: user.email },
      req.ip
    );

    res.json({ success: true, message: 'Your account has been permanently deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  adminLogin,
  requestAccountDeletion,
  confirmAccountDeletion,
};