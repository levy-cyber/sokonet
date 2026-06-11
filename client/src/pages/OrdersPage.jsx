import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import api from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
      // Mock data
      setOrders([
        {
          _id: 'ORD-001',
          items: [{ name: 'iPhone 15 Pro Max', quantity: 1, price: 185000, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100' }],
          totalAmount: 185000,
          status: 'delivered',
          paymentStatus: 'paid',
          shippingAddress: '123 Nairobi, Kenya',
          createdAt: '2024-01-15T10:30:00Z',
          estimatedDelivery: '2024-01-20T10:30:00Z',
          trackingNumber: 'SNK123456789',
        },
        {
          _id: 'ORD-002',
          items: [{ name: 'Sony WH-1000XM5', quantity: 1, price: 45000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100' }],
          totalAmount: 45000,
          status: 'shipped',
          paymentStatus: 'paid',
          shippingAddress: '456 Mombasa, Kenya',
          createdAt: '2024-01-18T14:20:00Z',
          estimatedDelivery: '2024-01-23T14:20:00Z',
          trackingNumber: 'SNK987654321',
        },
        {
          _id: 'ORD-003',
          items: [{ name: 'Nike Air Max 270', quantity: 2, price: 18500, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' }],
          totalAmount: 37000,
          status: 'processing',
          paymentStatus: 'paid',
          shippingAddress: '789 Kisumu, Kenya',
          createdAt: '2024-01-20T09:15:00Z',
          estimatedDelivery: '2024-01-27T09:15:00Z',
          trackingNumber: 'Pending',
        },
      ]);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || order._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
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
          <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your orders</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-green-500 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              filter === status
                ? 'bg-green-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {status}
          </button>
        ))}
      </motion.div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No orders found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{order._id}</p>
                    <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-white font-semibold">KES {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity} × KES {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="md:w-64 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tracking:</span>
                      <span className="text-white">{order.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Est. Delivery:</span>
                      <span className="text-white">
                        {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Address:</span>
                      <span className="text-white text-right">{order.shippingAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default OrdersPage;
