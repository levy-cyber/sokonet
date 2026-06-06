const shops = [
  { id: 's-001', name: 'Nairobi Supermart', category: 'Retail', rating: 4.9, open: true },
  { id: 's-002', name: 'Green Markets', category: 'Agro', rating: 4.7, open: false },
  { id: 's-003', name: 'Urban Business Hub', category: 'Services', rating: 4.8, open: true },
];

export default function ShopsPage() {
  return (
    <div className="space-y-8">
      <section className="card-glass p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Shops</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Marketplaces & businesses</h1>
            <p className="mt-2 text-slate-400">Discover trusted shops, supermarkets, and business partners in the SokoNet network.</p>
          </div>
          <span className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">Verified partners</span>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {shops.map((shop) => (
          <div key={shop.id} className="card-glass p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{shop.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{shop.category}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${shop.open ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                {shop.open ? 'Open' : 'Closed'}
              </span>
            </div>
            <div className="mt-6 flex items-center gap-2 text-slate-300">
              <div className="h-10 w-10 rounded-2xl bg-brand-500/15 flex items-center justify-center text-sm font-semibold">{shop.rating}</div>
              <p>Customer rating</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
