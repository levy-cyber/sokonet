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
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_Netsoko_2026_prod');

      // Get user from the token
      let user;
      if (USE_MOCK) {
        user = mockHelpers.findUser({ _id: decoded.id });
        if (user) {
          // Remove password from mock user
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

module.exports = { protect };