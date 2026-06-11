import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setSuccess(true);
        // For development, log the reset link
        if (response.data.resetLink) {
          console.log('Development Reset Link:', response.data.resetLink);
        }
      } else {
        setError(response.data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-gray-400 text-sm mb-6">
              We've sent a password reset link to {email}. The link will expire in 1 hour.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
            >
              Back to Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-brand transition-all placeholder-gray-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;