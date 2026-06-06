import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import EscrowCard from '../components/EscrowCard';
import api from '../services/api';

const EscrowPage = () => {
  const [escrowTransactions, setEscrowTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEscrowTransactions();
  }, []);

  const fetchEscrowTransactions = async () => {
    try {
      const response = await api.get('/escrow');
      setEscrowTransactions(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching escrow transactions:', error);
      setLoading(false);
      // Mock data
      setEscrowTransactions([
        {
          _id: '1',
          orderId: 'ORD-001',
          amount: 185000,
          status: 'held',
          buyer: { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
          seller: { name: 'TechStore Kenya', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100' },
          product: 'iPhone 15 Pro Max',
          createdAt: '2024-01-15T10:30:00Z',
          releaseDate: '2024-01-22T10:30:00Z',
        },
        {
          _id: '2',
          orderId: 'ORD-002',
          amount: 45000,
          status: 'released',
          buyer: { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
          seller: { name: 'Audio World', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
          product: 'Sony WH-1000XM5',
          createdAt: '2024-01-10T14:20:00Z',
          releaseDate: '2024-01-17T14:20:00Z',
        },
        {
          _id: '3',
          orderId: 'ORD-003',
          amount: 25000,
          status: 'refunded',
          buyer: { name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
          seller: { name: 'Luxury Fashion', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
          product: 'Designer Handbag',
          createdAt: '2024-01-05T09:15:00Z',
          releaseDate: '2024-01-12T09:15:00Z',
        },
      ]);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? escrowTransactions 
    : escrowTransactions.filter(t => t.status === filter);

  const stats = {
    total: escrowTransactions.length,
    held: escrowTransactions.filter(t => t.status === 'held').length,
    released: escrowTransactions.filter(t => t.status === 'released').length,
    refunded: escrowTransactions.filter(t => t.status === 'refunded').length,
    totalAmount: escrowTransactions.reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Escrow Accounts</h1>
        <p className="text-gray-400">Manage your secure payment transactions</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Transactions</p>
          <p className="text-green-400 font-semibold mt-2">KES {stats.totalAmount.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-white">{stats.held}</span>
          </div>
          <p className="text-gray-400 text-sm">In Escrow</p>
          <p className="text-yellow-400 font-semibold mt-2">Pending Release</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-white">{stats.released}</span>
          </div>
          <p className="text-gray-400 text-sm">Released</p>
          <p className="text-green-400 font-semibold mt-2">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-white">{stats.refunded}</span>
          </div>
          <p className="text-gray-400 text-sm">Refunded</p>
          <p className="text-red-400 font-semibold mt-2">Returned</p>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        {['all', 'held', 'released', 'refunded'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              filter === status
                ? 'bg-green-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {status}
          </button>
        ))}
      </motion.div>

      {/* Transactions List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
          <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No transactions found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {filteredTransactions.map((transaction) => (
            <EscrowCard key={transaction._id} transaction={transaction} />
          ))}
        </motion.div>
      )}

      {/* Escrow Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-2">How Escrow Works</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>• Buyer pays into escrow - funds are securely held</li>
              <li>• Seller ships the product to buyer</li>
              <li>• Buyer confirms receipt and satisfaction</li>
              <li>• Funds are released to seller</li>
              <li>• If there's an issue, refund can be initiated</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EscrowPage;
