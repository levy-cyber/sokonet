const RideRequest = require('../models/RideRequest');
const Rider = require('../models/Rider');
const { USE_MOCK, mockHelpers } = require('../config/db');

// @desc    Create a new ride request
// @route   POST /api/ride-requests
// @access  Private
const createRideRequest = async (req, res) => {
  const {
    pickupLocation,
    destinationLocation,
    estimatedPrice,
    distance,
    duration,
    paymentMethod,
    notes
  } = req.body;

  try {
    const rideRequest = await RideRequest.create({
      user: req.user._id,
      pickupLocation,
      destinationLocation,
      estimatedPrice,
      distance,
      duration,
      paymentMethod: paymentMethod || 'wallet',
      notes: notes || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      rideRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user's ride requests
// @route   GET /api/ride-requests/my-rides
// @access  Private
const getMyRideRequests = async (req, res) => {
  try {
    const rideRequests = await RideRequest.find({ user: req.user._id })
      .populate('rider', 'user vehicleType licensePlate')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rideRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all pending ride requests (for riders)
// @route   GET /api/ride-requests/pending
// @access  Private
const getPendingRideRequests = async (req, res) => {
  try {
    const rideRequests = await RideRequest.find({ status: 'pending' })
      .populate('user', 'name phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rideRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Accept a ride request (for riders)
// @route   PUT /api/ride-requests/:id/accept
// @access  Private
const acceptRideRequest = async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({ success: false, message: 'Ride request not found' });
    }

    if (rideRequest.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Ride request is no longer pending' });
    }

    // Get rider profile
    const rider = await Rider.findOne({ user: req.user._id });
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider profile not found' });
    }

    rideRequest.rider = rider._id;
    rideRequest.status = 'accepted';
    await rideRequest.save();

    res.json({
      success: true,
      rideRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update ride status
// @route   PUT /api/ride-requests/:id/status
// @access  Private
const updateRideStatus = async (req, res) => {
  const { status, actualPrice } = req.body;

  try {
    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({ success: false, message: 'Ride request not found' });
    }

    // Check if user is authorized (either the rider who accepted or the user who requested)
    const rider = await Rider.findOne({ user: req.user._id });
    const isRider = rider && rideRequest.rider && rideRequest.rider.toString() === rider._id.toString();
    const isUser = rideRequest.user.toString() === req.user._id.toString();

    if (!isRider && !isUser) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this ride' });
    }

    rideRequest.status = status;
    if (actualPrice) {
      rideRequest.actualPrice = actualPrice;
    }
    await rideRequest.save();

    res.json({
      success: true,
      rideRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get ride request by ID
// @route   GET /api/ride-requests/:id
// @access  Private
const getRideRequestById = async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id)
      .populate('user', 'name phone avatar')
      .populate('rider', 'user vehicleType licensePlate');

    if (!rideRequest) {
      return res.status(404).json({ success: false, message: 'Ride request not found' });
    }

    // Check authorization
    const rider = await Rider.findOne({ user: req.user._id });
    const isRider = rider && rideRequest.rider && rideRequest.rider.toString() === rider._id.toString();
    const isUser = rideRequest.user.toString() === req.user._id.toString();

    if (!isRider && !isUser) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ride' });
    }

    res.json({
      success: true,
      rideRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createRideRequest,
  getMyRideRequests,
  getPendingRideRequests,
  acceptRideRequest,
  updateRideStatus,
  getRideRequestById
};
