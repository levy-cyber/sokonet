import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  const { productId, notes } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const order = await Order.create({
    buyer: req.user._id,
    seller: product.seller,
    product: product._id,
    amount: product.price,
    status: 'held',
    notes: notes || '',
  });

  res.status(201).json(order);
};

export const getOrders = async (req, res) => {
  const filters = {};
  if (req.user.role === 'seller') filters.seller = req.user._id;
  else if (req.user.role === 'user') filters.buyer = req.user._id;

  const orders = await Order.find(filters)
    .populate('buyer', 'name email')
    .populate('seller', 'name email')
    .populate('product', 'title price');
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (!['pending', 'held', 'released', 'refunded', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid order status.' });
  }

  if (req.user.role !== 'admin' && !order.seller.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not permitted to update this order.' });
  }

  order.status = status;
  if (status === 'released' || status === 'refunded' || status === 'completed') {
    order.escrowHeld = false;
  }
  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email')
    .populate('seller', 'name email')
    .populate('product', 'title price');
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }
  res.json(order);
};
