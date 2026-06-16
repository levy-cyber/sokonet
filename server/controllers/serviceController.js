const Service = require('../models/Service');
const notificationService = require('../services/notificationService');

// @desc    Get all active services (platform-wide)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { category, search, availability, page = 1, limit = 20 } = req.query;
    let query = { status: 'active' };

    if (category && category !== 'All') query.category = category;
    if (availability) query.availability = availability;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const services = await Service.find(query)
      .populate('provider', 'name avatar rating phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);
    res.json({ success: true, count: services.length, total, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name avatar rating phone email');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a service listing
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  const { title, description, category, pricing, pricingType, location, skills, images, contactPhone, contactEmail, availability } = req.body;

  if (!title || !description || !category || !pricing) {
    return res.status(400).json({ success: false, message: 'Title, description, category, and pricing are required' });
  }

  try {
    const service = await Service.create({
      provider: req.user._id,
      title, description, category, pricing, pricingType,
      location: location || 'Remote',
      skills: skills || [],
      images: images || [],
      contactPhone: contactPhone || req.user.phone,
      contactEmail: contactEmail || req.user.email,
      availability: availability || 'available',
    });

    const populated = await Service.findById(service._id).populate('provider', 'name avatar rating');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get my services
// @route   GET /api/services/mine
// @access  Private
const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id }).populate('provider', 'name avatar rating').sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (service.provider.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('provider', 'name avatar rating');
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (service.provider.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await service.deleteOne();
    res.json({ success: true, message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getServices, getServiceById, createService, getMyServices, updateService, deleteService };
