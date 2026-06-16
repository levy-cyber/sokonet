const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Product = require('../models/Product');
const Job = require('../models/Job');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

// @desc    Get full dashboard summary for authenticated user
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run all queries in parallel
    const [
      wallet,
      myProducts,
      myServices,
      myJobs,
      myApplications,
      receivedMessages,
      notifications,
      user,
    ] = await Promise.all([
      Wallet.findOne({ user: userId }),
      Product.countDocuments({ seller: userId }),
      Service.countDocuments({ provider: userId }),
      Job.countDocuments({ employer: userId }),
      Job.countDocuments({ 'applications.applicant': userId }),
      Message.countDocuments({ receiver: userId, isRead: false }),
      Notification.countDocuments({ user: userId, isRead: false }),
      User.findById(userId).select('-password'),
    ]);

    // Recent transactions from wallet
    const recentTransactions = wallet?.transactions?.slice(-10).reverse() || [];

    // Recent products
    const recentProducts = await Product.find({ seller: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price status createdAt images');

    // Recent jobs (as employer)
    const recentJobs = await Job.find({ employer: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status applications createdAt budget');

    // Recent notifications
    const recentNotifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        walletBalance: wallet?.balance || 0,
        currency: wallet?.currency || 'KES',
        recentTransactions,
        productsPosted: myProducts,
        servicesListed: myServices,
        jobsPosted: myJobs,
        jobApplicationsSubmitted: myApplications,
        unreadMessages: receivedMessages,
        unreadNotifications: notifications,
        accountStatus: user?.status || 'active',
        recentProducts,
        recentJobs,
        recentNotifications,
        user: {
          _id: user?._id,
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          avatar: user?.avatar,
          role: user?.role,
          roles: user?.roles,
          activeRole: user?.activeRole,
          rating: user?.rating,
          isEmailVerified: user?.isEmailVerified,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get live wallet balance
// @route   GET /api/dashboard/wallet-balance
// @access  Private
const getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    res.json({
      success: true,
      balance: wallet?.balance || 0,
      currency: wallet?.currency || 'KES',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getDashboardSummary, getWalletBalance };
