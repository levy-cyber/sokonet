import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [otpId, setOtpId] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60); // 60 seconds before can resend
  const [emailDeliveryStatus, setEmailDeliveryStatus] = useState('pending');

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0 && !canResend) {
      const timer = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCountdown, canResend]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/auth/verify-otp', { email, otp, otpId });
      
      if (response.data.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');
    setSuccess(false);
    setEmailDeliveryStatus('sending');
    
    try {
      const response = await api.post('/auth/resend-otp', { email });
      
      if (response.data.success) {
        setSuccess('New OTP sent successfully! Previous OTP has been invalidated.');
        setOtpId(response.data.otpId);
        setCountdown(600); // Reset countdown
        setCanResend(false);
        setResendCountdown(60); // Reset resend countdown
        setEmailDeliveryStatus(response.data.emailDelivery ? 'delivered' : 'failed');
        
        // For development, show the OTP in console
        if (response.data.otp) {
          console.log('Development OTP:', response.data.otp);
        }
      } else {
        setError(response.data.message || 'Failed to resend OTP');
        setEmailDeliveryStatus('failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      setEmailDeliveryStatus('failed');
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-gray-400 text-sm">
              A 6-digit code was sent to <span className="text-white font-medium">{email || 'your email'}</span>.
              Please enter it below to activate your Netsoko account.
            </p>
            
            {/* Email delivery status */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {emailDeliveryStatus === 'sending' && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  Sending OTP...
                </div>
              )}
              {emailDeliveryStatus === 'delivered' && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  OTP delivered successfully
                </div>
              )}
              {emailDeliveryStatus === 'failed' && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Email delivery failed - check console
                </div>
              )}
            </div>

            {/* Countdown timer */}
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Expires in: <span className="text-white font-medium">{formatTime(countdown)}</span></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-brand transition-all placeholder-gray-500"
                  placeholder="000000"
                  maxLength={6}
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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm"
              >
                {success}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending || !canResend}
                className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {resending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Resending...
                  </>
                ) : canResend ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend Code
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Resend in {formatTime(resendCountdown)}
                  </>
                )}
              </button>
            </div>
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

export default OTPVerificationPage;