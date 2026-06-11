import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, Shield, MessageCircle, X, MapPin } from 'lucide-react';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
      // Mock data
      setProduct({
        _id: id,
        name: 'iPhone 15 Pro Max',
        description: 'The most powerful iPhone ever. Featuring A17 Pro chip, titanium design, and advanced camera system.',
        price: 185000,
        category: 'electronics',
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
        ],
        rating: 4.8,
        reviews: 234,
        stock: 15,
        seller: {
          _id: 'seller1',
          name: 'TechStore Kenya',
          rating: 4.9,
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
        },
        specifications: {
          'Display': '6.7" Super Retina XDR',
          'Processor': 'A17 Pro chip',
          'Storage': '256GB',
          'Camera': '48MP Main + 12MP Ultra Wide',
          'Battery': '4422 mAh',
        },
      });
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', product._id, quantity);
  };

  const handleBuyNow = () => {
    navigate('/escrow', { state: { product, quantity } });
  };

  const handleDelivery = () => {
    setShowDeliveryModal(true);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmDelivery = async () => {
    try {
      await api.post(`/orders/${id}/delivery`, {
        location: deliveryLocation,
      });
      alert('Delivery request submitted');
      setShowDeliveryModal(false);
      setDeliveryLocation('');
    } catch (error) {
      console.error('Delivery error:', error);
      alert('Failed to submit delivery request');
    }
  };

  const handleConfirmCancel = async () => {
    try {
      await api.post(`/orders/${id}/cancel`, {
        reason: cancelReason,
      });
      alert('Order cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      navigate('/orders');
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Product not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 aspect-square flex items-center justify-center"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-gray-900/50 border rounded-lg p-2 transition-all ${
                    selectedImage === index ? 'border-green-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-20 object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-green-400 text-sm font-medium mb-2">{product.category.toUpperCase()}</p>
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.reviews} reviews)</span>
              </div>
              <p className="text-4xl font-bold text-white mb-4">KES {product.price.toLocaleString()}</p>
              <p className="text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{product.seller.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-400 text-sm">{product.seller.rating}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all">
                  View Store
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400">{key}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-400">Quantity:</label>
                <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-white hover:bg-gray-800 transition-all"
                  >
                    -
                  </button>
                  <span className="text-white font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-white hover:bg-gray-800 transition-all"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 text-sm">{product.stock} available</span>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
                >
                  Buy Now
                </motion.button>
                <button className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all border border-gray-700">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelivery}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  <Truck className="w-5 h-5" />
                  Request Delivery
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <X className="w-5 h-5" />
                  Cancel Order
                </motion.button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <Truck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Fast Delivery</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Escrow Protected</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Request Delivery</h3>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Delivery Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmDelivery}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Confirm Delivery Request
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Cancel Order</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Reason for Cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancelling this order"
                  rows={3}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmCancel}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
              >
                Confirm Cancellation
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
