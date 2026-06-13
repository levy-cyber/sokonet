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
  const [showChatList, setShowChatList] = useState(false);
  const [isPublicChat, setIsPublicChat] = useState(false);
  const [publicMessage, setPublicMessage] = useState('');
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
      setConversations([]);
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

  const handleSendPublicMessage = () => {
    if (!publicMessage.trim()) return;
    
    if (socket) {
      socket.emit('publicMessage', {
        content: publicMessage,
        sender: 'user',
        timestamp: new Date(),
      });
      setPublicMessage('');
    }
  };

  const toggleChatList = () => {
    setShowChatList(!showChatList);
  };

  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex gap-6"
      >
        {/* Mobile Chat Toggle */}
        <button
          onClick={toggleChatList}
          className="md:hidden fixed bottom-20 right-4 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg"
        >
          <Send className="w-6 h-6" />
        </button>

        {/* Conversations List - Mobile Pop-up */}
        <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden ${showChatList ? 'block' : 'hidden'}`} onClick={toggleChatList}>
          <div className="absolute right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Messages</h2>
              <button onClick={toggleChatList} className="text-gray-400 hover:text-white">
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setShowChatList(false);
                  }}
                  className="p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <img src={conversation.participant.avatar} alt={conversation.participant.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-white font-medium">{conversation.participant.name}</p>
                      <p className="text-gray-400 text-sm truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversations List - Desktop */}
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
          <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Public Chatroom</h3>
                <button
                  onClick={() => setIsPublicChat(!isPublicChat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isPublicChat 
                      ? 'bg-green-500 text-black' 
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isPublicChat ? 'Public Mode' : 'Private Mode'}
                </button>
              </div>
            </div>

            {isPublicChat ? (
              <div className="flex-1 flex flex-col p-4">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  <div className="text-center text-gray-400 text-sm">
                    <p>Public chatroom - All users can see these messages</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={publicMessage}
                    onChange={(e) => setPublicMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendPublicMessage()}
                    placeholder="Post a message for all users..."
                    className="flex-1 bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendPublicMessage}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                  <p className="text-gray-400">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatPage;
