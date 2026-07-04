import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'food', name: 'Food & Beverage' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports' },
    { id: 'beauty', name: 'Beauty' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
      // Mock data for demo
      setProducts([
        {
          _id: '1',
          name: 'iPhone 15 Pro Max',
          price: 185000,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
          rating: 4.8,
          reviews: 234,
          seller: { name: 'TechStore Kenya', rating: 4.9 },
        },
        {
          _id: '2',
          name: 'Samsung Galaxy S24 Ultra',
          price: 175000,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
          rating: 4.7,
          reviews: 189,
          seller: { name: 'Mobile Hub', rating: 4.8 },
        },
        {
          _id: '3',
          name: 'MacBook Pro 16"',
          price: 320000,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          rating: 4.9,
          reviews: 312,
          seller: { name: 'Apple Store KE', rating: 5.0 },
        },
        {
          _id: '4',
          name: 'Nike Air Max 270',
          price: 18500,
          category: 'fashion',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          rating: 4.6,
          reviews: 156,
          seller: { name: 'Sneaker Palace', rating: 4.7 },
        },
        {
          _id: '5',
          name: 'Sony WH-1000XM5',
          price: 45000,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
          rating: 4.8,
          reviews: 278,
          seller: { name: 'Audio World', rating: 4.9 },
        },
        {
          _id: '6',
          name: 'Designer Handbag',
          price: 25000,
          category: 'fashion',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
          rating: 4.5,
          reviews: 89,
          seller: { name: 'Luxury Fashion', rating: 4.6 },
        },
        {
          _id: '7',
          name: 'Mama Mboga Fresh Vegetables',
          price: 1200,
          category: 'food',
          image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400',
          rating: 4.7,
          reviews: 58,
          seller: { name: 'Mama Mboga', rating: 4.8 },
        },
        {
          _id: '8',
          name: 'Kibandaski Special Chapati Pack',
          price: 450,
          category: 'food',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
          rating: 4.9,
          reviews: 72,
          seller: { name: 'Kibandaski Kitchen', rating: 4.9 },
        },
      ]);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Discover amazing products from trusted sellers</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5 text-gray-400" /> : <Grid className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No products found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} viewMode={viewMode} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Marketplace;
