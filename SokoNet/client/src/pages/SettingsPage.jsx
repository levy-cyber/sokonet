import { useState } from 'react';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Platform configuration</h1>
            <p className="mt-2 text-slate-400">Manage account preferences, notifications, and workspace appearance.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card-glass p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">User preferences</h2>
          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between rounded-3xl border border-slate-800/80 bg-slate-900/70 px-4 py-4">
              <span className="text-sm text-slate-300">Email notifications</span>
              <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications((state) => !state)} />
            </label>
            <label className="flex items-center justify-between rounded-3xl border border-slate-800/80 bg-slate-900/70 px-4 py-4">
              <span className="text-sm text-slate-300">Dark mode</span>
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((state) => !state)} />
            </label>
          </div>
        </div>

        <div className="card-glass p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Security</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">Multi-factor authentication</p>
              <p className="mt-2 text-sm text-slate-300">Secure user sessions with OTP and device trust.</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">Session management</p>
              <p className="mt-2 text-sm text-slate-300">Monitor active sessions and revoke access in one click.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
