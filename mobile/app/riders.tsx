import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MapPin, Navigation, Clock, Phone, CheckCircle } from 'lucide-react-native';

interface Delivery {
  _id: string;
  orderId: string;
  pickup: string;
  dropoff: string;
  customer: { name: string; phone: string };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  distance: string;
  estimatedTime: string;
  fare: number;
}

export default function Riders() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [earnings] = useState({
    today: 4500,
    week: 28000,
    month: 115000,
  });

  useEffect(() => {
    // Mock data - replace with API call
    setDeliveries([
      {
        _id: 'DEL-001',
        orderId: 'ORD-001',
        pickup: 'Nairobi CBD',
        dropoff: 'Westlands',
        customer: { name: 'John Doe', phone: '+254712345678' },
        status: 'pending',
        distance: '5.2 km',
        estimatedTime: '15 min',
        fare: 350,
      },
      {
        _id: 'DEL-002',
        orderId: 'ORD-002',
        pickup: 'Mombasa Road',
        dropoff: 'Kilimani',
        customer: { name: 'Jane Smith', phone: '+254798765432' },
        status: 'in_progress',
        distance: '8.5 km',
        estimatedTime: '25 min',
        fare: 550,
      },
    ]);
  }, []);

  const handleAcceptDelivery = (deliveryId: string) => {
    // API call to accept delivery
    setDeliveries(deliveries.map(d => 
      d._id === deliveryId ? { ...d, status: 'in_progress' as const } : d
    ));
  };

  const handleCompleteDelivery = (deliveryId: string) => {
    // API call to complete delivery
    setDeliveries(deliveries.map(d => 
      d._id === deliveryId ? { ...d, status: 'completed' as const } : d
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredDeliveries = activeTab === 'dashboard' 
    ? deliveries.filter(d => d.status === 'in_progress' || d.status === 'pending')
    : deliveries.filter(d => d.status === activeTab);

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-4">Rider Dashboard</Text>

          <View className="grid grid-cols-3 gap-3 mb-6">
            <View className="bg-gray-800 rounded-xl p-4">
              <Text className="text-green-400 text-2xl font-bold">KES {earnings.today.toLocaleString()}</Text>
              <Text className="text-gray-400 text-sm">Today</Text>
            </View>
            <View className="bg-gray-800 rounded-xl p-4">
              <Text className="text-blue-400 text-2xl font-bold">KES {earnings.week.toLocaleString()}</Text>
              <Text className="text-gray-400 text-sm">This Week</Text>
            </View>
            <View className="bg-gray-800 rounded-xl p-4">
              <Text className="text-purple-400 text-2xl font-bold">KES {earnings.month.toLocaleString()}</Text>
              <Text className="text-gray-400 text-sm">This Month</Text>
            </View>
          </View>

          <View className="flex-row gap-2 mb-6 flex-wrap">
            {['dashboard', 'pending', 'in_progress', 'completed'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab ? 'bg-green-500' : 'bg-gray-800'
                }`}
              >
                <Text className={`capitalize ${
                  activeTab === tab ? 'text-white' : 'text-gray-400'
                }`}>
                  {tab.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredDeliveries.map((delivery) => (
            <View key={delivery._id} className="bg-gray-800 rounded-xl p-4 mb-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className={`px-3 py-1 rounded-full border ${getStatusColor(delivery.status)}`}>
                  <Text className="capitalize text-xs">{delivery.status.replace('_', ' ')}</Text>
                </View>
                <Text className="text-green-400 font-bold text-lg">KES {delivery.fare}</Text>
              </View>

              <View className="mb-3">
                <View className="flex-row items-start gap-2 mb-2">
                  <MapPin size={16} color="#00C853" />
                  <Text className="text-white">{delivery.pickup}</Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <Navigation size={16} color="#2196F3" />
                  <Text className="text-white">{delivery.dropoff}</Text>
                </View>
              </View>

              <View className="flex-row gap-4 mb-3">
                <View className="flex-row items-center gap-2">
                  <Clock size={16} color="#FF9800" />
                  <Text className="text-gray-400 text-sm">{delivery.estimatedTime}</Text>
                </View>
                <Text className="text-gray-400 text-sm">{delivery.distance}</Text>
              </View>

              <View className="border-t border-gray-700 pt-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full items-center justify-center">
                      <Text className="text-white font-bold">{delivery.customer.name.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text className="text-white font-medium">{delivery.customer.name}</Text>
                      <Text className="text-gray-400 text-sm">{delivery.customer.phone}</Text>
                    </View>
                  </View>
                  <TouchableOpacity className="bg-gray-700 rounded-lg p-2">
                    <Phone size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              {delivery.status === 'pending' && (
                <TouchableOpacity
                  onPress={() => handleAcceptDelivery(delivery._id)}
                  className="bg-green-500 rounded-lg p-3 mt-3"
                >
                  <Text className="text-white text-center font-semibold">Accept Delivery</Text>
                </TouchableOpacity>
              )}

              {delivery.status === 'in_progress' && (
                <TouchableOpacity
                  onPress={() => handleCompleteDelivery(delivery._id)}
                  className="bg-green-500 rounded-lg p-3 mt-3"
                >
                  <Text className="text-white text-center font-semibold">Complete Delivery</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
