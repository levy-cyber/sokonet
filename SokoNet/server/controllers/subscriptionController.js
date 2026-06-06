import Subscription from '../models/Subscription.js';

export const createSubscription = async (req, res) => {
  const { plan, expiresAt } = req.body;
  if (!plan) {
    return res.status(400).json({ message: 'Subscription plan is required.' });
  }

  const subscription = await Subscription.findOneAndUpdate(
    { user: req.user._id },
    {
      plan,
      status: 'active',
      startedAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(subscription);
};

export const getSubscription = async (req, res) => {
  const subscription = await Subscription.findOne({ user: req.user._id });
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found.' });
  }
  res.json(subscription);
};

export const getAllSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find().populate('user', 'name email role');
  res.json(subscriptions);
};
