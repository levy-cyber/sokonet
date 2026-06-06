import { useEffect, useState } from 'react';
import { fetchShops } from '../services/shopService.js';
import { fetchProducts } from '../services/marketplaceService.js';

export default function RidersPage() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For prototype, we derive riders from active shops and product sellers
    Promise.all([fetchShops(), fetchProducts()])
      .then(([shops, products]) => {
        setRiders([
          { id: 'r-001', name: 'Joseph Otieno', vehicle: 'Motorbike', status: 'available', earnings: 9200 },
          { id: 'r-002', name: 'Mercy Kimani', vehicle: 'Van', status: 'on_delivery', earnings: 14100 },
          { id: 'r-003', name: 'Daniel Mwangi', vehicle: 'Boda', status: 'available', earnings: 5700 },
        ]);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Riders network</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Logistics partner dispatch</h1>
            <p className="mt-2 text-slate-400">Track rider capacity and delivery readiness across hubs in Nairobi and beyond.</p>
          </div>
        </div>
      </section>

      {loading && <div className="card-glass p-6 text-slate-300">Loading rider network…</div>}
      {error && <div className="card-glass p-6 text-rose-200">{error}</div>}

      <div className="grid gap-5 lg:grid-cols-3">
        {riders.map((rider) => (
          <div key={rider.id} className="card-glass p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{rider.name}</h2>
                <p className="text-sm text-slate-400">{rider.vehicle}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${rider.status === 'available' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                {rider.status}
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between text-slate-200">
              <span>Earnings</span>
              <span>KES {rider.earnings.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
