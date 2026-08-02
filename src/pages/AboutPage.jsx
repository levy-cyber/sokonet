import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-10 lg:p-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300 mb-5">
              Who we are & what we do
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
              Netsoko connects buyers, sellers, service providers and riders in one smart digital marketplace.
            </h1>
            <p className="text-lg leading-8 text-slate-300 mb-8">
              We build an easy-to-use ecosystem where merchants list products, service providers share their offerings, riders fulfill deliveries, and customers browse, order, and pay securely.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mt-10">
            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-7">
              <h2 className="text-xl font-semibold text-white mb-3">Our Mission</h2>
              <p className="text-slate-300 leading-7">
                To simplify commerce across products and services by giving every seller and freelancer a modern online storefront and every customer a trusted marketplace experience.
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-7">
              <h2 className="text-xl font-semibold text-white mb-3">What we offer</h2>
              <ul className="space-y-3 text-slate-300 leading-7">
                <li>• Product listings, shop management and order tracking</li>
                <li>• Service bookings, task matching and rider logistics</li>
                <li>• Secure wallet payments, escrow and payout workflows</li>
              </ul>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-7">
              <h2 className="text-xl font-semibold text-white mb-3">Why choose Netsoko</h2>
              <p className="text-slate-300 leading-7">
                Because we bring everything together under one platform: shops, services, delivery partners, and a dashboard designed for real businesses and everyday buyers.
              </p>
            </section>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/70 p-8 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300 mb-2">Get started</p>
              <p className="text-white text-lg sm:text-xl font-semibold">Sign up now to launch your store, services or delivery network.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 sm:mt-0"
            >
              Create account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
