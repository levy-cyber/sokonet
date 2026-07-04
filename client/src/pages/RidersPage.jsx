import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiMapPin, FiClock, FiDollarSign, FiCheckCircle, FiNavigation, FiXCircle, FiPackage, FiStar, FiArrowRight, FiPhone, FiPhoneCall, FiX, FiAlertCircle, FiRefreshCw, FiUser } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import api from '../services/api';

const RidersPage = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [orderStats, setOrderStats] = useState({ pending: 0, active: 0, completed: 0 });
  const [riderProfile, setRiderProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState('Fetching address...');
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyRiders, setNearbyRiders] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    fetchRiderProfile();
    fetchRiderOrders();
    // Update location every 30 seconds
    const locationInterval = setInterval(getCurrentLocation, 30000);
    return () => clearInterval(locationInterval);
  }, []);

  useEffect(() => {
    const fetchNearbyRiders = async () => {
      try {
        setNearbyLoading(true);
        const response = await api.get('/riders/active');
        const riders = response.data?.data || [];
        setNearbyRiders(riders);
      } catch (error) {
        console.error('Error fetching nearby riders:', error);
        setNearbyRiders([]);
      } finally {
        setNearbyLoading(false);
      }
    };

    fetchNearbyRiders();
  }, [currentLocation]);

  const fetchRiderProfile = async () => {
    try {
      const response = await api.get('/riders/profile');
      const profile = response.data?.data;
      if (profile) {
        setTotalEarnings(profile.earnings || 0);
        setAverageRating(profile.user?.rating || 0);
      }
    } catch (error) {
      console.error('Error fetching rider profile:', error);
    }
  };

  const fetchRiderOrders = async () => {
    try {
      const response = await api.get('/orders');
      const orders = response.data?.data || [];
      const normalized = orders.map((order) => ({
        ...order,
        deliveryStatus: order.deliveryStatus || order.status || 'pending',
      }));

      const pendingCount = normalized.filter((order) => order.deliveryStatus.toLowerCase() === 'pending').length;
      const completedCount = normalized.filter((order) => order.deliveryStatus.toLowerCase() === 'delivered').length;
      const activeCount = normalized.filter((order) => !['delivered', 'cancelled'].includes(order.deliveryStatus.toLowerCase())).length;

      setOrderStats({ pending: pendingCount, active: activeCount, completed: completedCount });
    } catch (error) {
      console.error('Error fetching rider orders:', error);
      setOrderStats({ pending: 0, active: 0, completed: 0 });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };
        setCurrentLocation(location);
        setLocationLoading(false);
        console.log('Current location:', location);

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`);
          const data = await response.json();
          setLocationName(data.display_name || 'Current location');
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          setLocationName('Current location');
        }
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

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const sortedNearbyRiders = currentLocation
    ? [...nearbyRiders]
        .filter((rider) => rider?.currentLocation?.latitude && rider?.currentLocation?.longitude)
        .map((rider) => ({
          ...rider,
          distanceKm: getDistanceKm(
            currentLocation.latitude,
            currentLocation.longitude,
            rider.currentLocation.latitude,
            rider.currentLocation.longitude
          ),
        }))
        .filter((rider) => rider.distanceKm !== null)
        .sort((a, b) => a.distanceKm - b.distanceKm)
    : [];

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
        <StatCard title="Pending Requests" value={orderStats.pending} icon={FiAlertCircle} />
        <StatCard title="Active Deliveries" value={orderStats.active} icon={FiTruck} />
        <StatCard title="Total Earnings" value={`KES ${totalEarnings.toLocaleString()}`} icon={FiDollarSign} />
        <StatCard title="Average Rating" value={averageRating ? `${averageRating.toFixed(1)}/5.0` : 'N/A'} icon={FiNavigation} />
      </div>

      {/* Current Location Display */}
      {currentLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-4 mb-6"
        >
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] items-start">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-2xl">
                <FiMapPin className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.2em] text-green-300">Current Location</p>
                <h3 className="text-xl font-semibold text-white mt-2">{locationName}</h3>
                <p className="text-gray-400 text-sm mt-1">Accuracy: ±{currentLocation.accuracy.toFixed(0)}m • Updated: {currentLocation.timestamp.toLocaleTimeString()}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-300">
                  <span className="rounded-full border border-gray-700/60 bg-gray-800/60 px-3 py-2">{currentLocation.latitude.toFixed(6)}</span>
                  <span className="rounded-full border border-gray-700/60 bg-gray-800/60 px-3 py-2">{currentLocation.longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-700/50 bg-black/40">
              <iframe
                title="Rider current location"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.longitude - 0.02}%2C${currentLocation.latitude - 0.015}%2C${currentLocation.longitude + 0.02}%2C${currentLocation.latitude + 0.015}&layer=mapnik&marker=${currentLocation.latitude}%2C${currentLocation.longitude}`}
                className="h-52 w-full border-0"
                loading="lazy"
              />
              <div className="px-4 py-3 bg-gray-950/80 text-xs text-gray-400">Map view of your current delivery location.</div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 lg:p-6"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiMapPin className="text-green-400" />
              Nearby Riders
            </h2>
            <p className="text-gray-400 text-sm">
              {currentLocation
                ? 'Riders close to your current location can be reached faster for deliveries.'
                : 'Enable location access to discover riders near you.'}
            </p>
          </div>
          <span className="text-sm text-gray-400">
            {nearbyLoading ? 'Scanning...' : `${sortedNearbyRiders.length} available`}
          </span>
        </div>

        {nearbyLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : sortedNearbyRiders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/30 p-6 text-center text-gray-400">
            No riders are currently available near your location yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedNearbyRiders.slice(0, 6).map((rider) => (
              <div key={rider._id} className="rounded-xl border border-gray-700 bg-gray-800/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{rider.user?.name || 'Rider'}</p>
                    <p className="text-gray-400 text-sm">{rider.vehicleType || 'Delivery partner'}</p>
                  </div>
                  <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                    {rider.isAvailable ? 'Online' : 'Busy'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-500" />
                    <span>{rider.distanceKm ? `${rider.distanceKm.toFixed(1)} km away` : 'Distance unavailable'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-500" />
                    <span>{rider.user?.phone || 'Contact via chat'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-400" />
                    <span>4.9 rating</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

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
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[delivery.status]}`}>
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