import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const messages = [
  { id: '1', text: 'Hi, I need a rider for a delivery.', sender: 'client' },
  { id: '2', text: 'We have a rider nearby who can pick up now.', sender: 'agent' },
];

export default function ChatScreen() {
  const [draft, setDraft] = useState('');

  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        className="mb-4"
        renderItem={({ item }) => (
          <View className={`mb-3 rounded-3xl p-4 ${item.sender === 'client' ? 'bg-brand-100 self-end' : 'bg-white'}`}>
            <Text className="text-slate-900">{item.text}</Text>
          </View>
        )}
      />
      <View className="rounded-3xl bg-white p-4 border border-slate-200">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message"
          className="min-h-[48px] text-slate-900"
        />
        <TouchableOpacity className="mt-3 rounded-3xl bg-brand-500 py-3 items-center">
          <Text className="text-white font-semibold">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
