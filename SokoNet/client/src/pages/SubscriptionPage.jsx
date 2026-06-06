const plans = [
  { id: 'sub-1', title: 'Starter', price: 'KES 7,500', features: ['5 marketplace listings', 'Basic escrow', 'Standard support'] },
  { id: 'sub-2', title: 'Growth', price: 'KES 14,500', features: ['20 listings', 'Advanced escrow', 'Priority support'] },
  { id: 'sub-3', title: 'Enterprise', price: 'KES 32,000', features: ['Unlimited listings', 'Custom escrow workflows', 'Dedicated success manager'] },
];

export default function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <section className="card-glass p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Billing</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Subscription plans</h1>
            <p className="mt-2 text-slate-400">Choose a plan that unlocks fintech, escrow, and commerce capabilities for your business.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">Manage billing and plan upgrades</div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="card-glass p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">{plan.title}</h2>
            <p className="mt-3 text-4xl font-bold text-brand-400">{plan.price}</p>
            <ul className="mt-6 space-y-3 text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-600">
              Choose plan
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
