import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FiHome, FiShoppingBag, FiLock, FiCreditCard, FiInbox,
  FiBriefcase, FiUser, FiSliders, FiUsers, FiActivity, FiLogOut
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const baseLinks = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'Marketplace', path: '/marketplace', icon: FiShoppingBag },
    { name: 'Escrow Lock', path: '/escrow', icon: FiLock },
    { name: 'My Wallet', path: '/wallet', icon: FiCreditCard },
    { name: 'My Orders', path: '/orders', icon: FiInbox },
    { name: 'Jobs Hub', path: '/jobs', icon: FiBriefcase },
    { name: 'Chat Room', path: '/chat', icon: FiUsers },
  ];

  const sellerLinks = [
    { name: 'My Shop', path: '/shop/mine', icon: FiUser },
  ];

  const riderLinks = [
    { name: 'Rider Console', path: '/rider/dashboard', icon: FiSliders },
  ];

  const adminLinks = [
    { name: 'Analytics', path: '/analytics', icon: FiActivity },
    { name: 'Admin Console', path: '/admin', icon: FiSliders },
  ];

  const getLinks = () => {
    let links = [...baseLinks];
    if (user?.role === 'seller') links = [...links, ...sellerLinks];
    if (user?.role === 'rider') links = [...links, ...riderLinks];
    if (user?.role === 'admin') links = [...links, ...adminLinks];
    return links;
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-dark-border flex flex-col justify-between py-6 z-30">
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
                <span className="inline-block px-2 py-0.5 bg-brand/10 text-brand text-[10px] uppercase font-mono rounded font-semibold border border-brand/20">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="px-3 space-y-1">
          {getLinks().map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-brand/10 border-l-4 border-brand text-brand shadow-glow-green/5'
                    : 'text-dark-muted hover:text-white hover:bg-dark-cardMuted/30 hover:translate-x-1'
                  }
                `}
              >
                <Icon className="text-lg shrink-0" />
                <span>{link.name}</span>
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
  );
};

export default Sidebar;