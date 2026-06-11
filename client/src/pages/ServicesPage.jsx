import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTool, FiCalendar, FiClock, FiDollarSign, FiCheckCircle, FiPlus, FiStar, FiEdit, FiTrash2, FiBriefcase, FiX, FiPhone, FiPhoneCall } from 'react-icons/fi';
import StatCard from '../components/StatCard';

const ServicesPage = () => {
  const [myServices, setMyServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Mock services data
    setMyServices([
      {
        id: 1,
        name: 'Plumbing Repair',
        description: 'Expert plumbing services for homes and businesses',
        category: 'Home Services',
        price: 2500,
        rating: 4.8,
        reviews: 124,
        available: true,
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1e126?w=400'
      },
      {
        id: 2,
        name: 'Electrical Installation',
        description: 'Professional electrical installation and maintenance',
        category: 'Home Services',
        price: 3500,
        rating: 4.6,
        reviews: 87,
        available: true,
        image: 'https://images.unsplash.com/photo-1621905250285-e0b248e3552a?w=400'
      },
      {
        id: 3,
        name: 'Mobile Repair',
        description: 'Smartphone and tablet repair services',
        category: 'Tech Support',
        price: 2000,
        rating: 4.9,
        reviews: 156,
        available: false,
        image: 'https://images.unsplash.com/photo-1585772492880-a009680628726?w=400'
      }
    ]);

    setBookings([
      {
        id: 1,
        serviceId: 1,
        customerName: 'John Kamau',
        customerPhone: '+254712345678',
        date: new Date(Date.now() + 86400000),
        time: '10:00 AM',
        status: 'confirmed',
        payment: 2500,
        createdAt: new Date()
      },
      {
        id: 2,
        serviceId: 2,
        customerName: 'Mary Wanjiku',
        customerPhone: '+254723456789',
        date: new Date(Date.now() + 172800000),
        time: '2:00 PM',
        status: 'pending',
        payment: 3500,
        createdAt: new Date()
      },
      {
        id: 3,
        serviceId: 3,
        customerName: 'James Omondi',
        customerPhone: '+254734567890',
        date: new Date(Date.now() - 86400000),
        time: '11:30 AM',
        status: 'completed',
        payment: 2000,
        createdAt: new Date(),
        rating: 5
      }
    ]);

    setTotalRevenue(7500);
  }, []);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status } : b)
    );
  };

  const toggleServiceAvailability = (serviceId) => {
    setMyServices(prev =>
      prev.map(s => s.id === serviceId ? { ...s, available: !s.available } : s)
    );
  };

  const deleteService = (serviceId) => {
    setMyServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const contactCustomer = (customerPhone) => {
    if (customerPhone) {
      window.location.href = `tel:${customerPhone}`;
    }
  };

  const handleAddService = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    const newService = {
      id: myServices.length + 1,
      name: e.target.serviceName.value,
      description: e.target.serviceDescription.value,
      category: e.target.serviceCategory.value,
      price: parseInt(e.target.servicePrice.value),
      rating: 0,
      reviews: 0,
      available: true,
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1e126?w=400'
    };
    setMyServices([newService, ...myServices]);
    setShowAddService(false);
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
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard title="Total Bookings" value={bookings.length} icon={FiCalendar} trend="+25.5%" trendUp={true} />
        <StatCard title="Total Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon={FiDollarSign} trend="+18.2%" trendUp={true} />
        <StatCard title="Active Services" value={myServices.filter(s => s.available).length} icon={FiTool} trend="+8.7%" trendUp={true} />
        <StatCard title="Completed Services" value={bookings.filter(b => b.status === 'completed').length} icon={FiCheckCircle} trend="+22.1%" trendUp={true} />
      </div>

      {/* My Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">My Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {myServices.map((service) => (
            <div key={service.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }}></div>
              <div className="p-4 lg:p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full border border-brand/20">
                    {service.category}
                  </span>
                  <button
                    onClick={() => deleteService(service.id)}
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
                  <span className="text-brand font-bold text-lg">KES {service.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${service.available ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-700 text-gray-400'}`}>
                    {service.available ? 'Available' : 'Unavailable'}
                  </span>
                  <button
                    onClick={() => toggleServiceAvailability(service.id)}
                    className="text-gray-400 hover:text-white text-sm underline decoration-gray-400 hover:decoration-white"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Service Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Service Bookings</h2>
        <div className="space-y-4">
          {bookings.map((booking) => {
            const service = myServices.find(s => s.id === booking.serviceId);
            return (
              <div key={booking.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">Booking: #{booking.id}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{service?.name || 'Unknown Service'}</h3>
                    <div className="space-y-1">
                      <p className="text-gray-300 text-sm flex items-center gap-2">
                        <FiBriefcase />
                        {booking.customerName}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <FiCalendar />
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    <div className="text-right">
                      <p className="text-brand font-bold text-lg">KES {booking.payment.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">Service fee</p>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
                        >
                          Accept
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                        >
                          Complete
                        </button>
                      )}
                      <button 
                        onClick={() => contactCustomer(booking.customerPhone)}
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
      </motion.div>

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