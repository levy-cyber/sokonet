const Order = require('../models/Order');
const Product = require('../models/Product');
const Rider = require('../models/Rider');
const Wallet = require('../models/Wallet');
const Escrow = require('../models/Escrow');
const Transaction = require('../models/Transaction');
const notificationService = require('../services/notificationService');

// @desc    Create new order (with automatic wallet deduction & escrow hold)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  try {
    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and price
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.name}` });
      }

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Check buyer wallet
    const buyerWallet = await Wallet.findOne({ user: req.user._id });
    if (!buyerWallet || buyerWallet.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance. Total: KES ${totalAmount}, Wallet: KES ${buyerWallet ? buyerWallet.balance : 0}`,
      });
    }

    // Since we verified the order, fetch the seller ID from the first product
    const firstProduct = await Product.findById(items[0].product);
    const sellerId = firstProduct.seller;

    // Create the order first (so we have its ID for the Escrow link)
    const order = new Order({
      buyer: req.user._id,
      seller: sellerId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: 'Escrowed',
      deliveryStatus: 'Pending',
    });

    // Create Escrow entry
    const escrow = await Escrow.create({
      order: order._id,
      buyer: req.user._id,
      seller: sellerId,
      amount: totalAmount,
      status: 'Held',
    });

    order.escrow = escrow._id;
    await order.save();

    // Deduct buyer wallet
    buyerWallet.balance -= totalAmount;
    await buyerWallet.save();

    // Create Transaction record
    await Transaction.create({
      wallet: buyerWallet._id,
      user: req.user._id,
      type: 'Escrow_Hold',
      amount: totalAmount,
      gateway: 'Wallet_Internal',
      status: 'Completed',
      description: `Funds locked in escrow for order #${order._id}`,
    });

    // Notify seller
    await notificationService.createNotification(
      sellerId,
      'New Order Received',
      `You have received a new order for KES ${totalAmount}. Funds are secured in Netsoko Escrow.`,
      'Order',
      `/orders/${order._id}`
    );

    // Notify buyer
    await notificationService.createNotification(
      req.user._id,
      'Order Placed Successfully',
      `Your payment of KES ${totalAmount} is held securely in Netsoko Escrow.`,
      'Order',
      `/orders/${order._id}`
    );

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all orders of the logged-in user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({}).populate('buyer seller', 'name email phone').populate('items.product', 'name images');
    } else if (req.user.role === 'seller') {
      orders = await Order.find({ seller: req.user._id }).populate('buyer seller', 'name email phone').populate('items.product', 'name images');
    } else if (req.user.role === 'rider') {
      const riderProfile = await Rider.findOne({ user: req.user._id });
      if (riderProfile) {
        orders = await Order.find({ rider: riderProfile._id }).populate('buyer seller', 'name email phone').populate('items.product', 'name images');
      } else {
        orders = [];
      }
    } else {
      orders = await Order.find({ buyer: req.user._id }).populate('buyer seller', 'name email phone').populate('items.product', 'name images');
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer seller rider', 'name email phone avatar')
      .populate('items.product')
      .populate('escrow');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    const isAuthorized =
      req.user.role === 'admin' ||
      order.buyer._id.toString() === req.user._id.toString() ||
      order.seller._id.toString() === req.user._id.toString() ||
      (order.rider && order.rider._id.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update delivery status and assign rider
// @route   PUT /api/orders/:id/delivery
// @access  Private
const updateDeliveryStatus = async (req, res) => {
  const { status, riderId } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (riderId) {
      order.rider = riderId;
      order.deliveryStatus = 'Assigned';

      // Notify rider
      await notificationService.createNotification(
        riderId,
        'Delivery Dispatch Assigned',
        `You have been assigned to deliver order #${order._id}.`,
        'Rider',
        `/orders/${order._id}`
      );
    }

    if (status) {
      order.deliveryStatus = status;
    }

    await order.save();

    // Send notifications to buyer and seller
    await notificationService.createNotification(
      order.buyer,
      'Order Status Updated',
      `Your order #${order._id} status is now: ${order.deliveryStatus}`,
      'Order',
      `/orders/${order._id}`
    );

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Release escrow funds to seller (confirm delivery receipt)
// @route   PUT /api/orders/:id/release
// @access  Private (Buyer or Admin only)
const releaseOrderPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('escrow');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization: Only the buyer of the order or Admin can release the escrow funds
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to release funds' });
    }

    if (order.paymentStatus === 'Released') {
      return res.status(400).json({ success: false, message: 'Payment already released to seller' });
    }

    // Release escrow
    const escrow = await Escrow.findById(order.escrow._id);
    if (!escrow || escrow.status !== 'Held') {
      return res.status(400).json({ success: false, message: 'No held escrow found for this order' });
    }

    escrow.status = 'Released';
    escrow.releasedAt = Date.now();
    await escrow.save();

    // Credit Seller wallet
    const sellerWallet = await Wallet.findOne({ user: order.seller });
    if (sellerWallet) {
      sellerWallet.balance += order.totalAmount;
      await sellerWallet.save();

      // Create transaction for Seller
      await Transaction.create({
        wallet: sellerWallet._id,
        user: order.seller,
        type: 'Escrow_Release',
        amount: order.totalAmount,
        gateway: 'Wallet_Internal',
        status: 'Completed',
        description: `Funds released from escrow for order #${order._id}`,
      });
    }

    order.paymentStatus = 'Released';
    order.deliveryStatus = 'Delivered'; // Auto complete delivery
    await order.save();

    // Credit Rider earnings if assigned
    if (order.rider) {
      const Rider = require('../models/Rider');
      const riderProfile = await Rider.findOne({ user: order.rider });
      if (riderProfile) {
        riderProfile.earnings += 150.0; // Standard 150 KES delivery earnings
        riderProfile.deliveriesCompleted += 1;
        await riderProfile.save();

        // Credit Rider wallet
        const riderWallet = await Wallet.findOne({ user: order.rider });
        if (riderWallet) {
          riderWallet.balance += 150.0;
          await riderWallet.save();

          await Transaction.create({
            wallet: riderWallet._id,
            user: order.rider,
            type: 'Payout',
            amount: 150.0,
            gateway: 'Wallet_Internal',
            status: 'Completed',
            description: `Delivery fee payout for order #${order._id}`,
          });
        }

        await notificationService.createNotification(
          order.rider,
          'Payout Credited',
          `You earned KES 150.00 for delivering order #${order._id}`,
          'Rider'
        );
      }
    }

    // Notify seller
    await notificationService.createNotification(
      order.seller,
      'Funds Released',
      `KES ${order.totalAmount} has been credited to your wallet for order #${order._id}.`,
      'Wallet',
      `/wallet`
    );

    // Notify buyer
    await notificationService.createNotification(
      order.buyer,
      'Delivery Received & Released',
      `You confirmed receipt. Payment of KES ${order.totalAmount} released to seller.`,
      'Order',
      `/orders/${order._id}`
    );

    res.json({ success: true, message: 'Payment released and order completed', data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateDeliveryStatus,
  releaseOrderPayment,
};
