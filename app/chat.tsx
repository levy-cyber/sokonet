import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Send, Search, MoreVertical } from 'lucide-react-native';

interface Conversation {
  _id: string;
  participant: {
    _id: string;
    name: string;
    avatar: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string; time: string }>>([]);

  useEffect(() => {
    // Mock data - replace with API call
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
        lastMessageTime: '2 min ago',
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
        lastMessageTime: '1 hour ago',
        unreadCount: 0,
      },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: message,
          sender: 'me',
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setMessage('');
    }
  };

  if (selectedConversation) {
    return (
      <View className="flex-1 bg-gray-900">
        <View className="p-4 border-b border-gray-800 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <Text className="text-green-400">← Back</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: selectedConversation.participant.avatar }}
              className="w-10 h-10 rounded-full"
            />
            <View>
              <Text className="text-white font-semibold">{selectedConversation.participant.name}</Text>
              <Text className="text-gray-400 text-sm">
                {selectedConversation.participant.online ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <MoreVertical size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {messages.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400">No messages yet</Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                className={`mb-3 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <View
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'me' ? 'bg-green-500' : 'bg-gray-800'
                  }`}
                >
                  <Text className="text-white">{msg.text}</Text>
                  <Text className={`text-xs ${msg.sender === 'me' ? 'text-green-100' : 'text-gray-400'}`}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View className="p-4 border-t border-gray-800 flex-row gap-3">
          <TextInput
            className="flex-1 bg-gray-800 text-white rounded-lg p-3"
            placeholder="Type a message..."
            placeholderTextColor="#6B7280"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity onPress={handleSendMessage} className="bg-green-500 rounded-lg p-3">
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-4">Messages</Text>

          <View className="bg-gray-800 rounded-lg p-3 mb-4 flex-row items-center gap-3">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Search conversations..."
              placeholderTextColor="#6B7280"
            />
          </View>

          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation._id}
              onPress={() => setSelectedConversation(conversation)}
              className="bg-gray-800 rounded-xl p-4 mb-3"
            >
              <View className="flex-row items-center gap-3">
                <View className="relative">
                  <Image
                    source={{ uri: conversation.participant.avatar }}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.participant.online && (
                    <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-white font-semibold">{conversation.participant.name}</Text>
                    <Text className="text-gray-500 text-xs">{conversation.lastMessageTime}</Text>
                  </View>
                  <Text className="text-gray-400 text-sm" numberOfLines={1}>
                    {conversation.lastMessage}
                  </Text>
                </View>
                {conversation.unreadCount > 0 && (
                  <View className="w-5 h-5 bg-green-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-semibold">{conversation.unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
