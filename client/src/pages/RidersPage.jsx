import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiMapPin, FiClock, FiDollarSign, FiCheckCircle, FiNavigation, FiXCircle, FiPackage, FiStar, FiArrowRight, FiPhone, FiPhoneCall, FiX, FiAlertCircle, FiRefreshCw, FiUser } from 'react-icons/fi';
import StatCard from '../components/StatCard';

const RidersPage = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    // Update location every 30 seconds
    const locationInterval = setInterval(getCurrentLocation, 30000);
    return () => clearInterval(locationInterval);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };
        setCurrentLocation(location);
        setLocationLoading(false);
        console.log('Current location:', location);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    // Mock data for rider deliveries and requests
    setPendingRequests([]);
    setActiveDeliveries([]);
    setCompletedDeliveries([]);
    setTotalEarnings(0);
  }, []);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const acceptDelivery = (deliveryId) => {
    const request = pendingRequests.find(r => r.id === deliveryId);
    if (request) {
      setActiveDeliveries(prev => [
        { 
          ...request, 
          status: 'assigned', 
          acceptedAt: new Date(),
          createdAt: new Date()
        }, 
        ...prev
      ]);
      setPendingRequests(prev => prev.filter(r => r.id !== deliveryId));
    }
  };

  const rejectDelivery = (deliveryId) => {
    setPendingRequests(prev => prev.filter(r => r.id !== deliveryId));
  };

  const startDelivery = (deliveryId) => {
    setActiveDeliveries(prev => 
      prev.map(d => d.id === deliveryId ? { ...d, status: 'picked_up', startedAt: new Date() } : d)
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
      alert('Phone calls are disabled inside Netsoko. Please use the in-app chat or emergency SOS tab.');
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const diff = expiresAt - now;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    assigned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    picked_up: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const packageSizeColors = {
    Small: 'bg-green-500/10 text-green-400',
    Medium: 'bg-blue-500/10 text-blue-400',
    Large: 'bg-orange-500/10 text-orange-400'
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 lg:mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Delivery Partner Console</h1>
          <p className="text-gray-400 text-sm lg:text-base">Manage your deliveries and earnings</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleOnlineStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isOnline 
                ? 'bg-green-500 text-black' 
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </button>
          <button
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              locationLoading 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <FiRefreshCw className={`w-4 h-4 ${locationLoading ? 'animate-spin' : ''}`} />
            {locationLoading ? 'Updating...' : 'Update Location'}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard title="Pending Requests" value={pendingRequests.length} icon={FiAlertCircle} trend={isOnline ? '+2 new' : '0'} trendUp={true} />
        <StatCard title="Active Deliveries" value={activeDeliveries.length} icon={FiTruck} trend="+12.5%" trendUp={true} />
        <StatCard title="Total Earnings" value={`KES ${totalEarnings.toLocaleString()}`} icon={FiDollarSign} trend="+28.3%" trendUp={true} />
        <StatCard title="Average Rating" value="4.9/5.0" icon={FiNavigation} trend="+2.3%" trendUp={true} />
      </div>

      {/* Current Location Display */}
      {currentLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <FiMapPin className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Current Location</p>
              <p className="text-gray-400 text-sm">
                Lat: {currentLocation.latitude.toFixed(6)}, Lng: {currentLocation.longitude.toFixed(6)}
              </p>
              <p className="text-gray-500 text-xs">
                Accuracy: ±{currentLocation.accuracy.toFixed(0)}m • Updated: {currentLocation.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pending Delivery Requests */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiAlertCircle className="text-yellow-500" />
              New Delivery Requests ({pendingRequests.length})
            </h2>
            <span className="text-xs text-gray-400">Expires in 5 minutes</span>
          </div>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-2xl p-4 lg:p-6"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        NEW REQUEST
                      </span>
                      <span className="text-gray-400 text-sm">Order: {request.orderId}</span>
                      <span className="px-2 py-1 rounded text-xs font-medium border border-gray-600 text-gray-500">
                        {getTimeRemaining(request.expiresAt)} remaining
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{request.customerName}</h3>
                    
                    {/* Delivery Details */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                            <FiPackage className="text-brand" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium mb-1">{request.packageDescription}</p>
                            <div className="flex gap-2 text-xs">
                              <span className={`px-2 py-1 rounded ${packageSizeColors[request.packageSize]}`}>
                                {request.packageSize}
                              </span>
                              <span className="text-gray-400">{request.packageWeight}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <FiMapPin className="text-gray-500" />
                        <span className="text-gray-400">Pickup:</span>
                        <span className="text-white font-medium">{request.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <FiNavigation className="text-gray-500" />
                        <span className="text-gray-400">Delivery:</span>
                        <span className="text-white font-medium">{request.deliveryAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <FiClock />
                        <span>{request.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiNavigation />
                        <span>{request.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiPhone />
                        <span>{request.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-center gap-3">
                    <div className="text-center lg:text-right">
                      <p className="text-brand font-bold text-xl">KES {request.payment}</p>
                      <p className="text-gray-400 text-xs">Delivery fee</p>
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto">
                      <button
                        onClick={() => rejectDelivery(request.id)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-medium hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <FiX className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => acceptDelivery(request.id)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-brand text-black rounded-lg font-medium hover:bg-brand/90 transition-all flex items-center justify-center gap-2"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Deliveries */}
      {activeDeliveries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Active Deliveries ({activeDeliveries.length})</h2>
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
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <FiUser className="text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{delivery.customerName}</h3>
                        <p className="text-gray-400 text-xs">{delivery.customerPhone}</p>
                      </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <FiMapPin className="text-gray-500" />
                        <span>{delivery.pickupAddress || delivery.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <FiNavigation className="text-gray-500" />
                        <span>{delivery.deliveryAddress || delivery.deliveryLocation}</span>
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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center">
                      <p className="text-brand font-bold text-lg">KES {delivery.payment}</p>
                      <p className="text-gray-400 text-xs">Delivery fee</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => callCustomer(delivery.customerPhone)}
                        className="px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2"
                      >
                        <FiPhoneCall className="w-4 h-4" />
                        Call
                      </button>
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Completed Deliveries */}
      {completedDeliveries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Completed Deliveries ({completedDeliveries.length})</h2>
          <div className="space-y-4">
            {completedDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-gray-900/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border statusColors.delivered">
                        DELIVERED
                      </span>
                      <span className="text-gray-400 text-sm">Order: {delivery.orderId}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{delivery.customerName}</h3>
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                      <FiMapPin className="text-gray-500" />
                      <span>{delivery.pickupLocation}</span>
                      <FiArrowRight className="text-gray-500 hidden lg:block" />
                      <span className="lg:hidden">→</span>
                      <span>{delivery.deliveryLocation}</span>
                    </div>
                    {delivery.customerFeedback && (
                      <div className="mt-3 bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs italic">"{delivery.customerFeedback}"</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-brand font-bold text-lg">KES {delivery.payment}</p>
                      <p className="text-gray-400 text-xs">Earned</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <FiStar className="fill-current" />
                      <span className="font-bold">{delivery.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {pendingRequests.length === 0 && activeDeliveries.length === 0 && completedDeliveries.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
            <FiTruck className="w-12 h-12 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Deliveries</h2>
          <p className="text-gray-400 mb-6">
            {isOnline 
              ? 'Waiting for delivery requests...' 
              : 'Go online to receive delivery requests'}
          </p>
          {!isOnline && (
            <button
              onClick={toggleOnlineStatus}
              className="px-6 py-2 bg-brand text-black font-semibold rounded-lg hover:bg-brand/90 transition-all"
            >
              Go Online
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RidersPage;