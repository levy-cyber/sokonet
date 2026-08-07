const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Shop = require('../models/Shop');
const generateToken = require('../utils/generateToken');
const { USE_MOCK, mockHelpers } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const emailService = require('../services/emailService');

// Admin credentials
const ADMIN_PASSWORD = 'Netsoko234';

// Helper function to generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const getWebAuthnRp = () => ({
  id: process.env.WEBAUTHN_RP_ID || 'localhost',
  name: process.env.WEBAUTHN_RP_NAME || 'Netsoko',
});

const getWebAuthnOrigin = () => process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000';

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const isValidEmailFormat = (email) => {
  if (!email || typeof email !== 'string') return false;

  const re = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
  return re.test(email);
};

const base64UrlToBuffer = (base64urlString) => {
  const padding = '='.repeat((4 - (base64urlString.length % 4)) % 4);
  const base64 = (base64urlString + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64');
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, phone, password, roles, activeRole } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    let userExists;

    if (USE_MOCK) {
      userExists = mockHelpers.findUser({ email: normalizedEmail }) || mockHelpers.findUser({ phone });
    } else {
      userExists = await User.findOne({ $or: [{ email: normalizedEmail }, { phone }] });
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
        isEmailVerified: true,
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
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    let user;

    if (USE_MOCK) {
      user = mockHelpers.findUser({ email: normalizedEmail });
      // Mock password check - in real app would be bcrypt.compare
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      user = await User.findOne({ email: normalizedEmail }).select('+password');

      if (user && !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    if (user && user.twoFactorEnabled && Array.isArray(user.webauthnCredentials) && user.webauthnCredentials.length > 0) {
      const authOptions = generateAuthenticationOptions({
        allowCredentials: user.webauthnCredentials.map((cred) => ({
          id: Buffer.from(cred.credentialID, 'base64url'),
          type: 'public-key',
          transports: cred.transports || ['internal'],
        })),
        userVerification: 'required',
      });

      if (!USE_MOCK) {
        user.webauthnCurrentChallenge = authOptions.challenge;
        user.webauthnChallengeType = 'authentication';
        await user.save();
      }

      return res.json({
        success: true,
        twoFactorRequired: true,
        message: 'Biometric verification required.',
        authOptions,
      });
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

// @desc    Get WebAuthn registration options for biometric setup
// @route   POST /api/auth/webauthn/register-options
// @access  Private
const webauthnRegisterOptions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const options = generateRegistrationOptions({
      rpName: getWebAuthnRp().name,
      rpID: getWebAuthnRp().id,
      userID: user._id.toString(),
      userName: user.email,
      timeout: 60000,
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      supportedAlgorithmIDs: [-7, -257],
      excludeCredentials: (user.webauthnCredentials || []).map((cred) => ({
        id: base64UrlToBuffer(cred.credentialID),
        type: 'public-key',
        transports: cred.transports || ['internal'],
      })),
    });

    user.webauthnCurrentChallenge = options.challenge;
    user.webauthnChallengeType = 'registration';
    await user.save();

    res.json({ success: true, options });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Verify WebAuthn registration response and save credential
// @route   POST /api/auth/webauthn/register
// @access  Private
const webauthnRegister = async (req, res) => {
  const { attestationResponse, credentialName } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const expectedChallenge = user.webauthnCurrentChallenge;
    const verification = await verifyRegistrationResponse({
      credential: attestationResponse,
      expectedChallenge,
      expectedOrigin: getWebAuthnOrigin(),
      expectedRPID: getWebAuthnRp().id,
      requireUserVerification: true,
    });

    if (!verification.verified) {
      return res.status(400).json({ success: false, message: 'Biometric registration verification failed.' });
    }

    const { registrationInfo } = verification;

    const credential = {
      credentialID: attestationResponse.id,
      publicKey: Buffer.from(registrationInfo.credentialPublicKey).toString('base64'),
      counter: registrationInfo.counter,
      transports: attestationResponse.transports || [],
      name: credentialName || 'Fingerprint login',
    };

    user.webauthnCredentials = user.webauthnCredentials || [];
    user.webauthnCredentials.push(credential);
    user.twoFactorEnabled = true;
    user.webauthnCurrentChallenge = undefined;
    user.webauthnChallengeType = undefined;
    await user.save();

    res.json({ success: true, message: 'Biometric login enabled successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Verify WebAuthn authentication assertion and complete login
// @route   POST /api/auth/webauthn/authenticate
// @access  Public
const webauthnAuthenticate = async (req, res) => {
  const { email, assertionResponse } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.webauthnCurrentChallenge || user.webauthnChallengeType !== 'authentication') {
      return res.status(400).json({ success: false, message: 'No authentication challenge in progress.' });
    }

    const expectedCredential = (user.webauthnCredentials || []).find(
      (cred) => cred.credentialID === assertionResponse.id,
    );

    if (!expectedCredential) {
      return res.status(404).json({ success: false, message: 'Authenticator not registered.' });
    }

    const verification = await verifyAuthenticationResponse({
      credential: assertionResponse,
      expectedChallenge: user.webauthnCurrentChallenge,
      expectedOrigin: getWebAuthnOrigin(),
      expectedRPID: getWebAuthnRp().id,
      authenticator: {
        counter: expectedCredential.counter,
        credentialPublicKey: Buffer.from(expectedCredential.publicKey, 'base64'),
      },
      requireUserVerification: true,
    });

    if (!verification.verified) {
      return res.status(400).json({ success: false, message: 'Biometric verification failed.' });
    }

    expectedCredential.counter = verification.authenticationInfo.newCounter;
    user.webauthnCurrentChallenge = undefined;
    user.webauthnChallengeType = undefined;
    await user.save();

    return res.json({
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
      twoFactorEnabled: user.twoFactorEnabled || false,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Disable biometric login
// @route   POST /api/auth/webauthn/remove
// @access  Private
const webauthnRemove = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.webauthnCredentials = [];
    user.twoFactorEnabled = false;
    await user.save();

    res.json({ success: true, message: 'Biometric login disabled.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    let user;
    if (USE_MOCK) {
      user = mockHelpers.findUser({ email: normalizedEmail });
    } else {
      user = await User.findOne({ email: normalizedEmail });
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
    const emailSent = await emailService.sendPasswordReset(normalizedEmail, resetLink, user.name);

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
  forgotPassword,
  resetPassword,
  adminLogin,
  webauthnRegisterOptions,
  webauthnRegister,
  webauthnAuthenticate,
  webauthnRemove,
};