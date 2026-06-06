import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/analyticsService.js';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  const chartData = analytics?.orderStatusSummary.map((item) => ({
    name: item._id,
    value: item.count,
  })) || [];

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Reports</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Operational insights</h1>
            <p className="mt-2 text-slate-400">Compare order statuses and revenue signals for the full SokoNet ecosystem.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="card-glass p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Order status distribution</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C853" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00C853" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{ stroke: '#00C853', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="value" stroke="#00C853" fill="url(#colorStatus)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-glass p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Key metrics</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Revenue</p>
              <p className="mt-3 text-3xl font-semibold text-white">KES {analytics?.revenue?.toLocaleString() || '0'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Active subscriptions</p>
              <p className="mt-3 text-3xl font-semibold text-white">{analytics?.counts?.activeSubscriptions || 0}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Open escrow cases</p>
              <p className="mt-3 text-3xl font-semibold text-white">{analytics?.counts?.openEscrow || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
