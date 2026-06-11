import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTool, FiCalendar, FiDollarSign, FiStar, FiSearch, FiFilter } from 'react-icons/fi';

const ServicesMarketplace = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Home Services', 'Tech Support', 'Business Services', 'Education', 'Health & Wellness'];

  useEffect(() => {
    // Mock services data for marketplace
    setServices([
      {
        id: 1,
        name: 'Plumbing Repair',
        provider: 'QuickFix Services',
        description: 'Expert plumbing services for homes and businesses including repairs, installations, and maintenance.',
        category: 'Home Services',
        price: 2500,
        rating: 4.8,
        reviews: 124,
        available: true,
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1e126?w=400',
        location: 'Nairobi',
        experience: '5 years'
      },
      {
        id: 2,
        name: 'Electrical Installation',
        provider: 'Spark Electrical',
        description: 'Professional electrical installation and maintenance for homes and businesses.',
        category: 'Home Services',
        price: 3500,
        rating: 4.6,
        reviews: 87,
        available: true,
        image: 'https://images.unsplash.com/photo-1621905250285-e0b248e3552a?w=400',
        location: 'Nairobi',
        experience: '7 years'
      },
      {
        id: 3,
        name: 'Mobile Repair',
        provider: 'Tech Doctor Kenya',
        description: 'Smartphone and tablet repair services including screen replacement, battery change, and software issues.',
        category: 'Tech Support',
        price: 2000,
        rating: 4.9,
        reviews: 156,
        available: true,
        image: 'https://images.unsplash.com/photo-1585772492880-a009680628726?w=400',
        location: 'Mombasa',
        experience: '3 years'
      },
      {
        id: 4,
        name: 'Web Development',
        provider: 'DevStudio',
        description: 'Professional website development services including e-commerce, business sites, and custom web applications.',
        category: 'Business Services',
        price: 15000,
        rating: 4.7,
        reviews: 92,
        available: true,
        image: 'https://images.unsplash.com/photo-1460925895913-afd46836b574?w=400',
        location: 'Nairobi',
        experience: '10 years'
      },
      {
        id: 5,
        name: 'Math Tutoring',
        provider: 'EduConnect',
        description: 'Professional mathematics tutoring for primary and secondary school students.',
        category: 'Education',
        price: 1000,
        rating: 4.9,
        reviews: 78,
        available: true,
        image: 'https://images.unsplash.com/photo-1596496053021-9d5f22b9e597?w=400',
        location: 'Kisumu',
        experience: '6 years'
      },
      {
        id: 6,
        name: 'Fitness Training',
        provider: 'FitLife Gym',
        description: 'Personal fitness training and nutrition coaching for all fitness levels.',
        category: 'Health & Wellness',
        price: 1500,
        rating: 4.8,
        reviews: 65,
        available: true,
        image: 'https://images.unsplash.com/photo-1517836357463-d25d6d3af9f3?w=400',
        location: 'Nairobi',
        experience: '8 years'
      }
    ]);
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const bookService = (serviceId) => {
    alert(`Booking request for ${services.find(s => s.id === serviceId)?.name}\n\nIn production, this would:\n1. Check availability\n2. Select date/time\n3. Process payment via wallet or M-Pesa\n4. Send confirmation to provider`);
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
            <div key={service.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }}></div>
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
                <p className="text-gray-400 text-sm mb-1">{service.provider}</p>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                  <span className="flex items-center gap-1">
                    <FiDollarSign />
                    KES {service.price.toLocaleString()}
                  </span>
                  <span>•</span>
                  <span>{service.location}</span>
                  <span>•</span>
                  <span>{service.experience} experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => bookService(service.id)}
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