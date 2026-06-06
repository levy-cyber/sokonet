import Rider from '../models/Rider.js';
import Order from '../models/Order.js';
import { createNotification } from '../services/notificationService.js';

export const registerRider = async (req, res) => {
  if (req.user.role !== 'rider') {
    req.user.role = 'rider';
    await req.user.save();
  }

  const existing = await Rider.findOne({ user: req.user._id });
  if (existing) {
    return res.json(existing);
  }

  const rider = await Rider.create({
    user: req.user._id,
    vehicle: req.body.vehicle || 'Motorbike',
    status: 'available',
    currentLocation: {
      type: 'Point',
      coordinates: req.body.coordinates || [36.8219, -1.2921],
    },
  });

  res.status(201).json(rider);
};

export const getRiders = async (req, res) => {
  const riders = await Rider.find().populate('user', 'name email phone');
  res.json(riders);
};

export const assignRider = async (req, res) => {
  const { riderId } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  const rider = await Rider.findById(riderId);
  if (!rider || rider.status !== 'available') {
    return res.status(400).json({ message: 'Rider is unavailable.' });
  }

  order.rider = rider._id;
  order.deliveryStatus = 'accepted';
  await order.save();

  rider.status = 'on_delivery';
  await rider.save();

  await createNotification(order.buyer, 'Rider assigned', `${rider.user.name} is delivering your order.`);
  res.json(order);
};

export const updateRiderLocation = async (req, res) => {
  const rider = await Rider.findOne({ user: req.user._id });
  if (!rider) {
    return res.status(404).json({ message: 'Rider profile not found.' });
  }

  const { coordinates } = req.body;
  if (!coordinates || coordinates.length !== 2) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  rider.currentLocation.coordinates = coordinates;
  await rider.save();
  res.json(rider);
};
