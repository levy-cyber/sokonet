import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import ChatBox from '../components/ChatBox';
import api from '../services/api';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (selectedConversation && selectedConversation._id === message.conversationId) {
          // Update messages in selected conversation
        }
        fetchConversations();
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
      // Mock data
      setConversations([
        {
          _id: '1',
          participant: {
            _id: 'user1',
            name: 'TechStore Kenya',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
            online: true,
          },
          lastMessage: 'Your order has been shipped!',
          lastMessageTime: '2024-01-20T10:30:00Z',
          unreadCount: 2,
        },
        {
          _id: '2',
          participant: {
            _id: 'user2',
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            online: false,
          },
          lastMessage: 'Thanks for the quick response',
          lastMessageTime: '2024-01-19T14:20:00Z',
          unreadCount: 0,
        },
        {
          _id: '3',
          participant: {
            _id: 'user3',
            name: 'Audio World',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
            online: true,
          },
          lastMessage: 'Is the product still available?',
          lastMessageTime: '2024-01-18T09:15:00Z',
          unreadCount: 1,
        },
      ]);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex gap-6"
      >
        {/* Conversations List */}
        <div className={`bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex flex-col ${selectedConversation ? 'w-80 hidden md:flex' : 'w-full md:w-80'}`}>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No conversations found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation._id}
                    whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedConversation?._id === conversation._id ? 'bg-gray-800/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={conversation.participant.avatar}
                          alt={conversation.participant.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.participant.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white font-medium truncate">{conversation.participant.name}</p>
                          <span className="text-gray-500 text-xs">{timeAgo(conversation.lastMessageTime)}</span>
                        </div>
                        <p className="text-gray-400 text-sm truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{conversation.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  ← Back
                </button>
                <img
                  src={selectedConversation.participant.avatar}
                  alt={selectedConversation.participant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium">{selectedConversation.participant.name}</p>
                  <p className="text-gray-400 text-sm">
                    {selectedConversation.participant.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <ChatBox conversationId={selectedConversation._id} participant={selectedConversation.participant} />
          </div>
        ) : (
          <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatPage;
