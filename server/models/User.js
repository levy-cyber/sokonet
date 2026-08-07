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
      unique: true,
      match: [
        /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
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
      enum: ['buyer', 'seller', 'service_provider', 'rider', 'freelancer', 'admin'],
      default: 'buyer',
    },
    roles: {
      type: [String],
      enum: ['buyer', 'seller', 'service_provider', 'rider', 'freelancer', 'admin'],
      default: ['buyer'],
    },
    activeRole: {
      type: String,
      enum: ['buyer', 'seller', 'service_provider', 'rider', 'freelancer', 'admin'],
      default: 'buyer',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isSupport: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    webauthnCredentials: [
      {
        credentialID: {
          type: String,
        },
        publicKey: {
          type: String,
        },
        counter: {
          type: Number,
          default: 0,
        },
        transports: {
          type: [String],
          default: [],
        },
        name: {
          type: String,
          default: '',
        },
      },
    ],
    webauthnCurrentChallenge: {
      type: String,
    },
    webauthnChallengeType: {
      type: String,
      enum: ['registration', 'authentication'],
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
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