const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Shop = require('../models/Shop');
const ActivityLog = require('../models/ActivityLog');
const generateToken = require('../utils/generateToken');
const { USE_MOCK, mockHelpers } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// Helper function to generate OTP (more secure)
const generateOTP = () => {
  // Generate cryptographically secure random OTP
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  return otp;
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
        accountStatus: 'pending',
        hasLoggedIn: false,
      });
      return res.status(201).json({
        success: true,
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone || '', role: user.role,
        roles: user.roles, activeRole: user.activeRole,
        avatar: user.avatar, token: generateToken(user._id),
      });
    }

    // === REGISTRATION LIMITS (max 2 ACTIVE accounts per email, max 2 per phone) ===
    // Only count accounts that are fully activated (accountStatus: 'active' and hasLoggedIn: true)
    const emailCount = await User.countDocuments({
      email: email.toLowerCase(),
      deletedAt: null,
      accountStatus: 'active',
      hasLoggedIn: true
    });
    if (emailCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'This email address has reached the maximum limit of 2 active accounts.',
      });
    }

    const phoneCount = await User.countDocuments({
      phone,
      deletedAt: null,
      accountStatus: 'active',
      hasLoggedIn: true
    });
    if (phoneCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'This phone number has reached the maximum limit of 2 active accounts.',
      });
    }

    // Check for existing user with same email (any status) to prevent MongoDB duplicate key error
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please use a different email or login to your existing account.',
      });
    }

    // Check for existing user with same phone (any status) to prevent MongoDB duplicate key error
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists. Please use a different phone number or login to your existing account.',
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
      accountStatus: 'pending', // Start as pending until verification and first login
      hasLoggedIn: false,
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

    await logActivity(user._id, 'User registered (pending activation)', 'User', user._id.toString(), { email, roles: userRoles }, req.ip);

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

    // Mark account as active on first successful login
    if (!user.hasLoggedIn) {
      user.hasLoggedIn = true;
      user.accountStatus = 'active';
      await user.save();
      await logActivity(user._id, 'Account activated (first login)', 'User', user._id.toString(), { email }, req.ip);
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
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const otpId = crypto.randomBytes(16).toString('hex'); // Unique ID for this OTP

    if (USE_MOCK) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.otpId = otpId;
      user.otpStatus = 'active';
    } else {
      user.otp = await bcrypt.hash(otp, 10);
      user.otpExpiry = otpExpiry;
      user.otpId = otpId;
      user.otpStatus = 'active';
      await user.save();
    }

    // Log OTP generation
    await logActivity(user._id, 'OTP generated', 'OTP', otpId, { email, expiry: otpExpiry }, req.ip);

    // Send OTP email
    const emailResult = await emailService.sendOTP(email, otp, user.name, 'email verification');

    res.json({
      success: true,
      message: 'OTP sent successfully. Please check your email.',
      otpId: otpId,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      emailDelivery: emailResult.success,
      deliveryTime: emailResult.deliveryTime,
    });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { email, otp, otpId } = req.body;
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

    // Check if OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    }

    // Check OTP status
    if (user.otpStatus === 'used') {
      return res.status(400).json({ success: false, message: 'This OTP has already been used. Please request a new one.' });
    }

    if (user.otpStatus === 'invalidated') {
      return res.status(400).json({ success: false, message: 'This OTP has been invalidated. Please request a new one.' });
    }

    // Check OTP expiry
    if (user.otpExpiry < new Date()) {
      user.otpStatus = 'expired';
      if (!USE_MOCK) await user.save();
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Check OTP ID if provided (for additional security)
    if (otpId && user.otpId && user.otpId !== otpId) {
      return res.status(400).json({ success: false, message: 'Invalid OTP ID. Please request a new one.' });
    }

    let isValidOTP;
    if (USE_MOCK) {
      isValidOTP = user.otp === otp;
    } else {
      isValidOTP = await bcrypt.compare(otp, user.otp);
    }

    if (!isValidOTP) {
      await logActivity(user._id, 'OTP verification failed', 'OTP', user.otpId, { email, reason: 'Invalid OTP' }, req.ip);
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // Mark OTP as used
    user.isEmailVerified = true;
    user.otpStatus = 'used';
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpId = undefined;
    // Update account status to 'verified' after successful OTP verification
    user.accountStatus = 'verified';
    if (!USE_MOCK) await user.save();

    // Log successful verification
    await logActivity(user._id, 'OTP verified successfully', 'OTP', user.otpId, { email }, req.ip);

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    console.error('OTP verification error:', error);
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
    const otpId = crypto.randomBytes(16).toString('hex');

    user.deleteOtp = await bcrypt.hash(otp, 10);
    user.deleteOtpExpiry = otpExpiry;
    user.deleteOtpId = otpId;
    user.deleteOtpStatus = 'active';
    await user.save();

    // Log OTP generation
    await logActivity(user._id, 'Account deletion OTP generated', 'OTP', otpId, { email: user.email, expiry: otpExpiry }, req.ip);

    // Send OTP via email
    const emailResult = await emailService.sendOTP(user.email, otp, user.name, 'account deletion');

    res.json({
      success: true,
      message: 'A verification code has been sent to your email. Enter it to confirm account deletion.',
      otpId: otpId,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      emailDelivery: emailResult.success,
      deliveryTime: emailResult.deliveryTime,
    });
  } catch (error) {
    console.error('Account deletion OTP request error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Confirm account deletion with OTP
// @route   POST /api/auth/confirm-delete
// @access  Private
const confirmAccountDeletion = async (req, res) => {
  const { otp, otpId, reason } = req.body;

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

    // Check OTP status
    if (user.deleteOtpStatus === 'used') {
      return res.status(400).json({ success: false, message: 'This verification code has already been used. Please request a new one.' });
    }

    if (user.deleteOtpStatus === 'invalidated') {
      return res.status(400).json({ success: false, message: 'This verification code has been invalidated. Please request a new one.' });
    }

    if (user.deleteOtpExpiry < new Date()) {
      user.deleteOtpStatus = 'expired';
      await user.save();
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    // Check OTP ID if provided
    if (otpId && user.deleteOtpId && user.deleteOtpId !== otpId) {
      return res.status(400).json({ success: false, message: 'Invalid verification code ID. Please request a new one.' });
    }

    const isValidOTP = await bcrypt.compare(otp, user.deleteOtp);
    if (!isValidOTP) {
      await logActivity(user._id, 'Account deletion OTP verification failed', 'OTP', user.deleteOtpId, { reason: 'Invalid OTP' }, req.ip);
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    // Soft delete the account
    user.deletedAt = new Date();
    user.deletionReason = reason || 'User requested deletion';
    user.deleteOtp = undefined;
    user.deleteOtpExpiry = undefined;
    user.deleteOtpId = undefined;
    user.deleteOtpStatus = 'used';
    user.status = 'blocked';
    user.accountStatus = 'deleted'; // Mark as deleted to free up phone/email for new registrations
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
    console.error('Account deletion confirmation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Resend OTP (invalidates previous OTP)
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
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

    // Invalidate previous OTP if exists
    if (user.otp && user.otpId) {
      user.otpStatus = 'invalidated';
      await logActivity(user._id, 'OTP invalidated (resend)', 'OTP', user.otpId, { email }, req.ip);
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const otpId = crypto.randomBytes(16).toString('hex');

    if (USE_MOCK) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.otpId = otpId;
      user.otpStatus = 'active';
    } else {
      user.otp = await bcrypt.hash(otp, 10);
      user.otpExpiry = otpExpiry;
      user.otpId = otpId;
      user.otpStatus = 'active';
      await user.save();
    }

    // Log new OTP generation
    await logActivity(user._id, 'OTP regenerated (resend)', 'OTP', otpId, { email, expiry: otpExpiry }, req.ip);

    // Send new OTP email
    const emailResult = await emailService.sendOTP(email, otp, user.name, 'email verification');

    res.json({
      success: true,
      message: 'New OTP sent successfully. Previous OTP has been invalidated.',
      otpId: otpId,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      emailDelivery: emailResult.success,
      deliveryTime: emailResult.deliveryTime,
    });
  } catch (error) {
    console.error('OTP resend error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Cleanup abandoned registrations
// @route   POST /api/auth/cleanup-abandoned
// @access  Private (Admin only)
const cleanupAbandonedRegistrations = async (req, res) => {
  try {
    // Clean up registrations that have been pending for more than 24 hours
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    const result = await User.updateMany(
      {
        accountStatus: 'pending',
        hasLoggedIn: false,
        createdAt: { $lt: cutoffDate }
      },
      {
        accountStatus: 'inactive',
        status: 'suspended'
      }
    );

    await logActivity(
      req.user._id,
      'Cleanup abandoned registrations',
      'User',
      req.user._id.toString(),
      { count: result.modifiedCount, cutoffDate },
      req.ip
    );

    res.json({
      success: true,
      message: `Cleaned up ${result.modifiedCount} abandoned registrations`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  sendOTP,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  adminLogin,
  requestAccountDeletion,
  confirmAccountDeletion,
  cleanupAbandonedRegistrations,
};