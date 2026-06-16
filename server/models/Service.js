const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a service title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a service description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Freelancer', 'Rider', 'Technician', 'Consultant', 'Designer', 'Developer', 'Writer', 'Marketer', 'Other'],
    },
    pricing: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be positive'],
    },
    pricingType: {
      type: String,
      enum: ['hourly', 'fixed', 'daily', 'negotiable'],
      default: 'fixed',
    },
    currency: {
      type: String,
      default: 'KES',
    },
    location: {
      type: String,
      default: 'Remote',
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available',
    },
    images: [
      {
        type: String,
      },
    ],
    contactPhone: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    skills: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
