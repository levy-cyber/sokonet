import { useAuth } from '../hooks/useAuth.js';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications } = useContext(AppContext);

  return (
    <header className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="rounded-3xl bg-slate-900/70 px-4 py-2 text-slate-300 shadow-sm">Welcome back, {user?.name || 'Operator'}</div>
        <div className="hidden rounded-3xl bg-slate-900/70 px-4 py-2 text-slate-300 sm:block">Active platform tools</div>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-3xl bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
          Notifications <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs text-slate-950">{notifications.length}</span>
        </button>
        <button
          onClick={logout}
          className="rounded-3xl bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
