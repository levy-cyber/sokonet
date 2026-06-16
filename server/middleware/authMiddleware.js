const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { USE_MOCK, mockHelpers } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_Netsoko_2026_prod');

      let user;
      if (USE_MOCK) {
        user = mockHelpers.findUser({ _id: decoded.id });
        if (user) {
          const { password, ...userWithoutPassword } = user;
          req.user = userWithoutPassword;
        }
      } else {
        user = await User.findById(decoded.id).select('-password');
        req.user = user;
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // Check if account is suspended or blocked
      if (req.user.status === 'suspended') {
        return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
      }
      if (req.user.status === 'blocked') {
        return res.status(403).json({ success: false, message: 'Your account has been blocked. Please contact support.' });
      }

      // Check if account is soft-deleted
      if (req.user.deletedAt) {
        return res.status(403).json({ success: false, message: 'This account has been deleted.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Super Admin only middleware
const adminOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  if (req.user.isSuperAdmin || req.user.role === 'admin' || req.user.activeRole === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
};

// Support or Admin middleware
const supportOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  if (
    req.user.isSuperAdmin ||
    req.user.isSupport ||
    req.user.role === 'admin' ||
    req.user.role === 'support' ||
    req.user.activeRole === 'admin' ||
    req.user.activeRole === 'support'
  ) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Support privileges required.' });
};

module.exports = { protect, adminOnly, supportOnly };