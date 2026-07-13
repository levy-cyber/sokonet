const { USE_MOCK, mockHelpers } = require('../config/db');

const normalizeService = (service) => ({
  ...service,
  _id: service._id || service.id,
  image: service.image || service.images?.[0] || 'https://images.unsplash.com/photo-1585704032915-c3400ca1e126?w=400',
  provider: service.providerName || service.provider || 'Verified provider',
  rating: service.rating || service.ratings?.[0]?.rating || 5,
  reviews: service.reviews || service.ratings?.length || 0,
  available: service.available !== undefined ? service.available : true,
  location: service.location || 'Nairobi',
  experience: service.experience || 'Experienced',
});

const getServices = async (req, res) => {
  try {
    const services = USE_MOCK
      ? mockHelpers.findServices(req.query).map(normalizeService)
      : [];

    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMyServices = async (req, res) => {
  try {
    const services = USE_MOCK
      ? mockHelpers.findServices({ provider: req.user._id }).map(normalizeService)
      : [];

    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createService = async (req, res) => {
  const { name, description, category, price, image, location, experience } = req.body;

  if (!name || !description || !category || !price) {
    return res.status(400).json({ success: false, message: 'Please provide a name, description, category, and price.' });
  }

  try {
    const service = USE_MOCK
      ? mockHelpers.createService({
          provider: req.user._id,
          providerName: req.user.name || 'Verified provider',
          name,
          description,
          category,
          price: Number(price),
          image,
          location: location || 'Nairobi',
          experience: experience || '1 year',
          available: true,
          rating: 5,
          reviews: 0,
        })
      : null;

    res.status(201).json({ success: true, data: normalizeService(service) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = USE_MOCK
      ? mockHelpers.findBookings(req.user._id).map((booking) => ({
          ...booking,
          _id: booking._id || booking.id,
          amount: booking.amount || booking.payment || 0,
          status: booking.status || 'pending',
        }))
      : [];

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createBooking = async (req, res) => {
  const { date, time, notes } = req.body;

  try {
    const existingService = USE_MOCK ? mockHelpers.findServices({}).find((service) => service._id === req.params.id) : null;
    const booking = USE_MOCK
      ? mockHelpers.createBooking({
          service: req.params.id,
          customer: req.user._id,
          customerName: req.user.name || 'Customer',
          provider: existingService?.provider || req.user._id,
          date: date || new Date(),
          time: time || 'ASAP',
          notes: notes || '',
          status: 'pending',
          amount: existingService?.price || 0,
        })
      : null;

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    if (USE_MOCK) {
      const booking = mockHelpers.findBookings(req.user._id).find((item) => item._id === req.params.bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      booking.status = status;
      res.json({ success: true, data: booking });
      return;
    }

    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getServices,
  getMyServices,
  createService,
  getBookings,
  createBooking,
  updateBookingStatus,
};
