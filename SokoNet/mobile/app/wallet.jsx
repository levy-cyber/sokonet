import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, RefreshControl } from 'react-native';
import { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchWallet, fetchTransactions, depositFunds } from '../services/walletService';

export default function WalletScreen() {
  const { token } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const w = await fetchWallet();
      setWallet(w);
      const tx = await fetchTransactions();
      setTransactions(tx || []);
    } catch (err) {
      console.warn('Wallet load failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [token]);

  const handleDeposit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !phone) {
      return Alert.alert('Invalid input', 'Enter a valid amount and phone number');
    }

    try {
      const res = await depositFunds({ amount: amt, phone });
      setWallet(res.wallet || wallet);
      setTransactions((prev) => [res.transaction, ...prev]);
      setAmount('');
      Alert.alert('Deposit initiated', 'Check your MPesa for confirmation');
    } catch (err) {
      console.warn('Deposit failed', err);
      Alert.alert('Deposit failed', err?.response?.data?.message || 'Unable to initiate deposit');
    }
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !phone) {
      return Alert.alert('Invalid input', 'Enter a valid amount and phone number');
    }

    try {
      const res = await withdrawFunds({ amount: amt, phone });
      setWallet(res.wallet || wallet);
      setTransactions((prev) => [res.transaction, ...prev]);
      setAmount('');
      Alert.alert('Withdrawal processed', 'Funds withdrawal has been processed');
    } catch (err) {
      console.warn('Withdraw failed', err);
      Alert.alert('Withdraw failed', err?.response?.data?.message || 'Unable to process withdraw');
    }
  };

  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Wallet</Text>
      <View className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 mb-6">
        <Text className="text-slate-500">Available balance</Text>
        <Text className="text-4xl font-bold text-slate-900 mt-4">
          KES {loading ? '...' : (wallet?.balance ?? 0)}
        </Text>
        <View className="mt-6">
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount (KES)"
            keyboardType="numeric"
            className="mb-3 rounded-2xl border border-slate-200 px-4 py-3"
          />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone (07... or +2547...)"
            keyboardType="phone-pad"
            className="mb-4 rounded-2xl border border-slate-200 px-4 py-3"
          />
          <TouchableOpacity onPress={handleDeposit} className="rounded-2xl bg-brand-500 py-4 items-center">
            <Text className="text-white font-semibold">Deposit Funds</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-lg font-semibold text-slate-900 mb-3">Recent transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id || item.id || String(item.createdAt)}
        renderItem={({ item }) => (
          <View className="mb-3 rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
            <Text className="font-semibold">{item.type || 'Transaction'} — KES {item.amount}</Text>
            <Text className="text-slate-500">{item.status} • {item.reference || item._id}</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text className="text-slate-500">No transactions yet.</Text>}
      />
    </View>
  );
}
