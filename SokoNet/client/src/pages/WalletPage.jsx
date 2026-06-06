import { useEffect, useState } from 'react';
import { getWallet, getTransactions, deposit, withdraw } from '../services/walletService.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    Promise.all([getWallet(), getTransactions()])
      .then(([walletData, transactionsData]) => {
        setWallet(walletData);
        setTransactions(transactionsData);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDeposit = async () => {
    try {
      const result = await deposit(Number(amount), phone);
      setWallet(result.wallet);
      setTransactions((prev) => [result.transaction, ...prev]);
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      const result = await withdraw(Number(amount), phone);
      setWallet(result.wallet);
      setTransactions((prev) => [result.transaction, ...prev]);
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Wallet</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Multi-asset wallet and payment ledger</h1>
            <p className="mt-2 text-slate-400">Track deposits, withdrawals, and mobile money flows across your ecosystem.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">Balance visibility for platform finance.</div>
        </div>
      </section>

      {loading && <div className="card-glass p-6 text-slate-300">Loading wallet details…</div>}
      {error && <div className="card-glass p-6 text-rose-200">{error}</div>}

      {wallet && (
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="card-glass p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Current balance</p>
            <h2 className="mt-3 text-5xl font-semibold text-white">{formatCurrency(wallet.balance)}</h2>
            <p className="mt-2 text-sm text-slate-400">Pending deposits: {formatCurrency(wallet.pendingDeposits)}</p>
            <div className="mt-6 space-y-4 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <label className="block text-sm text-slate-300">
                Amount
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="KES 25,000"
                  className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Mobile number
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0700 000 000"
                  className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                />
              </label>
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={handleDeposit} className="btn-brand">Deposit</button>
                <button onClick={handleWithdraw} className="rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Withdraw</button>
              </div>
            </div>
          </div>

          <div className="card-glass p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Recent transactions</h2>
            <div className="mt-5 space-y-3">
              {transactions.length === 0 && <p className="text-slate-400">No transactions yet.</p>}
              {transactions.map((transaction) => (
                <div key={transaction._id} className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-white">{transaction.type}</p>
                    <span className="text-sm text-slate-400">{formatCurrency(transaction.amount)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{transaction.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{transaction.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
