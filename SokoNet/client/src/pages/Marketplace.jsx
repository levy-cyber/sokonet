import { useFetch } from '../hooks/useFetch.js';
import { fetchProducts } from '../services/marketplaceService.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Marketplace() {
  const { data: products, loading, error } = useFetch(fetchProducts, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Marketplace</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Active product listings</h1>
            <p className="mt-2 text-slate-400">Browse categories, manage stock, and monitor pricing across sellers.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">Featured marketplace performance</div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {loading && <div className="col-span-full rounded-3xl bg-slate-900/80 p-6 text-slate-300">Loading product listings...</div>}
        {error && <div className="col-span-full rounded-3xl bg-rose-500/10 p-6 text-rose-200">{error}</div>}
        {products?.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
