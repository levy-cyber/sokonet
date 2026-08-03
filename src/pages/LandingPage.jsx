import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTrendingUp, FiShoppingCart, FiShield, FiActivity } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-brand/90 font-semibold">Welcome to Netsoko</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Africa’s smart commerce dashboard for buyers, sellers, riders and service providers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            See the Netsoko dashboard instantly, explore live marketplace insights, and join the platform with a single click.
            Impress customers with a modern portal before they sign up or log in.
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
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.45)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-black">
                <FiTrendingUp className="h-5 w-5" />
              </div>
              <p className="mt-5 text-lg font-semibold text-white">Live performance insights</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">Showcase a dashboard view with metrics, revenue, and activity even before login.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.25)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <FiShield className="h-5 w-5" />
              </div>
              <p className="mt-5 text-lg font-semibold text-white">Secure escrow-ready platform</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">Give visitors confidence with trust signals and easy access to sign up or log in.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/50 lg:p-8">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span className="font-medium text-white">Dashboard preview</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Preview</span>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] bg-slate-900/90 p-5 shadow-inner shadow-black/30">
            <div className="rounded-3xl bg-slate-950/90 p-5 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total orders</p>
                  <p className="mt-2 text-3xl font-semibold text-white">8,743</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-emerald-300">+12.4%</div>
              </div>

              <div className="mt-5 h-1.5 rounded-full bg-white/10">
                <div className="h-1.5 w-3/4 rounded-full bg-brand"></div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Wallet balance</p>
                <p className="mt-3 text-2xl font-semibold text-white">KES 124,650</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pending orders</p>
                <p className="mt-3 text-2xl font-semibold text-white">28</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">New sellers</p>
                <p className="mt-3 text-2xl font-semibold text-white">1,204</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active riders</p>
                <p className="mt-3 text-2xl font-semibold text-white">67</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-5">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-black">
                <FiShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Marketplace insights</p>
                <p className="text-xs leading-5 text-slate-500">See visitor demand and service volume at a glance.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-semibold text-white">Best seller</p>
                <p className="mt-2 text-slate-400">Hella bucket</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-semibold text-white">Top service</p>
                <p className="mt-2 text-slate-400">Electrician booking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
