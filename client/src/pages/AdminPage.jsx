import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, AlertTriangle, CheckCircle, XCircle, Search, Filter, MoreVertical, Ban, Shield } from 'lucide-react';
import api from '../services/api';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // In a real app, fetch based on activeTab
      const [usersRes, productsRes, reportsRes] = await Promise.all([
        api.get('/users'),
        api.get('/products'),
        api.get('/reports'),
      ]);
      setUsers(usersRes.data.data || []);
      setProducts(productsRes.data.data || []);
      setReports(reportsRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
      // Mock data
      setUsers([
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'buyer', status: 'active', createdAt: '2024-01-15' },
        { _id: '2', name: 'TechStore Kenya', email: 'tech@store.com', role: 'seller', status: 'active', createdAt: '2024-01-10' },
        { _id: '3', name: 'Mike Rider', email: 'mike@rider.com', role: 'rider', status: 'active', createdAt: '2024-01-08' },
        { _id: '4', name: 'Spam User', email: 'spam@bad.com', role: 'buyer', status: 'suspended', createdAt: '2024-01-05' },
      ]);
      setProducts([
        { _id: '1', name: 'iPhone 15 Pro Max', seller: 'TechStore Kenya', status: 'approved', price: 185000 },
        { _id: '2', name: 'Fake Product', seller: 'Spam Seller', status: 'pending', price: 50000 },
        { _id: '3', name: 'Samsung Galaxy S24', seller: 'Mobile Hub', status: 'approved', price: 175000 },
      ]);
      setReports([
        { _id: '1', type: 'product', item: 'Fake Product', reporter: 'John Doe', reason: 'Counterfeit item', status: 'pending' },
        { _id: '2', type: 'user', item: 'Spam User', reporter: 'Jane Smith', reason: 'Fraudulent activity', status: 'resolved' },
      ]);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await api.put(`/users/${userId}/${action}`);
      fetchData();
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  const handleProductAction = async (productId, action) => {
    try {
      await api.put(`/products/${productId}/${action}`);
      fetchData();
    } catch (error) {
      console.error('Error performing product action:', error);
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      await api.put(`/reports/${reportId}/${action}`);
      fetchData();
    } catch (error) {
      console.error('Error performing report action:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'resolved':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'suspended':
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Shield className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Admin Console</h1>
        <p className="text-gray-400">Manage users, products, and platform reports</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 border-b border-gray-700 pb-4"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">{users.length}</span>
            </div>
            <p className="text-gray-400">Total Users</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">{products.length}</span>
            </div>
            <p className="text-gray-400">Total Products</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">{reports.filter(r => r.status === 'pending').length}</span>
            </div>
            <p className="text-gray-400">Pending Reports</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">KES 3.2M</span>
            </div>
            <p className="text-gray-400">Platform Revenue</p>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">User Management</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium capitalize">
                    {user.role}
                  </span>
                  <div className="flex gap-2">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleUserAction(user._id, 'suspend')}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Suspend"
                      >
                        <Ban className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUserAction(user._id, 'activate')}
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                        title="Activate"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Product Moderation</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">{product.seller} • KES {product.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                  {product.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProductAction(product._id, 'approve')}
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleProductAction(product._id, 'reject')}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Reports & Disputes</h3>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${report.status === 'pending' ? 'text-yellow-500' : 'text-gray-500'}`} />
                    <div>
                      <p className="text-white font-medium capitalize">{report.type} Report</p>
                      <p className="text-gray-400 text-sm">{report.item}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Reporter</p>
                    <p className="text-white">{report.reporter}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reason</p>
                    <p className="text-white">{report.reason}</p>
                  </div>
                </div>
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReportAction(report._id, 'resolve')}
                      className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleReportAction(report._id, 'dismiss')}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPage;
