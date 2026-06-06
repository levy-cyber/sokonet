const jobs = [
  { id: 'j-001', role: 'E-commerce Operations Manager', company: 'SokoNet Marketplace', location: 'Nairobi', salary: 'KES 240,000' },
  { id: 'j-002', role: 'Fintech Product Designer', company: 'M-Pesa Labs', location: 'Remote', salary: 'KES 190,000' },
  { id: 'j-003', role: 'Growth Analyst', company: 'AgriPay Hub', location: 'Nakuru', salary: 'KES 160,000' },
];

export default function JobsPage() {
  return (
    <div className="space-y-8">
      <section className="card-glass p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Jobs</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Marketplace talent hub</h1>
            <p className="mt-2 text-slate-400">Browse active roles across commerce, fintech, and service providers.</p>
          </div>
          <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-600">Post new role</button>
        </div>
      </section>

      <section className="grid gap-5">
        {jobs.map((job) => (
          <div key={job.id} className="card-glass p-6 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-500">{job.company}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{job.role}</h2>
              </div>
              <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{job.salary}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-slate-400">
              <p>{job.location}</p>
              <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-600">View role</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
