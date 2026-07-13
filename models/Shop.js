const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a shop name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a shop description'],
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=150&h=150',
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&h=300',
    },
    address: {
      type: String,
      required: [true, 'Please specify shop physical address or market stall'],
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

module.exports = mongoose.model('Shop', shopSchema);
