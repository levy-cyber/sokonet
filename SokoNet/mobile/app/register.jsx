import { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async () => {
    const success = await signUp({ name, email, password });
    if (success) {
      router.replace('/dashboard');
    } else {
      Alert.alert('Registration failed', 'Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold text-slate-900 mb-2">Create Account</Text>
      <Text className="text-slate-500 mb-8">Start using SokoNet to manage your marketplace, wallet, and orders.</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        className="mb-4 rounded-2xl border border-slate-200 px-4 py-3"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        className="mb-4 rounded-2xl border border-slate-200 px-4 py-3"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="mb-6 rounded-2xl border border-slate-200 px-4 py-3"
      />
      <TouchableOpacity onPress={handleSubmit} className="rounded-2xl bg-brand-500 py-4 items-center">
        <Text className="text-white font-semibold">Register</Text>
      </TouchableOpacity>
    </View>
  );
}
