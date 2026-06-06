import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  const { title, description, category, location, price, images } = req.body;
  if (!title || !description || !category || !price) {
    return res.status(400).json({ message: 'Title, description, category, and price are required.' });
  }

  const product = await Product.create({
    title,
    description,
    category,
    location: location || req.user.location,
    price,
    images: images || [],
    seller: req.user._id,
  });

  res.status(201).json(product);
};

export const getProducts = async (req, res) => {
  const { category, location, seller } = req.query;
  const filters = { status: 'active' };
  if (category) filters.category = category;
  if (location) filters.location = location;
  if (seller) filters.seller = seller;

  const products = await Product.find(filters).populate('seller', 'name email role');
  res.json(products);
};

export const getSellerProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).populate('seller', 'name email');
  res.json(products);
};
