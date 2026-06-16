const Product = require('../models/Product');
const Shop = require('../models/Shop');

// @desc    Get all products platform-wide (with search/filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, condition, minPrice, maxPrice, location, sort, page = 1, limit = 20 } = req.query;
    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') query.category = category;
    if (condition && condition !== 'All') query.condition = condition;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let apiQuery = Product.find(query).populate('seller', 'name avatar rating phone email');

    if (sort === 'priceAsc') apiQuery = apiQuery.sort({ price: 1 });
    else if (sort === 'priceDesc') apiQuery = apiQuery.sort({ price: -1 });
    else apiQuery = apiQuery.sort({ createdAt: -1 });

    const products = await apiQuery.skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(query);
    res.json({ success: true, count: products.length, total, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name avatar rating phone email');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const shop = await Shop.findOne({ seller: product.seller._id });
    res.json({ success: true, data: product, shop });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get my products
// @route   GET /api/products/mine
// @access  Private
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a product (any authenticated user)
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  const { name, description, price, category, condition, stock, images, location, sellerContact } = req.body;

  // Validate required fields
  if (!name || !description || !price || !category || !condition || !location) {
    return res.status(400).json({
      success: false,
      message: 'Name, description, price, category, condition, and location are required',
    });
  }
  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one product image is required' });
  }

  try {
    const product = await Product.create({
      seller: req.user._id,
      name, description, price, category, condition,
      stock: stock || 1,
      images,
      location,
      sellerContact: sellerContact || { phone: req.user.phone, email: req.user.email },
    });

    const populated = await Product.findById(product._id).populate('seller', 'name avatar rating');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (owner/admin)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (owner/admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct };