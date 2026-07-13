const Rider = require('../models/Rider');
const User = require('../models/User');

// @desc    Register a new rider profile
// @route   POST /api/riders/register
// @access  Private
const registerRider = async (req, res) => {
  const { vehicleType, licensePlate } = req.body;

  if (!vehicleType || !licensePlate) {
    return res.status(400).json({ success: false, message: 'Vehicle type and license plate are required' });
  }

  try {
    let rider = await Rider.findOne({ user: req.user._id });

    if (rider) {
      return res.status(400).json({ success: false, message: 'You are already registered as a Rider' });
    }

    rider = await Rider.create({
      user: req.user._id,
      vehicleType,
      licensePlate,
    });

    // Update User role to 'rider'
    await User.findByIdAndUpdate(req.user._id, { role: 'rider' });

    res.status(201).json({ success: true, data: rider });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update rider coordinates (GPS tracking check-in)
// @route   PUT /api/riders/location
// @access  Private (Riders only)
const updateRiderLocation = async (req, res) => {
  const { latitude, longitude, address } = req.body;

  try {
    const rider = await Rider.findOne({ user: req.user._id });

    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider profile not found' });
    }

    if (latitude) rider.currentLocation.latitude = Number(latitude);
    if (longitude) rider.currentLocation.longitude = Number(longitude);
    if (address) rider.currentLocation.address = address;

    await rider.save();
    res.json({ success: true, data: rider });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Toggle availability
// @route   PUT /api/riders/availability
// @access  Private (Riders only)
const toggleRiderAvailability = async (req, res) => {
  try {
    const rider = await Rider.findOne({ user: req.user._id });

    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider profile not found' });
    }

    rider.isAvailable = !rider.isAvailable;
    await rider.save();

    res.json({ success: true, isAvailable: rider.isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all active/available riders
// @route   GET /api/riders/active
// @access  Private
const getActiveRiders = async (req, res) => {
  try {
    const riders = await Rider.find({ isAvailable: true }).populate('user', 'name phone avatar');
    res.json({ success: true, count: riders.length, data: riders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get specific rider details & metrics
// @route   GET /api/riders/profile
// @access  Private
const getRiderProfile = async (req, res) => {
  try {
    const rider = await Rider.findOne({ user: req.user._id }).populate('user', 'name phone email avatar');
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider profile not found' });
    }
    res.json({ success: true, data: rider });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerRider,
  updateRiderLocation,
  toggleRiderAvailability,
  getActiveRiders,
  getRiderProfile,
};
