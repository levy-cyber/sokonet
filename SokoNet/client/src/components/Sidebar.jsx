import { NavLink } from 'react-router-dom';
import { navItems } from '../utils/constants.js';

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col rounded-[32px] border border-slate-800/70 bg-slate-950/95 p-5 shadow-soft">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-500/10 text-brand-300 shadow-soft">SN</div>
        <div>
          <h1 className="text-xl font-semibold text-white">SokoNet</h1>
          <p className="text-sm text-slate-400">Fintech + commerce ecosystem</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-brand-500/15 text-brand-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4 text-sm text-slate-400">
        <p className="font-semibold text-white">SokoNet Premium</p>
        <p className="mt-2">Scale payments, escrow, and commerce for East Africa.</p>
      </div>
    </div>
  );
}
