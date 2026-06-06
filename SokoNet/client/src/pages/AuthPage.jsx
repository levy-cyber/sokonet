import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/Button.jsx';
import hero from '../assets/hero.jpg';

export default function AuthPage() {
  const { login, register, loading, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);

  const toggleMode = () => {
    setIsRegister((current) => !current);
    setMessage(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    try {
      if (isRegister) {
        await register(formData);
        setMessage('Registration successful. Redirecting to dashboard...');
      } else {
        await login(formData);
        setMessage('Login successful. Redirecting to dashboard...');
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col justify-center gap-8 p-8 sm:p-10">
        <div>
          <p className="text-brand-500 uppercase tracking-[0.3em] text-sm font-semibold">SokoNet</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Secure fintech marketplace for East Africa.</h1>
          <p className="mt-4 max-w-xl text-slate-400">Manage login, escrow, payments, and commerce from a unified admin portal built for scalability.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] border border-slate-800/80 bg-slate-950/95 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{isRegister ? 'Create an account' : 'Sign in to SokoNet'}</h2>
            <button type="button" onClick={toggleMode} className="text-sm text-brand-400 transition hover:text-brand-500">
              {isRegister ? 'Have an account?' : 'Create account'}
            </button>
          </div>

          {isRegister && (
            <label className="block text-sm text-slate-300">
              Name
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
          )}

          <label className="block text-sm text-slate-300">
            Email
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@domain.co.ke"
              className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Password
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </label>

          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" className="w-full">{loading ? 'Processing...' : isRegister ? 'Create account' : 'Log in'}</Button>
            {message && <p className="text-sm text-amber-200">{message}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </form>
      </div>

      <div className="relative hidden overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-900/70 p-6 sm:block">
        <img src={hero} alt="SokoNet hero" className="h-full w-full rounded-[28px] object-cover opacity-95" />
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
      </div>
    </div>
  );
}
