const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Shop = require('../models/Shop');
const generateToken = require('../utils/generateToken');
const { USE_MOCK, mockHelpers } = require('../config/db');
const bcrypt = require('bcryptjs');

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
          description: `Welcome to my customized storefront on SokoNet!`,
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
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
};