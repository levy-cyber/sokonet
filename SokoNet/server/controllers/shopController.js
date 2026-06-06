import Shop from '../models/Shop.js';
import Product from '../models/Product.js';

export const createShop = async (req, res) => {
  const { name, slug, description, location, coverImage } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'Shop name and slug are required.' });
  }

  const existing = await Shop.findOne({ slug });
  if (existing) {
    return res.status(400).json({ message: 'Shop slug already exists.' });
  }

  const shop = await Shop.create({
    seller: req.user._id,
    name,
    slug,
    description,
    location: location || req.user.location,
    coverImage: coverImage || '',
  });
  res.status(201).json(shop);
};

export const getShops = async (req, res) => {
  const shops = await Shop.find().populate('seller', 'name email');
  res.json(shops);
};

export const getShopProducts = async (req, res) => {
  const products = await Product.find({ shop: req.params.shopId, status: 'active' }).populate('seller', 'name');
  res.json(products);
};
