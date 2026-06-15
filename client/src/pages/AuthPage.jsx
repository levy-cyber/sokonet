import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, User, Phone, Check } from 'lucide-react';

const AuthPage = ({ isLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'buyer',
    selectedRoles: ['buyer'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const availableRoles = [
    { id: 'buyer', name: 'Buyer', description: 'Shop for products and services', icon: '🛒' },
    { id: 'seller', name: 'Seller', description: 'Sell products and manage business', icon: '🏪' },
    { id: 'service_provider', name: 'Service Provider', description: 'Offer professional services', icon: '🔧' },
    { id: 'rider', name: 'Rider', description: 'Delivery partner', icon: '🚚' },
    { id: 'freelancer', name: 'Freelancer', description: 'Find freelance work', icon: '💼' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (roleId) => {
    if (formData.selectedRoles.includes(roleId)) {
      // Don't allow removing the last role
      if (formData.selectedRoles.length > 1) {
        setFormData({
          ...formData,
          selectedRoles: formData.selectedRoles.filter(r => r !== roleId),
          role: roleId === formData.role ? formData.selectedRoles[0] : formData.role,
        });
      }
    } else {
      setFormData({
        ...formData,
        selectedRoles: [...formData.selectedRoles, roleId],
        role: roleId,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        await register(formData.name, formData.email, formData.phone, formData.password, formData.selectedRoles);
        // Redirect to OTP verification after registration
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm lg:text-base">
              {isLogin ? 'Login to your Netsoko account' : 'Sign up to explore endless possibilities'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-brand transition-all placeholder-gray-500"
                    placeholder="John Kamau"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-brand transition-all placeholder-gray-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-brand transition-all placeholder-gray-500"
                    placeholder="+254 XXX XXX XXX"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-brand transition-all placeholder-gray-500"
                  placeholder="••••••••••"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Your Roles <span className="text-gray-500">(Choose one or more)</span>
                </label>
                <div className="space-y-2">
                  {availableRoles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => handleRoleToggle(role.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.selectedRoles.includes(role.id)
                          ? 'bg-brand/20 border-brand text-white'
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                        formData.selectedRoles.includes(role.id) ? 'bg-brand text-black' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {formData.selectedRoles.includes(role.id) && <Check className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{role.name}</p>
                        <p className="text-xs text-gray-400">{role.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected roles: {formData.selectedRoles.join(', ')}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  navigate(isLogin ? '/register' : '/login');
                  setError('');
                }}
                className="ml-2 text-brand font-semibold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
            {isLogin && (
              <button
                onClick={() => {
                  navigate('/forgot-password');
                  setError('');
                }}
                className="block mt-3 text-gray-400 text-sm hover:text-brand transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;