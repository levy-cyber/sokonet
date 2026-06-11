import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiMapPin, FiClock, FiDollarSign, FiCheckCircle, FiNavigation, FiXCircle, FiPackage, FiStar, FiArrowRight, FiPhone, FiPhoneCall } from 'react-icons/fi';
import StatCard from '../components/StatCard';

const RidersPage = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    // Mock data for rider deliveries
    setActiveDeliveries([
      {
        id: 1,
        orderId: 'ORD-001',
        pickupLocation: 'Nairobi, Westlands',
        deliveryLocation: 'Nairobi, Kilimani',
        customerName: 'John Kamau',
        customerPhone: '+254712345678',
        estimatedTime: '25 min',
        distance: '8.5 km',
        payment: 500,
        status: 'picked_up',
        createdAt: new Date()
      },
      {
        id: 2,
        orderId: 'ORD-002',
        pickupLocation: 'Nairobi, CBD',
        deliveryLocation: 'Nairobi, Karen',
        customerName: 'Mary Wanjiku',
        customerPhone: '+254723456789',
        estimatedTime: '30 min',
        distance: '12.3 km',
        payment: 650,
        status: 'pending',
        createdAt: new Date()
      },
      {
        id: 3,
        orderId: 'ORD-003',
        pickupLocation: 'Nairobi, Eastleigh',
        deliveryLocation: 'Nairobi, Roysambu',
        customerName: 'James Omondi',
        customerPhone: '+254734567890',
        estimatedTime: '20 min',
        distance: '6.2 km',
        payment: 450,
        status: 'assigned',
        createdAt: new Date()
      }
    ]);

    setCompletedDeliveries([
      {
        id: 4,
        orderId: 'ORD-004',
        pickupLocation: 'Nairobi, Upper Hill',
        deliveryLocation: 'Nairobi, Lavington',
        customerName: 'Sarah Mwangi',
        customerPhone: '+254745678901',
        estimatedTime: '15 min',
        distance: '4.1 km',
        payment: 350,
        status: 'delivered',
        createdAt: new Date(),
        completedAt: new Date(Date.now() - 3600000),
        rating: 5
      }
    ]);

    setTotalEarnings(145000);
  }, []);

  const acceptDelivery = (deliveryId) => {
    setActiveDeliveries(prev => 
      prev.map(d => d.id === deliveryId ? { ...d, status: 'assigned' } : d)
    );
  };

  const startDelivery = (deliveryId) => {
    setActiveDeliveries(prev => 
      prev.map(d => d.id === deliveryId ? { ...d, status: 'picked_up' } : d)
    );
  };

  const completeDelivery = (deliveryId) => {
    const delivery = activeDeliveries.find(d => d.id === deliveryId);
    if (delivery) {
      setCompletedDeliveries(prev => [
        { ...delivery, status: 'delivered', completedAt: new Date(), rating: 5 },
        ...prev
      ]);
      setActiveDeliveries(prev => prev.filter(d => d.id !== deliveryId));
      setTotalEarnings(prev => prev + delivery.payment);
    }
  };

  const callCustomer = (customerPhone) => {
    if (customerPhone) {
      window.location.href = `tel:${customerPhone}`;
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    assigned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    picked_up: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Delivery Partner Console</h1>
        <p className="text-gray-400 text-sm lg:text-base">Manage your deliveries and earnings</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard title="Active Deliveries" value={activeDeliveries.length} icon={FiTruck} trend="+12.5%" trendUp={true} />
        <StatCard title="Total Earnings" value={`KES ${totalEarnings.toLocaleString()}`} icon={FiDollarSign} trend="+28.3%" trendUp={true} />
        <StatCard title="Completed Today" value={completedDeliveries.filter(d => 
          new Date(d.completedAt) > new Date(Date.now() - 86400000)
        ).length} icon={FiCheckCircle} trend="+15.7%" trendUp={true} />
        <StatCard title="Average Rating" value="4.9/5.0" icon={FiNavigation} trend="+2.3%" trendUp={true} />
      </div>

      {/* Active Deliveries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Active Deliveries</h2>
        <div className="space-y-4">
          {activeDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[delivery.status]}">
                      {delivery.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-sm">Order: {delivery.orderId}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{delivery.customerName}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <FiMapPin className="text-gray-500" />
                      <span>{delivery.pickupLocation}</span>
                      <FiArrowRight className="text-gray-500 hidden lg:block" />
                      <span className="lg:hidden">→</span>
                      <span>{delivery.deliveryLocation}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <FiClock />
                        <span>{delivery.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiNavigation />
                        <span>{delivery.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiPhone />
                        <span>{delivery.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-right">
                    <p className="text-brand font-bold text-lg">KES {delivery.payment}</p>
                    <p className="text-gray-400 text-xs">Delivery fee</p>
                  </div>
                  <div className="flex gap-2">
                    {delivery.status === 'pending' && (
                      <button
                        onClick={() => acceptDelivery(delivery.id)}
                        className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
                      >
                        Accept
                      </button>
                    )}
                    {delivery.status === 'assigned' && (
                      <button
                        onClick={() => startDelivery(delivery.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
                      >
                        Start Delivery
                      </button>
                    )}
                    {delivery.status === 'picked_up' && (
                      <button
                        onClick={() => completeDelivery(delivery.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                      >
                        Complete
                      </button>
                    )}
                    <button 
                      onClick={() => callCustomer(delivery.customerPhone)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all flex items-center gap-2"
                    >
                      <FiPhoneCall />
                      <span className="hidden sm:inline">Call Customer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Completed Deliveries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Completed Deliveries</h2>
        <div className="space-y-4">
          {completedDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                      DELIVERED
                    </span>
                    <span className="text-gray-400 text-sm">Order: {delivery.orderId}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{delivery.customerName}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FiMapPin />
                    <span>{delivery.pickupLocation} → {delivery.deliveryLocation}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-lg">+KES {delivery.payment}</p>
                    <p className="text-gray-400 text-xs">Earned</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="fill" />
                    ))}
                    <span className="text-sm ml-1">{delivery.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RidersPage;