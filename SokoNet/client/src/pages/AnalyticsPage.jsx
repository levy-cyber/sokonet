const metrics = [
  { label: 'Conversion rate', value: '4.8%' },
  { label: 'Monthly growth', value: '26%' },
  { label: 'Retention', value: '91%' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <section className="card-glass p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Analytics</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Platform performance</h1>
        <p className="mt-2 text-slate-400">Review usage trends, financial velocity, and high-value marketplace insights.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="card-glass p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-white">Charts overview</h2>
          <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">Data is mocked for design</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-[300px] rounded-[32px] bg-slate-900/70 p-6 text-slate-400">Revenue growth chart placeholder</div>
          <div className="h-[300px] rounded-[32px] bg-slate-900/70 p-6 text-slate-400">User engagement chart placeholder</div>
        </div>
      </section>
    </div>
  );
}
