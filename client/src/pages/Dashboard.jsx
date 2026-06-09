import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    walletBalance: 0,
    activeProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
  });

  const revenueData = [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 67000 },
  ];

  const orderData = [
    { name: 'Completed', value: 450, color: '#00C853' },
    { name: 'Pending', value: 120, color: '#FFA726' },
    { name: 'Cancelled', value: 30, color: '#EF5350' },
  ];

  useEffect(() => {
    // Fetch dashboard stats from API
    const fetchStats = async () => {
      try {
        // Simulated data - replace with actual API call
        setStats({
          totalOrders: 600,
          totalRevenue: 328000,
          walletBalance: 125000,
          activeProducts: 45,
          totalUsers: 1250,
          pendingOrders: 120,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'User'}</h1>
        <p className="text-gray-400">Here's what's happening with your SokoNet account today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={null}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Total Revenue"
          value={`KES ${stats.totalRevenue.toLocaleString()}`}
          icon={null}
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard
          title="Wallet Balance"
          value={`KES ${stats.walletBalance.toLocaleString()}`}
          icon={null}
          trend="+15.3%"
          trendUp={true}
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          icon={null}
          trend="+5.7%"
          trendUp={true}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={null}
          trend="+22.1%"
          trendUp={true}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={null}
          trend="-3.2%"
          trendUp={false}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#00C853" strokeWidth={2} dot={{ fill: '#00C853' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {orderData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-400 text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New order received', item: 'iPhone 15 Pro Max', time: '2 minutes ago', status: 'success' },
            { action: 'Payment received', item: 'KES 45,000', time: '15 minutes ago', status: 'success' },
            { action: 'Product updated', item: 'Samsung Galaxy S24', time: '1 hour ago', status: 'info' },
            { action: 'Order shipped', item: 'Order #12345', time: '2 hours ago', status: 'success' },
            { action: 'New message', item: 'From customer John', time: '3 hours ago', status: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.item}</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;