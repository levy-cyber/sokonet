import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTool, FiCalendar, FiDollarSign, FiStar, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/api';

const ServicesMarketplace = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Home Services', 'Tech Support', 'Business Services', 'Education', 'Health & Wellness'];

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const name = service.name || '';
    const description = service.description || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const bookService = async (serviceId) => {
    try {
      await api.post(`/services/${serviceId}/book`, {
        date: new Date().toISOString(),
        time: 'ASAP',
        notes: 'Booked from Services Marketplace',
      });
      alert('Booking request submitted successfully.');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking could not be completed right now.');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Services Marketplace</h1>
        <p className="text-gray-400 text-sm lg:text-base">Browse and book professional services from verified providers</p>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search services by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-brand text-black'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredServices.map((service) => (
            <div key={service._id || service.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${service.image || 'https://images.unsplash.com/photo-1585704032915-c3400ca1e126?w=400'})` }}></div>
              <div className="p-4 lg:p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full border border-brand/20">
                    {service.category}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <FiStar className="fill text-yellow-400" />
                    {service.rating}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{service.provider || 'Verified provider'}</p>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                  <span className="flex items-center gap-1">
                    <FiDollarSign />
                    KES {Number(service.price || 0).toLocaleString()}
                  </span>
                  <span>•</span>
                  <span>{service.location || 'Nairobi'}</span>
                  <span>•</span>
                  <span>{service.experience || 'Experienced'} experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => bookService(service._id || service.id)}
                    className="flex-1 bg-brand text-black font-semibold py-2 rounded-lg hover:bg-brand/90 transition-all"
                  >
                    Book Service
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ServicesMarketplace;