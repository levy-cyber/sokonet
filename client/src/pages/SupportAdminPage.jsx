import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Activity, CheckCircle, AlertTriangle, ArrowRight, RefreshCcw } from 'lucide-react';
import api from '../services/api';

const SupportAdminPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/support/admin/tickets');
      setTickets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const response = await api.get(`/support/ticket/${ticket._id}`);
      setSelectedTicket(response.data.data);
    } catch (error) {
      console.error('Error loading ticket details:', error);
    }
  };

  const handleTicketAction = async (status) => {
    if (!selectedTicket) return;
    setActionLoading(true);
    try {
      await api.put(`/support/ticket/${selectedTicket._id}/status`, { status });
      await fetchTickets();
      const response = await api.get(`/support/ticket/${selectedTicket._id}`);
      setSelectedTicket(response.data.data);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Unable to update ticket status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    setActionLoading(true);
    try {
      await api.post(`/support/ticket/${selectedTicket._id}/reply`, {
        message: replyMessage.trim(),
      });
      setReplyMessage('');
      await fetchTickets();
      const response = await api.get(`/support/ticket/${selectedTicket._id}`);
      setSelectedTicket(response.data.data);
    } catch (error) {
      console.error('Error replying to ticket:', error);
      alert('Failed to send reply.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/15 text-blue-300';
      case 'in_progress':
        return 'bg-yellow-500/15 text-yellow-300';
      case 'resolved':
        return 'bg-green-500/15 text-green-300';
      case 'closed':
        return 'bg-gray-500/15 text-gray-300';
      default:
        return 'bg-gray-500/15 text-gray-300';
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex gap-6"
      >
        <div className="w-full md:w-96 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Support Dashboard</h2>
              <p className="text-gray-400 text-sm">Manage incoming tickets and respond quickly.</p>
            </div>
            <button
              onClick={fetchTickets}
              className="inline-flex items-center gap-2 rounded-2xl bg-green-500/10 text-green-300 px-4 py-2 text-sm hover:bg-green-500/20 transition-all"
            >
              <RefreshCcw className="w-4 h-4" /> Refresh
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-gray-400 text-center py-12">
                <MessageSquare className="mx-auto mb-4 w-12 h-12 text-gray-500" />
                <p>No tickets found yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <button
                    key={ticket._id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`w-full text-left p-4 rounded-3xl border ${selectedTicket?._id === ticket._id ? 'border-green-500/40 bg-green-500/10' : 'border-gray-800/80 bg-gray-900/50'} transition-all hover:border-green-500/40`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-white font-semibold">{ticket.subject}</h3>
                        <p className="text-gray-400 text-sm truncate mt-1">{ticket.category} · {ticket.priority}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>{ticket.user?.name || 'Unknown user'}</span>
                      <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              <div className="p-5 border-b border-gray-700 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{selectedTicket.subject}</h2>
                    <p className="text-gray-400 text-sm">From {selectedTicket.user?.name || selectedTicket.user?.email}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                  <div className="rounded-2xl bg-gray-800/60 p-3">
                    <p className="text-[11px] uppercase tracking-widest">Priority</p>
                    <p className="mt-1 text-white font-semibold">{selectedTicket.priority}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-800/60 p-3">
                    <p className="text-[11px] uppercase tracking-widest">Category</p>
                    <p className="mt-1 text-white font-semibold">{selectedTicket.category}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selectedTicket.messages?.map((message, index) => (
                  <div
                    key={index}
                    className={`rounded-3xl p-4 ${message.isSupport ? 'bg-green-500/10 text-green-100 self-start' : 'bg-gray-800/70 text-gray-100 self-end'} max-w-[90%]`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2 text-[11px] uppercase tracking-[0.2em] text-gray-400">
                      <span>{message.isSupport ? 'Support' : 'User'}</span>
                      <span>{new Date(message.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm leading-6">{message.content}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleTicketAction('in_progress')}
                    disabled={actionLoading || selectedTicket.status === 'in_progress'}
                    className="rounded-2xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-sm text-white hover:border-yellow-400 transition-all disabled:opacity-50"
                  >
                    <Activity className="inline-block w-4 h-4 mr-2" /> Mark In Progress
                  </button>
                  <button
                    onClick={() => handleTicketAction('resolved')}
                    disabled={actionLoading || selectedTicket.status === 'resolved'}
                    className="rounded-2xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-sm text-white hover:border-green-400 transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="inline-block w-4 h-4 mr-2" /> Resolve
                  </button>
                  <button
                    onClick={() => handleTicketAction('closed')}
                    disabled={actionLoading || selectedTicket.status === 'closed'}
                    className="rounded-2xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-sm text-white hover:border-red-400 transition-all disabled:opacity-50"
                  >
                    <AlertTriangle className="inline-block w-4 h-4 mr-2" /> Close Ticket
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Reply to ticket</label>
                  <textarea
                    rows={4}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your response here..."
                    className="w-full rounded-3xl bg-gray-900/80 border border-gray-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500"
                  />
                  <button
                    onClick={handleReply}
                    disabled={actionLoading || !replyMessage.trim()}
                    className="w-full rounded-3xl bg-green-500 px-4 py-3 text-sm font-semibold text-black hover:bg-green-600 transition-all disabled:opacity-50"
                  >
                    <ArrowRight className="inline-block w-4 h-4 mr-2" /> Send Reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 p-6">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 w-14 h-14 text-gray-500" />
                <h3 className="text-xl font-semibold text-white">Select a ticket to manage</h3>
                <p className="mt-2 text-sm">Use the list on the left to view ticket details, reply, and update status.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SupportAdminPage;
