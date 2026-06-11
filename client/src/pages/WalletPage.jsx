import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, Smartphone, X } from 'lucide-react';
import WalletCard from '../components/WalletCard';
import api from '../services/api';

const WalletPage = () => {
  const [wallet, setWallet] = useState({
    balance: 125000,
    currency: 'KES',
    pendingBalance: 15000,
  });
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankDetails, setBankDetails] = useState({ accountNumber: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await api.get('/wallet');
      setWallet(response.data.data || wallet);
      const transactionsResponse = await api.get('/wallet/transactions');
      setTransactions(transactionsResponse.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setLoading(false);
      // Mock data
      setTransactions([
        {
          _id: '1',
          type: 'deposit',
          amount: 50000,
          status: 'completed',
          description: 'M-Pesa Deposit',
          createdAt: '2024-01-20T10:30:00Z',
        },
        {
          _id: '2',
          type: 'withdrawal',
          amount: 20000,
          status: 'completed',
          description: 'Bank Withdrawal',
          createdAt: '2024-01-18T14:20:00Z',
        },
        {
          _id: '3',
          type: 'payment',
          amount: 185000,
          status: 'completed',
          description: 'Order Payment - iPhone 15 Pro Max',
          createdAt: '2024-01-15T09:15:00Z',
        },
        {
          _id: '4',
          type: 'refund',
          amount: 45000,
          status: 'pending',
          description: 'Escrow Refund',
          createdAt: '2024-01-12T16:45:00Z',
        },
        {
          _id: '5',
          type: 'deposit',
          amount: 100000,
          status: 'completed',
          description: 'M-Pesa Deposit',
          createdAt: '2024-01-10T11:00:00Z',
        },
      ]);
    }
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(amount)) return;
    try {
      await api.post('/wallet/deposit', { amount: parseFloat(amount) });
      alert('Deposit initiated via M-Pesa');
      setAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed');
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount)) return;
    try {
      await api.post('/wallet/withdraw', { amount: parseFloat(amount) });
      alert('Withdrawal request submitted');
      setAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed');
    }
  };

  const handleBankTransfer = async () => {
    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }
    if (!bankDetails.accountNumber) {
      alert('Please enter bank account number');
      return;
    }
    if (parseFloat(amount) > wallet.balance) {
      alert('Insufficient balance');
      return;
    }

    setProcessing(true);
    try {
      await api.post('/wallet/bank-transfer', {
        amount: parseFloat(amount),
        accountNumber: bankDetails.accountNumber
      });
      alert(`Transfer of KES ${amount} to account ${bankDetails.accountNumber} initiated via Paybill 247247`);
      setShowBankModal(false);
      setBankDetails({ accountNumber: '' });
      setAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Bank transfer error:', error);
      alert('Bank transfer failed');
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'payment':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'refund':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      default:
        return <History className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return 'text-green-400';
      case 'withdrawal':
      case 'payment':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Digital Wallet</h1>
        <p className="text-gray-400">Manage your funds and transactions</p>
      </motion.div>

      {/* Wallet Card */}
      <WalletCard balance={wallet.balance} currency={wallet.currency} onDeposit={handleDeposit} onWithdraw={handleWithdraw} />

      {/* Action Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3"
      >
        {['overview', 'deposit', 'withdraw'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-green-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Deposit/Withdraw Forms */}
      {activeTab === 'deposit' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Deposit Funds</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Amount (KES)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all">
                <Smartphone className="w-6 h-6 text-green-500" />
                <div className="text-left">
                  <p className="text-white font-medium">M-Pesa</p>
                  <p className="text-gray-400 text-sm">Instant deposit</p>
                </div>
              </button>
              <button 
                onClick={() => setShowBankModal(true)}
                className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <CreditCard className="w-6 h-6 text-blue-500" />
                <div className="text-left">
                  <p className="text-white font-medium">Card Payment</p>
                  <p className="text-gray-400 text-sm">Visa/Mastercard</p>
                </div>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeposit}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
            >
              Deposit Now
            </motion.button>
          </div>
        </motion.div>
      )}

      {activeTab === 'withdraw' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Withdraw Funds</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Amount (KES)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                max={wallet.balance}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
              />
              <p className="text-gray-400 text-sm mt-2">Available: KES {wallet.balance.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all">
                <Smartphone className="w-6 h-6 text-green-500" />
                <div className="text-left">
                  <p className="text-white font-medium">M-Pesa</p>
                  <p className="text-gray-400 text-sm">To your phone</p>
                </div>
              </button>
              <button 
                onClick={() => setShowBankModal(true)}
                className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <CreditCard className="w-6 h-6 text-blue-500" />
                <div className="text-left">
                  <p className="text-white font-medium">Bank Transfer</p>
                  <p className="text-gray-400 text-sm">1-3 business days</p>
                </div>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWithdraw}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
            >
              Withdraw Now
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Transaction History */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Transaction History</h3>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                      KES {transaction.amount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Bank Details Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Bank Transfer Details</h3>
              <button
                onClick={() => setShowBankModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Paybill Number</p>
                <p className="text-white font-mono text-lg">247247</p>
                <p className="text-gray-400 text-sm mt-2">Account Number</p>
                <p className="text-white font-mono text-lg">0870185429080</p>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Your Bank Account Number</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ accountNumber: e.target.value })}
                  placeholder="Enter your bank account number"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Amount (KES)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={wallet.balance}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                />
                <p className="text-gray-400 text-sm mt-2">Available: KES {wallet.balance.toLocaleString()}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBankTransfer}
                disabled={processing}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Transfer Funds'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
