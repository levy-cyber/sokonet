import { formatCurrency } from '../utils/formatCurrency.js';

export default function ProductCard({ product }) {
  const sellerName = typeof product.seller === 'string' ? product.seller : product.seller?.name || 'Seller';

  return (
    <div className="card-glass p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-500">{product.category}</p>
          <h3 className="mt-3 text-xl font-semibold text-white">{product.title}</h3>
          <p className="mt-2 text-sm text-slate-400">Seller: {sellerName}</p>
        </div>
        <span className="rounded-full border border-slate-800/80 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">{product.status}</span>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 text-slate-100">
        <span className="text-2xl font-semibold">{formatCurrency(product.price)}</span>
        <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-600">
          Buy now
        </button>
      </div>
    </div>
  );
}
