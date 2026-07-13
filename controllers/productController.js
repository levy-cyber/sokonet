const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { USE_MOCK, mockHelpers, mockDB } = require('../config/db');

const MAX_PRODUCT_IMAGES = 20;

const normalizeProductImages = (images, image) => {
  const result = [];
  if (Array.isArray(images)) {
    result.push(...images.filter(Boolean));
  }
  if (typeof image === 'string' && image.trim()) {
    result.push(image.trim());
  }
  return result.slice(0, MAX_PRODUCT_IMAGES);
};

// @desc    Get all products (with search/filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    let products;

    if (USE_MOCK) {
      products = mockHelpers.findProducts({ search, category });
      
      // Filter by price
      if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
      if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));
      
      // Sort
      if (sort === 'priceAsc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'priceDesc') {
        products.sort((a, b) => b.price - a.price);
      } else {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      products = products.map((p) => {
        const sellerInfo = mockDB.users.find((user) => user._id === p.seller);
        return {
          ...p,
          image: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=400',
          images: p.images || [p.image].filter(Boolean),
          price: Number(p.price || 0),
          stock: Number(p.stock || 0),
          seller: {
            _id: p.seller,
            name: sellerInfo?.name || 'Verified Seller',
            avatar: sellerInfo?.avatar || 'https://i.pravatar.cc/150?img=2',
            rating: sellerInfo?.rating || 4.8,
          }
        };
      });
      
      res.json({ success: true, count: products.length, data: products });
    } else {
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

      products = await apiQuery;
      res.json({ success: true, count: products.length, data: products });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    let product;
    
    if (USE_MOCK) {
      product = mockHelpers.findProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      product = {
        ...product,
        seller: { _id: product.seller, name: 'Tech Store Kenya', avatar: 'https://i.pravatar.cc/150?img=2', rating: 4.8 }
      };
      res.json({ success: true, data: product, shop: null });
    } else {
      product = await Product.findById(req.params.id)
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
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Seller/Admin only)
const createProduct = async (req, res) => {
  const { name, description, price, category, stock, image, images } = req.body;
  const requestedImages = [
    ...(Array.isArray(images) ? images.filter(Boolean) : []),
    ...(typeof image === 'string' && image.trim() ? [image.trim()] : []),
  ];
  if (requestedImages.length > MAX_PRODUCT_IMAGES) {
    return res.status(400).json({
      success: false,
      message: `Maximum ${MAX_PRODUCT_IMAGES} product images allowed per product.`,
    });
  }

  const productImages = normalizeProductImages(images, image);

  try {
    let product;
    
    if (USE_MOCK) {
      product = mockHelpers.createProduct({
        seller: req.user._id,
        name,
        description,
        price,
        category,
        stock,
        images: productImages.length ? productImages : undefined,
      });
      res.status(201).json({ success: true, data: product });
    } else {
      product = await Product.create({
        seller: req.user._id,
        name,
        description,
        price,
        category,
        stock,
        images: productImages.length ? productImages : undefined,
      });

      res.status(201).json({ success: true, data: product });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin only)
const updateProduct = async (req, res) => {
  try {
    if (USE_MOCK) {
      const product = mockHelpers.findProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const updated = { ...product, ...req.body };
      res.json({ success: true, data: updated });
    } else {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Check ownership
      if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
      }

      const { image, images } = req.body;
      const requestedImages = [
        ...(Array.isArray(images) ? images.filter(Boolean) : []),
        ...(typeof image === 'string' && image.trim() ? [image.trim()] : []),
      ];
      if (requestedImages.length > MAX_PRODUCT_IMAGES) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${MAX_PRODUCT_IMAGES} product images allowed per product.`,
        });
      }

      if (requestedImages.length > 0) {
        req.body.images = normalizeProductImages(images, image);
      }

      product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.json({ success: true, data: product });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin only)
const deleteProduct = async (req, res) => {
  try {
    if (USE_MOCK) {
      const product = mockHelpers.findProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, message: 'Product removed' });
    } else {
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
    }
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