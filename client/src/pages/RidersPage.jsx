import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, CheckCircle, XCircle, Navigation, Star, Phone } from 'lucide-react';
import api from '../services/api';

const RidersPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deliveries, setDeliveries] = useState([]);
  const [earnings, setEarnings] = useState({
    today: 4500,
    week: 28000,
    month: 115000,
    totalDeliveries: 245,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiderData();
  }, []);

  const fetchRiderData = async () => {
    try {
      const response = await api.get('/riders/dashboard');
      setDeliveries(response.data.data.deliveries || []);
      setEarnings(response.data.data.earnings || earnings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rider data:', error);
      setLoading(false);
      // Mock data
      setDeliveries([
        {
          _id: 'DEL-001',
          orderId: 'ORD-001',
          pickup: 'Nairobi CBD',
          dropoff: 'Westlands',
          customer: { name: 'John Doe', phone: '+254712345678' },
          status: 'pending',
          distance: '5.2 km',
          estimatedTime: '15 min',
          fare: 350,
          createdAt: '2024-01-20T10:30:00Z',
        },
        {
          _id: 'DEL-002',
          orderId: 'ORD-002',
          pickup: 'Mombasa Road',
          dropoff: 'Kilimani',
          customer: { name: 'Jane Smith', phone: '+254798765432' },
          status: 'in_progress',
          distance: '8.5 km',
          estimatedTime: '25 min',
          fare: 550,
          createdAt: '2024-01-20T09:15:00Z',
        },
        {
          _id: 'DEL-003',
          orderId: 'ORD-003',
          pickup: 'Thika Road',
          dropoff: 'Karen',
          customer: { name: 'Mike Johnson', phone: '+254755555555' },
          status: 'completed',
          distance: '12.3 km',
          estimatedTime: '35 min',
          fare: 850,
          createdAt: '2024-01-19T16:45:00Z',
        },
      ]);
    }
  };

  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await api.put(`/riders/deliveries/${deliveryId}/accept`);
      fetchRiderData();
    } catch (error) {
      console.error('Error accepting delivery:', error);
    }
  };

  const handleCompleteDelivery = async (deliveryId) => {
    try {
      await api.put(`/riders/deliveries/${deliveryId}/complete`);
      fetchRiderData();
    } catch (error) {
      console.error('Error completing delivery:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredDeliveries = activeTab === 'dashboard' 
    ? deliveries.filter(d => d.status === 'in_progress' || d.status === 'pending')
    : deliveries.filter(d => d.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Rider Dashboard</h1>
        <p className="text-gray-400">Manage your deliveries and track earnings</p>
      </motion.div>

      {/* Earnings Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-white">KES {earnings.today.toLocaleString()}</span>
          </div>
          <p className="text-gray-400">Today's Earnings</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">KES {earnings.week.toLocaleString()}</span>
          </div>
          <p className="text-gray-400">This Week</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-white">KES {earnings.month.toLocaleString()}</span>
          </div>
          <p className="text-gray-400">This Month</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-white">{earnings.totalDeliveries}</span>
          </div>
          <p className="text-gray-400">Total Deliveries</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
        {['dashboard', 'pending', 'in_progress', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-green-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </motion.div>

      {/* Deliveries List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
          <Navigation className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No deliveries found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredDeliveries.map((delivery) => (
            <div key={delivery._id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(delivery.status)}`}>
                    {delivery.status.replace('_', ' ')}
                  </span>
                  <div>
                    <p className="text-white font-semibold">{delivery.orderId}</p>
                    <p className="text-gray-400 text-sm">{new Date(delivery.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-green-400 font-semibold text-xl">KES {delivery.fare}</span>
                  {delivery.status === 'pending' && (
                    <button
                      onClick={() => handleAcceptDelivery(delivery._id)}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Accept
                    </button>
                  )}
                  {delivery.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteDelivery(delivery._id)}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Pickup</p>
                    <p className="text-white">{delivery.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Dropoff</p>
                    <p className="text-white">{delivery.dropoff}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Est. Time</p>
                    <p className="text-white">{delivery.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Distance</p>
                    <p className="text-white">{delivery.distance}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {delivery.customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{delivery.customer.name}</p>
                      <p className="text-gray-400 text-sm">{delivery.customer.phone}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all">
                    <Phone className="w-5 h-5" />
                    Call Customer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RidersPage;
