import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Camera, Save, X, ArrowRight, Store, Bike, Briefcase, Shield, LayoutDashboard, BarChart3 } from 'lucide-react';
import api from '../services/api';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const roleLinks = {
    seller: [
      { path: '/shop/mine', label: 'My Shop', icon: Store },
      { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
    rider: [
      { path: '/rider/dashboard', label: 'Rider Dashboard', icon: Bike },
    ],
    service_provider: [
      { path: '/services/mine', label: 'My Services', icon: Briefcase },
      { path: '/bookings', label: 'Service Bookings', icon: LayoutDashboard },
    ],
    freelancer: [
      { path: '/services/mine', label: 'My Services', icon: Briefcase },
      { path: '/bookings', label: 'Service Bookings', icon: LayoutDashboard },
    ],
    admin: [
      { path: '/admin', label: 'Admin Console', icon: Shield },
    ],
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
      setPreviewImage(user.avatar || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData({ ...formData, avatar: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.put('/users/profile', formData);

      if (response.data.success) {
        const updatedUser = { ...user, ...response.data.user };
        setUser(updatedUser);
        localStorage.setItem('Netsoko_user', JSON.stringify(updatedUser));
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400 text-sm lg:text-base">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="relative">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 lg:w-16 lg:h-16 text-gray-500" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 bg-brand rounded-full flex items-center justify-center cursor-pointer hover:bg-brand/80 transition-colors border-2 border-gray-900"
                >
                  <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">Profile Picture</h3>
                <p className="text-gray-400 text-sm mb-2">Upload a new profile picture</p>
                {previewImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Name */}
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
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Phone */}
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

            {/* Role Information */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-semibold mb-3">Account Roles</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {user?.roles?.map((role) => (
                  <span
                    key={role}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      role === user?.activeRole
                        ? 'bg-brand text-black'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                    {role === user?.activeRole && ' (Active)'}
                  </span>
                ))}
              </div>

              {/* Role-specific navigation links */}
              <div className="space-y-3">
                <h4 className="text-gray-400 text-sm font-medium">Quick Access to Your Roles</h4>
                {user?.roles?.map((role) => (
                  <div key={role} className="space-y-2">
                    {roleLinks[role]?.map((link) => {
                      const Icon = link.icon;
                      return (
                        <button
                          key={link.path}
                          onClick={() => navigate(link.path)}
                          className="w-full flex items-center justify-between p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-brand" />
                            <span className="text-gray-300 group-hover:text-white transition-colors">
                              {link.label}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400"
              >
                {success}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;