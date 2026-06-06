import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';

export const getProfile = async (req, res) => {
  const user = req.user;
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
};

export const updateProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const { name, email, bio, location } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  user.location = location || user.location;

  const updatedUser = await user.save();
  res.json(updatedUser);
};

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const getDashboardAnalytics = async (req, res) => {
  const userCount = await User.countDocuments();
  const orderCount = await Order.countDocuments();
  const subscriptionCount = await Subscription.countDocuments({ status: 'active' });
  const sellerCount = await User.countDocuments({ role: 'seller' });

  res.json({
    users: userCount,
    orders: orderCount,
    activeSubscriptions: subscriptionCount,
    sellers: sellerCount,
  });
};
