import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeadphones, FiSend, FiMessageSquare, FiClock, FiCheckCircle, FiAlertCircle } from 'lucide-react';
import api from '../services/api';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'Other',
    priority: 'medium',
    message: '',
  });
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/support/tickets');
      setTickets(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
      setTickets([]);
    }
  };

  const handleSubmitTicket = async () => {
    if (!newTicket.subject || !newTicket.message) {
      alert('Please fill in subject and message');
      return;
    }

    try {
      await api.post('/support/ticket', {
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        message: newTicket.message,
      });
      alert('Support ticket created successfully!');
      setNewTicket({ subject: '', category: 'Other', priority: 'medium', message: '' });
      setShowNewTicket(false);
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReply = async () => {
    if (!replyMessage || !selectedTicket) return;

    try {
      await api.post(`/support/ticket/${selectedTicket._id}/reply`, {
        message: replyMessage,
      });
      setReplyMessage('');
      fetchTickets();
      // Refresh selected ticket
      const updatedResponse = await api.get(`/support/ticket/${selectedTicket._id}`);
      setSelectedTicket(updatedResponse.data.data);
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'urgent': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex gap-6"
      >
        {/* Tickets List */}
        <div className={`bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex flex-col ${selectedTicket ? 'w-80 hidden md:flex' : 'w-full md:w-80'}`}>
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Support Tickets</h2>
            <button
              onClick={() => setShowNewTicket(true)}
              className="px-3 py-2 bg-green-500 text-black rounded-lg text-sm font-semibold hover:bg-green-600 transition-all"
            >
              + New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8">
                <FiHeadphones className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No support tickets yet</p>
                <button
                  onClick={() => setShowNewTicket(true)}
                  className="mt-4 text-green-400 hover:text-green-300 text-sm font-medium"
                >
                  Create your first ticket
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {tickets.map((ticket) => (
                  <motion.div
                    key={ticket._id}
                    whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedTicket?._id === ticket._id ? 'bg-gray-800/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className="text-gray-500 text-xs">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-white font-medium mb-1 truncate">{ticket.subject}</h3>
                    <p className="text-gray-400 text-sm truncate">{ticket.category}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ticket Details */}
        {selectedTicket ? (
          <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  ← Back
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                {new Date(selectedTicket.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedTicket.messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isSupport ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    msg.isSupport
                      ? 'bg-gray-800 text-white'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">
                        {msg.isSupport ? 'Support Team' : 'You'}
                      </span>
                      <span className="text-xs opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                  placeholder="Type your reply..."
                  className="flex-1 bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                />
                <button
                  onClick={handleReply}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <FiHeadphones className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Support Center</h3>
              <p className="text-gray-400 mb-4">Select a ticket or create a new one to get help</p>
              <button
                onClick={() => setShowNewTicket(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                Create New Ticket
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Create Support Ticket</h3>
              <button
                onClick={() => setShowNewTicket(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                >
                  <option value="Account">Account</option>
                  <option value="Payment">Payment</option>
                  <option value="Order">Order</option>
                  <option value="Product">Product</option>
                  <option value="Technical">Technical</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Message</label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTicket}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Submit Ticket
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
