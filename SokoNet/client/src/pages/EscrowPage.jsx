const escrowItems = [
  { id: 'e-001', title: 'Merchant payout hold', amount: 42000, status: 'Held' },
  { id: 'e-002', title: 'Inventory deposit', amount: 15000, status: 'Pending release' },
  { id: 'e-003', title: 'Batch pay-out', amount: 27000, status: 'Released' },
];

export default function EscrowPage() {
  return (
    <div className="space-y-8">
      <section className="card-glass p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Escrow</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Payment holding system</h1>
            <p className="mt-2 text-slate-400">Monitor and manage escrow transactions safely across multiple parties.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">Consolidated escrow overview</div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <section className="card-glass p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Active holds</h2>
          <div className="mt-6 space-y-4">
            {escrowItems.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{item.id}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300">{item.status}</span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">KES {item.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card-glass p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Escrow policies</h2>
          <ul className="mt-5 space-y-3 text-slate-400">
            <li className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">Clear transaction milestones before release.</li>
            <li className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">Secure payment verification across buyers and sellers.</li>
            <li className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">Automatic notifications for pending releases.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
