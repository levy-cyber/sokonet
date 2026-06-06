import StatCard from '../components/StatCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const overview = [
  { title: 'Total volume', value: formatCurrency(1750000), change: '+12%' },
  { title: 'Escrow held', value: formatCurrency(385000), change: '+8%' },
  { title: 'Marketplace sales', value: '5,820', change: '+18%' },
];

const products = [
  { id: 'p-010', title: 'Digital POS Terminal', category: 'Payments', price: 9800, seller: 'SokoTech', status: 'Available' },
  { id: 'p-011', title: 'Mobile Loan Bundle', category: 'Finance', price: 5200, seller: 'LendWise', status: 'Limited' },
  { id: 'p-012', title: 'Courier Service', category: 'Logistics', price: 1600, seller: 'SwiftSoko', status: 'Available' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Administrative overview</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Monitor transactions, marketplace activity, and the health of your fintech ecosystem.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-5 py-4 text-sm text-slate-300">
            Today: high engagement across escrow, payments, and marketplace listings.
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {overview.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} accent="bg-brand-500/10 text-brand-300">
            {item.change}
          </StatCard>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="card-glass p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Market snapshot</h2>
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">Real-time</span>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Transactions</p>
              <p className="mt-3 text-3xl font-semibold text-white">320</p>
              <p className="mt-2 text-sm text-slate-400">New escrow and payment flows completed today.</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Pipeline</p>
              <p className="mt-3 text-3xl font-semibold text-white">7 live deals</p>
              <p className="mt-2 text-sm text-slate-400">High potential transactions waiting for authorization.</p>
            </div>
          </div>
        </div>

        <div className="card-glass p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Top products</h2>
          <p className="mt-3 text-sm text-slate-400">Trending listings across fintech and marketplace categories.</p>
          <div className="mt-6 space-y-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
