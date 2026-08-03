import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(180deg,#020617_0%,#07111f_100%)] text-white overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-black text-xl font-bold">N</div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] uppercase text-brand/80">Netsoko</p>
              <p className="text-xs text-slate-400">Smart commerce for Kenya</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand hover:bg-brand/10"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
