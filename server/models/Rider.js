const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Please specify vehicle type'],
      enum: ['Bicycle', 'Motorcycle', 'Car', 'Truck'],
    },
    licensePlate: {
      type: String,
      required: [true, 'Please specify license plate number'],
      unique: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      latitude: {
        type: Number,
        default: -1.2921, // Nairobi default
      },
      longitude: {
        type: Number,
        default: 36.8219, // Nairobi default
      },
      address: {
        type: String,
        default: 'Nairobi, Kenya',
      }
    },
    earnings: {
      type: Number,
      default: 0.0,
    },
    deliveriesCompleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rider', riderSchema);
