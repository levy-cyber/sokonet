import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, MapPin, Phone, Mail, Package, TrendingUp, X, Image, Upload, ArrowRight, UtensilsCrossed, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ShopsPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [shop, setShop] = useState({
    name: 'My Store',
    description: 'Quality products at great prices',
    rating: 4.8,
    totalSales: 1250,
    totalRevenue: 1850000,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    location: 'Nairobi, Kenya',
    phone: '+254712345678',
    email: 'store@example.com',
  });
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [], // multiple images
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await api.get('/shops/mine');
      setShop(response.data.data || shop);
      const productsResponse = await api.get('/shops/mine/products');
      setProducts(productsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const MAX_IMAGES = 20;
    const remaining = MAX_IMAGES - newProduct.images.length;
    if (remaining <= 0) {
      alert('Maximum 20 images allowed per product.');
      return;
    }

    setUploadingImage(true);
    const toProcess = files.slice(0, remaining);

    const promises = toProcess.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    const results = await Promise.all(promises);
    setNewProduct((prev) => ({ ...prev, images: [...prev.images, ...results] }));
    setUploadingImage(false);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (newProduct.images.length >= 20) {
      alert('Maximum 20 images allowed per product.');
      return;
    }
    setNewProduct((prev) => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (idx) => {
    setNewProduct((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
      alert('Please fill in all required fields');
      return;
    }

    const defaultImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
    const finalImages = newProduct.images.length > 0 ? newProduct.images : [defaultImage];

    try {
      const response = await api.post('/products', {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        category: newProduct.category,
        images: finalImages,
        status: parseInt(newProduct.stock) > 0 ? 'active' : 'out_of_stock',
      });

      if (response.data.success) {
        setShowAddProduct(false);
        resetProductForm();
        fetchShopData();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Unable to publish the post right now. Please try again.');
    }
  };

  const resetProductForm = () => {
    setNewProduct({ name: '', description: '', price: '', stock: '', category: '', images: [] });
    setImageUrlInput('');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchShopData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Unable to delete the post right now. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'out_of_stock':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const categories = [
    'Electronics', 'Agriculture', 'Fashion', 'Health & Beauty', 'Home & Living', 'Automotive', 'Food & Beverage', 'Beverages', 'Groceries', 'Other'
  ];

  const isFoodCategory = (category = '') => {
    const normalized = String(category).toLowerCase();
    return ['food & beverage', 'food', 'beverages', 'snacks', 'meals', 'groceries', 'drinks', 'fresh produce'].includes(normalized);
  };

  const foodProducts = products.filter((product) => isFoodCategory(product.category));

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Store</h1>
          <p className="text-gray-400">Manage your shop and products</p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Post
        </button>
      </motion.div>

      {/* Shop Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <img src={shop.avatar} alt={shop.name} className="w-32 h-32 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{shop.name}</h2>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">{shop.rating}</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">{shop.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{shop.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{shop.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{shop.email}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <Package className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{shop.totalSales}</p>
              <p className="text-gray-400 text-sm">Total Sales</p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">KES {(shop.totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-gray-400 text-sm">Revenue</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
        {['products', 'food-beverages', 'orders', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-green-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Food & Beverage Tab */}
      {activeTab === 'food-beverages' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-gray-900/70 to-green-500/10 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-orange-400 mb-2">
                  <UtensilsCrossed className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">Food & Beverage Inventory</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Add your food stock, manage inventory and reach buyers fast.</h3>
                <p className="text-gray-400">Publish meals, drinks, snacks, groceries and more from one place, then switch to the marketplace or rider portal whenever you need.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab('food-beverages');
                    setShowAddProduct(true);
                    setNewProduct((prev) => ({ ...prev, category: 'Food & Beverage' }));
                  }}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Food Stock
                </button>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/60 px-4 py-2 text-sm font-medium text-gray-200 transition-all hover:bg-gray-700"
                >
                  Marketplace
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/rider/dashboard')}
                  className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition-all hover:bg-blue-500/20"
                >
                  <Truck className="w-4 h-4" />
                  Nearby Riders
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Your Food Listings</h3>
              <span className="text-sm text-gray-400">{foodProducts.length} items in stock</span>
            </div>
            {foodProducts.length === 0 ? (
              <div className="text-center py-8">
                <UtensilsCrossed className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No food stock yet. Add your first meal, snack or drink.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {foodProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                    <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-400 text-sm">{product.category}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(product.status)}`}>
                          {product.status?.replace('_', ' ') || 'active'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400 font-semibold">KES {product.price?.toLocaleString()}</span>
                        <span className="text-gray-400">Stock: {product.stock}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">My Products</h3>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No products yet. Add your first product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                  <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray-400 text-sm">{product.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(product.status)}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-400 font-semibold">KES {product.price.toLocaleString()}</span>
                      <span className="text-gray-400">Stock: {product.stock}</span>
                      <span className="text-gray-400">Sales: {product.sales}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-400">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Recent Orders</h3>
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Orders will appear here</p>
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Store Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/30 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-white">KES {shop.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-800/30 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-white">{shop.totalSales}</p>
            </div>
            <div className="p-4 bg-gray-800/30 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-white">{shop.rating}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {activeTab === 'food-beverages' || newProduct.category === 'Food & Beverage' ? 'Add Food & Beverage Stock' : 'Add New Post'}
              </h3>
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  resetProductForm();
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Describe your product"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition-colors"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Images — multiple up to 20 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Images <span className="text-gray-500">(up to 20)</span>
                </label>

                {/* Image gallery strip */}
                {newProduct.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {newProduct.images.map((img, idx) => (
                      <div key={idx} className="relative group w-20 h-20">
                        <img
                          src={img}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-700"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-green-500/80 text-white rounded-b-lg py-0.5">Cover</span>
                        )}
                      </div>
                    ))}
                    {newProduct.images.length < 20 && (
                      <label className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
                        <Upload className="w-5 h-5 text-gray-500" />
                        <span className="text-[10px] text-gray-500 mt-1">Add</span>
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                )}

                {/* Initial upload area when no images */}
                {newProduct.images.length === 0 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition-colors mb-3">
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-sm text-gray-400">Click or drag images here</span>
                    <span className="text-xs text-gray-500 mt-1">Up to 20 images</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}

                {/* URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Or paste image URL and press Add"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={newProduct.images.length >= 20}
                    className="px-3 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>

                {uploadingImage && (
                  <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    Processing images...
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddProduct(false); resetProductForm(); }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Post
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ShopsPage;