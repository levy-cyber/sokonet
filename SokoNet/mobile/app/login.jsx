import { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, user } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async () => {
    const success = await signIn({ email, password });
    if (success) {
      router.replace('/dashboard');
    } else {
      Alert.alert('Login failed', 'Please check your credentials');
    }
  };

  if (user) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</Text>
      <Text className="text-slate-500 mb-8">Sign in to manage your SokoNet account.</Text>
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
        <Text className="text-white font-semibold">Sign In</Text>
      </TouchableOpacity>
      <View className="mt-5 flex-row justify-center gap-1">
        <Text className="text-slate-500">New to SokoNet?</Text>
        <Link href="/register" className="text-brand-600 font-semibold">Create account</Link>
      </View>
    </View>
  );
}
