const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String, // ID of the affected resource
    },
    targetType: {
      type: String,
      enum: ['User', 'Product', 'Job', 'Service', 'Order', 'Wallet', 'SupportTicket', 'Message', 'System'],
      default: 'System',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    ip: {
      type: String,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
