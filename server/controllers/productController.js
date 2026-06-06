const Product = require('../models/Product');
const Shop = require('../models/Shop');

// @desc    Get all products (with search/filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    let query = {};

    // Search query
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Category query
    if (category && category !== 'All') {
      query.category = category;
    }

    // Price query
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Execute query with sorting
    let apiQuery = Product.find(query).populate('seller', 'name avatar');

    if (sort === 'priceAsc') {
      apiQuery = apiQuery.sort({ price: 1 });
    } else if (sort === 'priceDesc') {
      apiQuery = apiQuery.sort({ price: -1 });
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 }); // Newest first
    }

    const products = await apiQuery;
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name avatar rating')
      .populate({
        path: 'seller',
        populate: { path: '_id', model: 'User' }
      });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Try finding the seller's shop to return storefront details
    const shop = await Shop.findOne({ seller: product.seller._id });

    res.json({ success: true, data: product, shop });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Seller/Admin only)
const createProduct = async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;

  try {
    const product = await Product.create({
      seller: req.user._id,
      name,
      description,
      price,
      category,
      stock,
      images: image ? [image] : undefined,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin only)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
