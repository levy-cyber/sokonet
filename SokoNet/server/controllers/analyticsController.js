import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Subscription from '../models/Subscription.js';
import Wallet from '../models/Wallet.js';
import Escrow from '../models/Escrow.js';
import Rider from '../models/Rider.js';
import Transaction from '../models/Transaction.js';

export const getAnalytics = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSellers = await User.countDocuments({ role: 'seller' });
  const totalRiders = await User.countDocuments({ role: 'rider' });
  const totalOrders = await Order.countDocuments();
  const revenue = await Transaction.aggregate([
    { $match: { type: { $in: ['payment', 'withdraw', 'deposit'] }, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const openEscrow = await Escrow.countDocuments({ status: 'held' });
  const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
  const orderStatusSummary = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    counts: {
      users: totalUsers,
      sellers: totalSellers,
      riders: totalRiders,
      orders: totalOrders,
      activeSubscriptions,
      openEscrow,
    },
    revenue: revenue[0]?.total || 0,
    orderStatusSummary,
  });
};
