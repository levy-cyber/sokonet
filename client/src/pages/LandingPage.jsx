import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiShoppingCart,
  FiShield,
  FiTrendingUp,
  FiTruck,
  FiUsers,
  FiBox,
  FiServer,
} from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-brand/90 font-semibold">One platform for every role</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Netsoko brings buyers, sellers, riders, service providers, escrow and wallet services together.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Show your visitors the full Netsoko experience before they sign in: commerce, bookings, delivery, secure escrow, payments,
            live analytics and easy role switching, all in one intelligent marketplace hub.
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
            <FeatureCard
              icon={FiUsers}
              title="Multi-role portal"
              text="Buy, sell, ride, and deliver from a single shared marketplace platform."
            />
            <FeatureCard
              icon={FiServer}
              title="Secure escrow & wallet"
              text="Handle payments and escrow securely with built-in wallet, payout and settlement workflows."
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-black/40 lg:p-8">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span className="font-medium text-white">Netsoko portal overview</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Preview</span>
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.75rem] bg-slate-900/90 p-5 shadow-inner shadow-black/30">
            <DashboardStat title="Marketplace traffic" value="504" delta="+0.0%" />
            <div className="grid gap-4 sm:grid-cols-2">
              <MiniStat label="Live sellers" value="67" />
              <MiniStat label="Rider trips" value="400" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <MiniStat label="Escrow value" value="KES 2.6M" />
              <MiniStat label="Requests today" value="624" />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <PortalCard icon={FiShoppingCart} title="Buyer" description="Browse products, place orders, and track delivery in one chat-friendly portal." />
            <PortalCard icon={FiBox} title="Seller" description="Manage inventory, orders, and store performance with one dashboard." />
            <PortalCard icon={FiTruck} title="Rider" description="Accept deliveries, follow routes, and check earnings from the rider panel." />
            <PortalCard icon={FiShield} title="Service Provider" description="Offer professional jobs, receive bookings, and grow your services." />
          </div>
        </div>
      </div>

      <div className="mt-20 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/40">
        <h2 className="text-3xl font-bold text-white">What Netsoko can do for you</h2>
        <p className="mt-3 max-w-2xl text-lg text-slate-300">
          From product sales to gig work, delivery logistics to escrow-backed payments, Netsoko is built for the full business lifecycle.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <PortalFeature title="Unified commerce" description="One login gives access to marketplace, services, rider logistics, wallet, and escrow." />
          <PortalFeature title="Trusted payment flow" description="Integrated wallet, escrow, and payout controls keep funds secure for all parties." />
          <PortalFeature title="Live analytics" description="Dashboard insights show order volume, wallet balance, rider activity and seller performance." />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, text }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.35)]">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-black">
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-5 text-lg font-semibold text-white">{title}</p>
    <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
  </div>
);

const DashboardStat = ({ title, value, delta }) => (
  <div className="rounded-3xl bg-slate-950/90 border border-white/10 p-5">
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <span className="text-sm text-brand">{delta}</span>
    </div>
    <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="rounded-3xl bg-slate-950/90 border border-white/10 p-4">
    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
  </div>
);

const PortalCard = ({ icon: Icon, title, description }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-5 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_20px_60px_-30px_rgba(16,185,129,0.4)]">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-black">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
  </div>
);

const PortalFeature = ({ title, description }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.35)]">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-black">
      <FiTrendingUp className="h-5 w-5" />
    </div>
    <p className="mt-5 text-lg font-semibold text-white">{title}</p>
    <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
  </div>
);

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
