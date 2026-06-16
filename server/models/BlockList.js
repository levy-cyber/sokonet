const mongoose = require('mongoose');

const blockListSchema = new mongoose.Schema(
  {
    blocker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blocked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only block another user once
blockListSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

module.exports = mongoose.model('BlockList', blockListSchema);
