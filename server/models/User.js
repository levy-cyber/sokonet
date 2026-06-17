const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      match: [
        /^(?:\+254|0)?(7|1)\d{8}$/,
        'Please add a valid Kenyan phone number (+254, 07..., or 01...)',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'service_provider', 'rider', 'freelancer', 'admin', 'support'],
      default: 'buyer',
    },
    roles: {
      type: [String],
      enum: ['buyer', 'seller', 'service_provider', 'rider', 'freelancer', 'admin', 'support'],
      default: ['buyer'],
    },
    activeRole: {
      type: String,
      enum: ['buyer', 'seller', 'service_provider', 'rider', 'freelancer', 'admin', 'support'],
      default: 'buyer',
    },
    // Account status
    status: {
      type: String,
      enum: ['active', 'suspended', 'blocked'],
      default: 'active',
    },
    // Super Admin flag
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    // Support account flag
    isSupport: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    otpId: {
      type: String,
    },
    otpStatus: {
      type: String,
      enum: ['active', 'used', 'expired', 'invalidated'],
      default: 'active',
    },
    // Delete account OTP
    deleteOtp: {
      type: String,
    },
    deleteOtpExpiry: {
      type: Date,
    },
    deleteOtpId: {
      type: String,
    },
    deleteOtpStatus: {
      type: String,
      enum: ['active', 'used', 'expired', 'invalidated'],
      default: 'active',
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    // Soft delete
    deletedAt: {
      type: Date,
      default: null,
    },
    deletionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);