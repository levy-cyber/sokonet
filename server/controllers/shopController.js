const Shop = require('../models/Shop');
const Product = require('../models/Product');

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
  try {
    const shops = await Shop.find({}).populate('seller', 'name avatar rating');
    res.json({ success: true, count: shops.length, data: shops });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get shop details by ID (including their products)
// @route   GET /api/shops/:id
// @access  Public
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('seller', 'name avatar rating');

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    // Find products belonging to this seller
    const products = await Product.find({ seller: shop.seller._id });

    res.json({ success: true, data: shop, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current seller's shop profile
// @route   GET /api/shops/mine
// @access  Private (Seller only)
const getMyShop = async (req, res) => {
  try {
    let shop = await Shop.findOne({ seller: req.user._id });

    if (!shop) {
      // Auto-create shop if seller profile didn't initialize it
      shop = await Shop.create({
        seller: req.user._id,
        name: `${req.user.name}'s Shop`,
        description: 'Edit your shop details to describe your business.',
        address: 'Nairobi Market',
      });
    }

    const products = await Product.find({ seller: req.user._id });
    res.json({ success: true, data: shop, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update shop profile
// @route   PUT /api/shops/mine
// @access  Private (Seller only)
const updateMyShop = async (req, res) => {
  const { name, description, logo, banner, address } = req.body;

  try {
    const shop = await Shop.findOne({ seller: req.user._id });

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop profile not found' });
    }

    if (name) shop.name = name;
    if (description) shop.description = description;
    if (logo) shop.logo = logo;
    if (banner) shop.banner = banner;
    if (address) shop.address = address;

    await shop.save();
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getShops,
  getShopById,
  getMyShop,
  updateMyShop,
};
