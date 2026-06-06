import { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { badgeClass } from '../utils/helpers.js';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (orderId, status) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((order) => (order._id === updated._id ? updated : order)));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Orders</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Order lifecycle and delivery pipeline</h1>
            <p className="mt-2 text-slate-400">Review buyer orders, release escrow, and coordinate rider assignments from a single view.</p>
          </div>
        </div>
      </section>

      {loading && <div className="card-glass p-6 text-slate-300">Loading order data...</div>}
      {error && <div className="card-glass p-6 text-rose-200">{error}</div>}

      <div className="grid gap-5 lg:grid-cols-2">
        {orders?.map((order) => (
          <div key={order._id} className="card-glass p-6 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Order ID {order._id}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{order.product?.title || 'Marketplace purchase'}</h2>
                <p className="mt-2 text-sm text-slate-400">Buyer: {order.buyer?.name || 'Unknown'}</p>
              </div>
              <span className={`rounded-full px-3 py-2 text-xs font-semibold ${badgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/70 pt-4 text-slate-300">
              <span>{formatCurrency(order.amount)}</span>
              <span>Courier: {order.courierStatus || 'pending'}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => handleStatus(order._id, 'released')}
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-600"
              >
                Release funds
              </button>
              <button
                onClick={() => handleStatus(order._id, 'refunded')}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Refund
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
