const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Product = require('../models/Product');
const Job = require('../models/Job');
const Service = require('../models/Service');
const Order = require('../models/Order');
const ActivityLog = require('../models/ActivityLog');
const PlatformSettings = require('../models/PlatformSettings');
const CompanyTill = require('../models/CompanyTill');
const bcrypt = require('bcryptjs');

// Helper to log activity
const logActivity = async (adminId, action, targetType, target, metadata = {}) => {
  try {
    await ActivityLog.create({ user: adminId, action, targetType, target, metadata, severity: 'info' });
  } catch (e) { console.error('Log error:', e.message); }
};

// @desc    Get all users with wallet details
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;
    let query = { deletedAt: null };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);

    // Attach wallet data
    const usersWithWallets = await Promise.all(
      users.map(async (u) => {
        const wallet = await Wallet.findOne({ user: u._id });
        return {
          ...u.toObject(),
          wallet: wallet ? { balance: wallet.balance, currency: wallet.currency } : { balance: 0, currency: 'KES' },
        };
      })
    );

    res.json({ success: true, count: usersWithWallets.length, total, data: usersWithWallets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Admin
const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, totalProducts, totalJobs, totalOrders, totalServices] = await Promise.all([
      User.countDocuments({ deletedAt: null }),
      User.countDocuments({ status: 'active', deletedAt: null }),
      Product.countDocuments({ status: 'active' }),
      Job.countDocuments({ status: 'Open' }),
      Order.countDocuments({}),
      Service.countDocuments({ status: 'active' }),
    ]);

    // Wallet totals
    const walletAgg = await Wallet.aggregate([
      { $group: { _id: null, totalBalance: { $sum: '$balance' } } },
    ]);
    const totalPlatformBalance = walletAgg[0]?.totalBalance || 0;

    // Company till
    const till = await CompanyTill.findOne();

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, deletedAt: null });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        suspendedUsers: await User.countDocuments({ status: 'suspended' }),
        blockedUsers: await User.countDocuments({ status: 'blocked' }),
        totalProducts,
        totalJobs,
        totalOrders,
        totalServices,
        totalPlatformBalance,
        companyTillBalance: till?.balance || 0,
        recentRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update user info / status
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) { user.role = role; user.activeRole = role; }
    if (status) user.status = status;

    await user.save();
    await logActivity(req.user._id, `Admin updated user: ${user.email} (${status || role || 'info update'})`, 'User', user._id.toString());

    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Suspend user
// @route   PUT /api/admin/users/:id/suspend
// @access  Admin
const suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'suspended' }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await logActivity(req.user._id, `Admin suspended user: ${user.email}`, 'User', user._id.toString(), {}, 'critical');
    res.json({ success: true, message: 'User suspended', data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Activate user
// @route   PUT /api/admin/users/:id/activate
// @access  Admin
const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await logActivity(req.user._id, `Admin activated user: ${user.email}`, 'User', user._id.toString());
    res.json({ success: true, message: 'User activated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Block user
// @route   PUT /api/admin/users/:id/block
// @access  Admin
const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'blocked' }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await logActivity(req.user._id, `Admin blocked user: ${user.email}`, 'User', user._id.toString(), {}, 'critical');
    res.json({ success: true, message: 'User blocked', data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Permanently delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const email = user.email;
    user.deletedAt = new Date();
    user.status = 'blocked';
    user.deletionReason = `Permanently deleted by admin ${req.user._id}`;
    await user.save();
    await logActivity(req.user._id, `Admin permanently deleted user: ${email}`, 'User', req.params.id, {}, 'critical');
    res.json({ success: true, message: 'User permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Admin
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('seller', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Remove a product (admin)
// @route   DELETE /api/admin/products/:id
// @access  Admin
const adminRemoveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: 'removed' }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await logActivity(req.user._id, `Admin removed product: ${product.name}`, 'Product', req.params.id, {}, 'warning');
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all jobs (admin)
// @route   GET /api/admin/jobs
// @access  Admin
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate('employer', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all services (admin)
// @route   GET /api/admin/services
// @access  Admin
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({}).populate('provider', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get activity log
// @route   GET /api/admin/activity
// @access  Admin
const getActivityLog = async (req, res) => {
  try {
    const { page = 1, limit = 50, severity } = req.query;
    let query = {};
    if (severity) query.severity = severity;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const logs = await ActivityLog.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await ActivityLog.countDocuments(query);
    res.json({ success: true, count: logs.length, total, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Admin
const getSettings = async (req, res) => {
  try {
    const settings = await PlatformSettings.find({});
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update platform setting
// @route   PUT /api/admin/settings/:key
// @access  Admin
const updateSetting = async (req, res) => {
  try {
    const { value, description } = req.body;
    const setting = await PlatformSettings.findOneAndUpdate(
      { key: req.params.key },
      { value, description, updatedBy: req.user._id },
      { new: true, upsert: true }
    );
    await logActivity(req.user._id, `Admin updated setting: ${req.params.key}`, 'System', req.params.key);
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get company till details
// @route   GET /api/admin/till
// @access  Admin
const getCompanyTill = async (req, res) => {
  try {
    let till = await CompanyTill.findOne();
    if (!till) {
      till = await CompanyTill.create({ name: 'Company Till', balance: 0, currency: 'KES' });
    }
    res.json({ success: true, data: till });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add funds to company till
// @route   POST /api/admin/till/deposit
// @access  Admin
const depositToTill = async (req, res) => {
  const { amount, description } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }
  try {
    let till = await CompanyTill.findOne();
    if (!till) {
      till = await CompanyTill.create({ name: 'Company Till', balance: 0, currency: 'KES' });
    }
    till.balance += Number(amount);
    till.transactions.push({
      type: 'deposit', amount: Number(amount),
      description: description || 'Manual deposit',
      reference: `TILL_DEP${Date.now()}`, status: 'completed', createdAt: new Date(),
    });
    await till.save();
    await logActivity(req.user._id, `Admin deposited KES ${amount} to company till`, 'System');
    res.json({ success: true, data: till, message: `Successfully deposited KES ${amount} to company till` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllUsers, getPlatformStats,
  updateUser, suspendUser, activateUser, blockUser, deleteUser,
  getAllProducts, adminRemoveProduct,
  getAllJobs, getAllServices,
  getActivityLog, getSettings, updateSetting,
  getCompanyTill, depositToTill,
};
