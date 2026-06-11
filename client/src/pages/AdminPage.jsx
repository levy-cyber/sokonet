import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, AlertTriangle, CheckCircle, XCircle, Search, Filter, MoreVertical, Ban, Shield, Wallet, Plus } from 'lucide-react';
import api from '../services/api';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [companyTill, setCompanyTill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [depositing, setDepositing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'users') {
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data.data || []);
      } else if (activeTab === 'till') {
        const tillRes = await api.get('/admin/till');
        setCompanyTill(tillRes.data.data || null);
      } else {
        const [usersRes, productsRes, reportsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/products'),
          api.get('/reports'),
        ]);
        setUsers(usersRes.data.data || []);
        setProducts(productsRes.data.data || []);
        setReports(reportsRes.data.data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
      // Mock data
      if (activeTab === 'users') {
        setUsers([]);
      } else if (activeTab === 'till') {
        setCompanyTill({
          _id: 'till1',
          name: 'Company Till',
          balance: 0,
          currency: 'KES',
          transactions: [],
        });
      } else {
        setUsers([]);
        setProducts([]);
        setReports([]);
      }
    }
  };

  const handleDepositToTill = async () => {
    if (!depositAmount || isNaN(depositAmount)) {
      alert('Please enter a valid amount');
      return;
    }

    setDepositing(true);
    try {
      await api.post('/admin/till/deposit', {
        amount: parseFloat(depositAmount),
        description: depositDescription || 'Manual deposit',
      });
      alert('Deposit successful');
      setDepositAmount('');
      setDepositDescription('');
      fetchData();
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed');
    } finally {
      setDepositing(false);
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
    { id: 'till', label: 'Company Till', icon: <Wallet className="w-5 h-5" /> },
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
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-gray-500 text-xs">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Wallet Balance</p>
                    <p className="text-white font-semibold">KES {user.wallet?.balance?.toLocaleString() || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Bank Account</p>
                    <p className="text-white font-mono text-xs">{user.bankAccount?.account || 'N/A'}</p>
                  </div>
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

      {/* Company Till Tab */}
      {activeTab === 'till' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Company Till</h3>
              <Wallet className="w-6 h-6 text-green-500" />
            </div>
            {companyTill ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
                  <p className="text-gray-400 text-sm mb-2">Total Balance</p>
                  <p className="text-4xl font-bold text-white">KES {companyTill.balance?.toLocaleString() || 0}</p>
                  <p className="text-gray-400 text-sm mt-2">{companyTill.currency || 'KES'}</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Deposit Funds</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Amount (KES)</label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                      <input
                        type="text"
                        value={depositDescription}
                        onChange={(e) => setDepositDescription(e.target.value)}
                        placeholder="Enter description (optional)"
                        className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDepositToTill}
                      disabled={depositing}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      {depositing ? 'Processing...' : 'Deposit to Till'}
                    </motion.button>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Recent Transactions</h4>
                  <div className="space-y-3">
                    {companyTill.transactions?.slice(0, 5).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${transaction.type === 'deposit' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            {transaction.type === 'deposit' ? (
                              <DollarSign className="w-4 h-4 text-green-400" />
                            ) : (
                              <DollarSign className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{transaction.description || 'Transaction'}</p>
                            <p className="text-gray-400 text-xs">{new Date(transaction.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.type === 'deposit' ? '+' : '-'}KES {transaction.amount?.toLocaleString()}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!companyTill.transactions || companyTill.transactions.length === 0) && (
                      <p className="text-gray-400 text-center py-4">No transactions yet</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            )}
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
