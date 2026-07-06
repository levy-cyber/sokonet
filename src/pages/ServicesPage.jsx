import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTool, FiCalendar, FiClock, FiDollarSign, FiCheckCircle, FiPlus, FiStar, FiEdit, FiTrash2, FiBriefcase, FiX, FiPhone, FiPhoneCall } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import api from '../services/api';

const ServicesPage = () => {
  const [myServices, setMyServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeTab, setActiveTab] = useState('services');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/bookings')) {
      setActiveTab('bookings');
    }
  }, [location.pathname]);

  const fetchProviderData = async () => {
    try {
      const [servicesResponse, bookingsResponse] = await Promise.all([
        api.get('/services/mine'),
        api.get('/services/bookings'),
      ]);

      const servicesData = servicesResponse.data.data || [];
      const bookingsData = bookingsResponse.data.data || [];

      setMyServices(servicesData);
      setBookings(bookingsData);
      setTotalRevenue(bookingsData.reduce((sum, booking) => sum + Number(booking.amount || 0), 0));
    } catch (error) {
      console.error('Error fetching provider data:', error);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const activeServicesCount = myServices.filter((s) => s.available).length;
  const completionRate = totalBookings ? Math.round((completedBookings / totalBookings) * 100) : 0;
  const confirmationRate = totalBookings ? Math.round((confirmedBookings / totalBookings) * 100) : 0;
  const availabilityRate = myServices.length ? Math.round((activeServicesCount / myServices.length) * 100) : 0;

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/services/bookings/${bookingId}`, { status });
      setBookings(prev => prev.map((booking) => booking._id === bookingId ? { ...booking, status } : booking));
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const toggleServiceAvailability = (serviceId) => {
    setMyServices(prev =>
      prev.map(s => (s._id || s.id) === serviceId ? { ...s, available: !s.available } : s)
    );
  };

  const deleteService = (serviceId) => {
    setMyServices(prev => prev.filter(s => (s._id || s.id) !== serviceId));
  };

  const contactCustomer = (customerPhone) => {
    if (customerPhone) {
      alert('Phone calls are disabled inside Netsoko. Please use the in-app chat or SOS support instead.');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: e.target.serviceName.value,
        description: e.target.serviceDescription.value,
        category: e.target.serviceCategory.value,
        price: e.target.servicePrice.value,
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1e126?w=400',
        location: 'Nairobi',
        experience: '1 year',
      };

      const response = await api.post('/services', payload);
      if (response.data.success) {
        setMyServices((prev) => [response.data.data, ...prev]);
        setShowAddService(false);
      }
    } catch (error) {
      console.error('Failed to add service:', error);
      alert('Unable to add service right now.');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">My Services</h1>
            <p className="text-gray-400 text-sm lg:text-base">Manage your services and bookings</p>
          </div>
          <button
            onClick={() => setShowAddService(true)}
            className="flex items-center gap-2 bg-brand text-black font-semibold px-4 py-2 rounded-lg hover:bg-brand/90 transition-all"
          >
            <FiPlus />
            <span>Add Service</span>
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'services' ? 'bg-brand text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            My Services
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'bookings' ? 'bg-brand text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Service Bookings
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard title="Total Bookings" value={totalBookings} icon={FiCalendar} trend={`${totalBookings ? `${pendingBookings} pending` : '0'}`} trendUp={true} />
        <StatCard title="Total Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon={FiDollarSign} trend={`${completionRate}% completed`} trendUp={completionRate >= 50} />
        <StatCard title="Active Services" value={activeServicesCount} icon={FiTool} trend={`${availabilityRate}% available`} trendUp={availabilityRate >= 50} />
        <StatCard title="Completed Services" value={completedBookings} icon={FiCheckCircle} trend={`${completionRate}%`} trendUp={completionRate >= 50} />
      </div>

      {activeTab === 'services' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">My Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {myServices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/50 p-6 text-gray-400 text-center">
                No services found. Add a service to start receiving bookings.
              </div>
            ) : (
              myServices.map((service) => (
                <div key={service._id || service.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${service.image || 'https://images.unsplash.com/photo-1585704032915-c3400ca1e126?w=400'})` }}></div>
                  <div className="p-4 lg:p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full border border-brand/20">
                        {service.category}
                      </span>
                      <button
                        onClick={() => deleteService(service._id || service.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <FiStar className="fill" />
                        <span className="text-sm">{service.rating}</span>
                        <span className="text-gray-400 text-xs">({service.reviews})</span>
                      </div>
                      <span className="text-brand font-bold text-lg">KES {Number(service.price || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${service.available ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-700 text-gray-400'}`}>
                        {service.available ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        onClick={() => toggleServiceAvailability(service._id || service.id)}
                        className="text-gray-400 hover:text-white text-sm underline decoration-gray-400 hover:decoration-white"
                      >
                        Toggle
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <StatCard title="Total Bookings" value={totalBookings} icon={FiCalendar} trend={totalBookings ? `${pendingBookings} pending` : '0'} trendUp={true} />
            <StatCard title="Pending" value={pendingBookings} icon={FiClock} trend={totalBookings ? `${Math.round((pendingBookings / totalBookings) * 100)}%` : '0%'} trendUp={false} />
            <StatCard title="Confirmed" value={confirmedBookings} icon={FiCheckCircle} trend={totalBookings ? `${Math.round((confirmedBookings / totalBookings) * 100)}%` : '0%'} trendUp={true} />
            <StatCard title="Completed" value={completedBookings} icon={FiCheckCircle} trend={totalBookings ? `${completionRate}%` : '0%'} trendUp={completionRate >= 50} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Service Bookings</h2>
            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/50 p-6 text-gray-400 text-center">
                No bookings yet. Your customers will see bookings here once they request a service.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const service = myServices.find((s) => (s._id || s.id) === booking.service);
                  return (
                    <div key={booking._id || booking.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}>
                              {String(booking.status || 'pending').toUpperCase()}
                            </span>
                            <span className="text-gray-400 text-sm">Booking: #{booking._id || booking.id}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">{service?.name || 'Unknown Service'}</h3>
                          <div className="space-y-1">
                            <p className="text-gray-300 text-sm flex items-center gap-2">
                              <FiBriefcase />
                              {booking.customerName || 'Customer'}
                            </p>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <FiCalendar />
                              {new Date(booking.date || Date.now()).toLocaleDateString()} at {booking.time || 'ASAP'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                          <div className="text-right">
                            <p className="text-brand font-bold text-lg">KES {Number(booking.payment || booking.amount || 0).toLocaleString()}</p>
                            <p className="text-gray-400 text-xs">Service fee</p>
                          </div>
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => updateBookingStatus(booking._id || booking.id, 'confirmed')}
                                className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
                              >
                                Accept
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking._id || booking.id, 'completed')}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => contactCustomer(booking.customerPhone || '+254700000000')}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                            >
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add New Service</h3>
              <button
                onClick={() => setShowAddService(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Service Name</label>
                <input
                  name="serviceName"
                  type="text"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                  placeholder="e.g., Plumbing Repair"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Description</label>
                <textarea
                  name="serviceDescription"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                  placeholder="Describe your service..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Category</label>
                <select 
                  name="serviceCategory"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                >
                  <option>Home Services</option>
                  <option>Tech Support</option>
                  <option>Business Services</option>
                  <option>Education</option>
                  <option>Health & Wellness</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Price (KES)</label>
                <input
                  name="servicePrice"
                  type="number"
                  required
                  min="0"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                  placeholder="2500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddService(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-brand text-black rounded-lg font-medium hover:bg-brand/90 transition-all">
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;