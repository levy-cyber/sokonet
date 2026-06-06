import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, MapPin, Phone, Mail, Package, TrendingUp } from 'lucide-react';
import api from '../services/api';

const ShopsPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
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

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await api.get('/shops/my');
      setShop(response.data.data.shop || shop);
      const productsResponse = await api.get('/shops/my/products');
      setProducts(productsResponse.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setLoading(false);
      // Mock data
      setProducts([
        {
          _id: '1',
          name: 'iPhone 15 Pro Max',
          price: 185000,
          stock: 15,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
          status: 'active',
          sales: 45,
          rating: 4.8,
        },
        {
          _id: '2',
          name: 'Samsung Galaxy S24 Ultra',
          price: 175000,
          stock: 20,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
          status: 'active',
          sales: 38,
          rating: 4.7,
        },
        {
          _id: '3',
          name: 'Sony WH-1000XM5',
          price: 45000,
          stock: 30,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
          status: 'active',
          sales: 62,
          rating: 4.9,
        },
        {
          _id: '4',
          name: 'Nike Air Max 270',
          price: 18500,
          stock: 0,
          category: 'fashion',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          status: 'out_of_stock',
          sales: 89,
          rating: 4.6,
        },
      ]);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchShopData();
      } catch (error) {
        console.error('Error deleting product:', error);
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
          Add Product
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
        {['products', 'orders', 'analytics'].map((tab) => (
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
    </div>
  );
};

export default ShopsPage;
