export default function StatCard({ title, value, children, accent = 'bg-emerald-500/10 text-emerald-300' }) {
  return (
    <div className="card-glass p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-400">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
        </div>
        <div className={`rounded-3xl px-3 py-2 text-xs font-semibold ${accent}`}>{children}</div>
      </div>
    </div>
  );
}
