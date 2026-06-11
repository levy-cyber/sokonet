import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FiHome, FiShoppingBag, FiLock, FiCreditCard, FiInbox,
  FiBriefcase, FiUser, FiSliders, FiUsers, FiActivity, FiLogOut, FiX,
  FiTool, FiBriefcase as FiJob, FiCalendar, FiTruck
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const navigationLinks = [
    { name: 'Dashboard', path: '/', icon: FiHome, description: 'Home dashboard with stats', role: 'all' },
    { name: 'Marketplace', path: '/marketplace', icon: FiShoppingBag, description: 'Browse products and shops', role: 'all' },
    { name: 'Services', path: '/services', icon: FiTool, description: 'Book professional services', role: 'all' },
    { name: 'My Shop', path: '/shop/mine', icon: FiUser, description: 'Manage your seller shop', role: 'seller' },
    { name: 'Business Analytics', path: '/analytics', icon: FiActivity, description: 'View business performance', role: 'seller' },
    { name: 'My Orders', path: '/orders', icon: FiInbox, description: 'View order history', role: 'all' },
    { name: 'Escrow Lock', path: '/escrow', icon: FiLock, description: 'Secure payment protection', role: 'all' },
    { name: 'My Wallet', path: '/wallet', icon: FiCreditCard, description: 'Manage wallet balance', role: 'all' },
    { name: 'Jobs Hub', path: '/jobs', icon: FiJob, description: 'Find freelance work', role: 'all' },
    { name: 'My Services', path: '/services/mine', icon: FiTool, description: 'Manage service listings', role: 'service_provider' },
    { name: 'Bookings', path: '/bookings', icon: FiCalendar, description: 'View service bookings', role: 'service_provider' },
    { name: 'Rider Console', path: '/rider/dashboard', icon: FiTruck, description: 'Delivery partner dashboard', role: 'rider' },
    { name: 'Chat Room', path: '/chat', icon: FiUsers, description: 'Real-time messaging', role: 'all' },
    { name: 'Admin Console', path: '/admin', icon: FiSliders, description: 'System administration', role: 'admin' },
    { name: 'Analytics', path: '/analytics', icon: FiActivity, description: 'Platform analytics', role: 'admin' },
  ];

  const getRoleBadge = () => {
    const roleColors = {
      buyer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      seller: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      service_provider: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      rider: 'bg-green-500/10 text-green-400 border-green-500/20',
      freelancer: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    
    const roleNames = {
      buyer: 'Buyer',
      seller: 'Seller',
      service_provider: 'Service Provider',
      rider: 'Rider',
      freelancer: 'Freelancer',
      admin: 'Admin',
    };

    return {
      className: roleColors[user?.role] || roleColors.buyer,
      text: roleNames[user?.role] || 'Buyer',
    };
  };

  const getLinkClass = (linkRole, userRole) => {
    if (linkRole === 'all') return ''; // Show all links normally
    if (linkRole === userRole) return 'text-white'; // Highlight role-specific links
    return 'text-gray-500'; // Dim links for other roles
  };

  return (
    <>
      {/* Mobile Close Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="lg:hidden fixed top-20 right-4 z-50 w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-white"
      >
        <FiX className="text-lg" />
      </button>

      <aside className={`
        w-64 h-screen fixed left-0 top-0 glass-panel border-r border-dark-border flex flex-col justify-between py-6 z-30
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div>
          {/* Brand Header */}
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center font-bold text-black text-xl shadow-glow-green">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                Soko<span className="text-brand">Net</span>
              </h1>
              <span className="text-xs text-dark-muted font-mono tracking-wider">v1.0.0 PROD</span>
            </div>
          </div>

          {/* User Card */}
          {user && (
            <div className="px-4 mb-6">
              <div className="p-3 bg-dark-cardMuted/50 border border-dark-border rounded-xl flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-brand/35"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-mono rounded font-semibold border ${getRoleBadge().className}`}>
                    {getRoleBadge().text}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation links - Now shows all links to all users */}
          <nav className="px-3 space-y-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-brand/10 border-l-4 border-brand text-brand shadow-glow-green/5'
                      : 'hover:bg-dark-cardMuted/30 hover:translate-x-1'
                    }
                    ${getLinkClass(link.role, user?.role)}
                  `}
                  title={link.description}
                >
                  <Icon className="text-lg shrink-0" />
                  <span className="flex-1">{link.name}</span>
                  {link.role !== 'all' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-gray-600 text-gray-500">
                      {link.role === 'seller' && '🏪'}
                      {link.role === 'service_provider' && '🔧'}
                      {link.role === 'rider' && '🚚'}
                      {link.role === 'admin' && '⚙️'}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div className="px-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-all duration-200"
          >
            <FiLogOut className="text-lg shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;