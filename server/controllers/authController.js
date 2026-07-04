const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Shop = require('../models/Shop');
const generateToken = require('../utils/generateToken');
const { USE_MOCK, mockHelpers } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// Admin credentials
const ADMIN_PASSWORD = 'Netsoko234';

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, phone, password, roles, activeRole } = req.body;

  try {
    let userExists;

    if (USE_MOCK) {
      userExists = mockHelpers.findUser({ email }) || mockHelpers.findUser({ phone });
    } else {
      userExists = await User.findOne({ $or: [{ email }, { phone }] });
    }

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email or phone' });
    }

    // Handle multiple roles
    const userRoles = Array.isArray(roles) && roles.length > 0 ? roles : ['buyer'];
    const userActiveRole = activeRole || userRoles[0] || 'buyer';

    let user;
    if (USE_MOCK) {
      // Simple password check for mock (in real app would be bcrypt)
      user = mockHelpers.createUser({
        name,
        email,
        phone,
        password: 'hashed_password', // Mock hashed password
        role: userRoles[0], // Primary role for backward compatibility
        roles: userRoles,
        activeRole: userActiveRole,
        isEmailVerified: false,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        rating: 5.0
      });
    } else {
      user = await User.create({
        name,
        email,
        phone,
        password,
        role: userRoles[0], // Primary role for backward compatibility
        roles: userRoles,
        activeRole: userActiveRole,
        isEmailVerified: false,
      });

      // Create user wallet immediately
      await Wallet.create({
        user: user._id,
        balance: 1000.0, // Give them 1000 KES sign up bonus to ease testing!
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
    }

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        roles: user.roles,
        activeRole: user.activeRole,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified || false,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
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
    let user;

    if (USE_MOCK) {
      user = mockHelpers.findUser({ email });
      // Mock password check - in real app would be bcrypt.compare
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      user = await User.findOne({ email }).select('+password');

      if (user && !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    if (user && !user.isEmailVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
    }

    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        roles: user.roles || [user.role],
        activeRole: user.activeRole || user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified || false,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
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
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        roles: user.roles || [user.role],
        activeRole: user.activeRole || user.role,
        avatar: user.avatar,
        rating: user.rating || 5.0,
        isEmailVerified: user.isEmailVerified || false,
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
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (USE_MOCK) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    } else {
      user.otp = await bcrypt.hash(otp, 10);
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    // Send OTP email
    await emailService.sendOTP(email, otp, user.name);

    res.json({
      success: true,
      message: 'OTP sent successfully. Please check your email.',
      // For development, return OTP in response (remove in production)
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
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
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Check if OTP is expired
    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired or is invalid. Please request a new one.' });
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

    // Mark email as verified
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    if (!USE_MOCK) {
      await user.save();
    }

    res.json({
      success: true,
      message: 'Email verified successfully!',
    });
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
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    if (USE_MOCK) {
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiry = resetExpiry;
    } else {
      user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
      user.resetPasswordExpiry = resetExpiry;
      await user.save();
    }

    // Create reset link
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Send password reset email
    const emailSent = await emailService.sendPasswordReset(email, resetLink, user.name);

    res.json({
      success: true,
      message: emailSent ? 'Password reset link sent to your email.' : 'Password reset link generated successfully. Check the server logs for the link.',
      resetLink: resetLink,
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
      // In mock mode, find user by token (simplified)
      user = Object.values(mockHelpers.users).find(u => u.resetPasswordToken === token);
    } else {
      // In production, we need to find user and verify token hash
      user = await User.findOne({
        resetPasswordExpiry: { $gt: new Date() }
      });

      if (user && user.resetPasswordToken) {
        const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isValidToken) {
          user = null;
        }
      }
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (user.resetPasswordExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new one.' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    if (!USE_MOCK) {
      await user.save();
    }

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Invalid admin password' });
  }

  // Generate admin token
  const token = generateToken('admin');

  res.json({
    success: true,
    token,
    isAdmin: true,
  });
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
};