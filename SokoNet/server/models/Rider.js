import mongoose from 'mongoose';

const riderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    vehicle: {
      type: String,
      default: 'Motorbike',
    },
    status: {
      type: String,
      enum: ['available', 'on_delivery', 'offline'],
      default: 'available',
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [36.8219, -1.2921],
      },
    },
    earnings: {
      type: Number,
      default: 0,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

riderSchema.index({ currentLocation: '2dsphere' });
const Rider = mongoose.model('Rider', riderSchema);
export default Rider;
