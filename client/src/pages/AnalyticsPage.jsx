import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, ShoppingBag, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const AnalyticsPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 3280000,
    totalOrders: 12500,
    totalUsers: 8500,
    activeProducts: 450,
    revenueGrowth: 22.5,
    ordersGrowth: 15.3,
    usersGrowth: 18.7,
    productsGrowth: 12.1,
  });

  const [timeRange, setTimeRange] = useState('7d');

  const revenueData = {
    '7d': [
      { name: 'Mon', revenue: 450000, orders: 150 },
      { name: 'Tue', revenue: 520000, orders: 180 },
      { name: 'Wed', revenue: 480000, orders: 165 },
      { name: 'Thu', revenue: 610000, orders: 210 },
      { name: 'Fri', revenue: 550000, orders: 190 },
      { name: 'Sat', revenue: 670000, orders: 230 },
      { name: 'Sun', revenue: 590000, orders: 200 },
    ],
    '30d': [
      { name: 'Week 1', revenue: 3200000, orders: 1100 },
      { name: 'Week 2', revenue: 3500000, orders: 1250 },
      { name: 'Week 3', revenue: 3800000, orders: 1350 },
      { name: 'Week 4', revenue: 4200000, orders: 1500 },
    ],
    '90d': [
      { name: 'Month 1', revenue: 12000000, orders: 4200 },
      { name: 'Month 2', revenue: 14500000, orders: 5100 },
      { name: 'Month 3', revenue: 16800000, orders: 5900 },
    ],
  };

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#00C853' },
    { name: 'Fashion', value: 25, color: '#2196F3' },
    { name: 'Home & Garden', value: 20, color: '#FF9800' },
    { name: 'Sports', value: 12, color: '#9C27B0' },
    { name: 'Beauty', value: 8, color: '#E91E63' },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro Max', sales: 450, revenue: 83250000 },
    { name: 'Samsung Galaxy S24', sales: 380, revenue: 66500000 },
    { name: 'MacBook Pro 16"', sales: 220, revenue: 70400000 },
    { name: 'Sony WH-1000XM5', sales: 580, revenue: 26100000 },
    { name: 'Nike Air Max', sales: 890, revenue: 16465000 },
  ];

  const topSellers = [
    { name: 'TechStore Kenya', sales: 1250, revenue: 185000000, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100' },
    { name: 'Mobile Hub', sales: 980, revenue: 142000000, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { name: 'Apple Store KE', sales: 750, revenue: 168000000, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    { name: 'Audio World', sales: 620, revenue: 27900000, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your platform performance and metrics</p>
        </div>

        <div className="flex gap-3">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>{stats.revenueGrowth}%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-white">KES {stats.totalRevenue.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>{stats.ordersGrowth}%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-white">{stats.totalOrders.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>{stats.usersGrowth}%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Package className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>{stats.productsGrowth}%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Active Products</p>
          <p className="text-2xl font-bold text-white">{stats.activeProducts}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#00C853" fill="#00C853" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="orders" fill="#2196F3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-400 text-sm">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">{product.sales} sales</p>
                  </div>
                </div>
                <p className="text-green-400 font-semibold">KES {product.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Sellers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Top Sellers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topSellers.map((seller, index) => (
            <div key={index} className="p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-white font-medium">{seller.name}</p>
                  <p className="text-gray-400 text-sm">{seller.sales} sales</p>
                </div>
              </div>
              <p className="text-green-400 font-semibold">KES {seller.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
