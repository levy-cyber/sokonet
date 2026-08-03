import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingCart, FiShield, FiTrendingUp } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-brand/90 font-semibold">Welcome to Netsoko</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Netsoko Dashboard Preview — before login, before signup.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Visitors see the customer-ready dashboard first, then choose Login or Sign Up from the top-right buttons.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-black shadow-xl shadow-brand/30 transition hover:bg-emerald-500"
            >
              Sign Up Now
              <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:border-brand hover:text-brand"
            >
              Login
            </Link>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            <Panel icon={FiTrendingUp} title="Live Insights" text="Impress customers with real dashboard metrics before they become users." />
            <Panel icon={FiShield} title="Trusted Platform" text="Showcase secure escrow and wallet readiness to build trust instantly." />
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-black/40 lg:p-8">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span className="font-medium text-white">Dashboard Preview</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Live</span>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] bg-slate-900/90 p-5 shadow-inner shadow-black/30">
            <PreviewCard title="Total Orders" value="8,743" delta="+12.4%" />
            <div className="grid gap-4 sm:grid-cols-2">
              <MiniCard label="Wallet Balance" value="KES 124,650" />
              <MiniCard label="Pending Orders" value="28" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <MiniCard label="New Sellers" value="1,204" />
              <MiniCard label="Active Riders" value="67" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Panel = ({ icon: Icon, title, text }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.35)]">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-black">
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-5 text-lg font-semibold text-white">{title}</p>
    <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
  </div>
);

const PreviewCard = ({ title, value, delta }) => (
  <div className="rounded-3xl bg-slate-950/90 border border-white/10 p-5">
    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
    <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    <p className="mt-3 text-sm text-brand">{delta}</p>
    <div className="mt-4 h-1.5 rounded-full bg-white/10">
      <div className="h-1.5 w-3/4 rounded-full bg-brand"></div>
    </div>
  </div>
);

const MiniCard = ({ label, value }) => (
  <div className="rounded-3xl bg-slate-950/90 border border-white/10 p-4">
    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
  </div>
);

export default LandingPage;
