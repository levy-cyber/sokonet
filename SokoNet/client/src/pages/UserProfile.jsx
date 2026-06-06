import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/Button.jsx';

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="card-glass p-6 shadow-soft">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Account details</h1>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-2 text-lg font-semibold text-white">{user?.name || 'Guest User'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 text-lg font-semibold text-white">{user?.email || 'email@domain.co.ke'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Role</p>
              <p className="mt-2 text-lg font-semibold text-white">{user?.role || 'Platform Manager'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Country</p>
              <p className="mt-2 text-lg font-semibold text-white">Kenya</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card-glass p-6 shadow-soft">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Security</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Account protection</h2>
          <p className="mt-3 text-slate-400">Enable enhanced security settings and keep your marketplace ecosystem safe.</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Two-factor authentication</p>
            <p className="mt-2 text-white">Enabled</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Login alerts</p>
            <p className="mt-2 text-white">Registered devices are monitored</p>
          </div>
          <Button className="w-full">Update security settings</Button>
        </div>
      </section>
    </div>
  );
}
