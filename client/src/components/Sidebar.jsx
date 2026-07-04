import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FiHome, FiShoppingBag, FiLock, FiCreditCard, FiInbox,
  FiBriefcase, FiUser, FiSliders, FiUsers, FiActivity, FiLogOut, FiX,
  FiTool, FiBriefcase as FiJob, FiCalendar, FiTruck, FiChevronDown,
  FiGrid, FiTrendingUp, FiLayout as FiLayoutIcon, FiShield as FiShieldIcon
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Role → home page mapping
  const roleHomePaths = {
    buyer: '/',
    seller: '/shop/mine',
    service_provider: '/services/mine',
    rider: '/rider/dashboard',
    freelancer: '/services/mine',
    admin: '/admin',
  };

  const handleRoleSwitch = (role) => {
    switchRole(role);
    navigate(roleHomePaths[role] || '/');
    setShowRoleMenu(false);
    setIsOpen(false);
  };

  const roleLinks = {
    seller: [
      { path: '/shop/mine', label: 'My Shop', icon: FiShoppingBag },
      { path: '/analytics', label: 'Analytics', icon: FiTrendingUp },
    ],
    rider: [
      { path: '/rider/dashboard', label: 'Rider Dashboard', icon: FiTruck },
    ],
    service_provider: [
      { path: '/services/mine', label: 'My Services', icon: FiTool },
      { path: '/bookings', label: 'Service Bookings', icon: FiCalendar },
    ],
    freelancer: [
      { path: '/services/mine', label: 'My Services', icon: FiTool },
      { path: '/bookings', label: 'Service Bookings', icon: FiCalendar },
    ],
    admin: [
      { path: '/admin', label: 'Admin Console', icon: FiShieldIcon },
    ],
  };

  const generalLinks = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/marketplace', label: 'Marketplace', icon: FiShoppingBag },
    { path: '/services', label: 'Services', icon: FiTool },
    { path: '/orders', label: 'My Orders', icon: FiInbox },
    { path: '/wallet', label: 'My Wallet', icon: FiCreditCard },
    { path: '/escrow', label: 'Escrow', icon: FiLock },
    { path: '/jobs', label: 'Jobs', icon: FiJob },
    { path: '/chat', label: 'Chat Room', icon: FiUsers },
    { path: '/settings', label: 'Settings', icon: FiSliders },
  ];

  const externalPortals = [
    { url: 'https://www.kra.go.ke', label: 'KRA Portal', icon: FiShieldIcon },
    { url: 'https://www.ecitizen.go.ke', label: 'eCitizen', icon: FiLayoutIcon },
    { url: 'https://www.kcb.co.ke', label: 'KCB Bank', icon: FiCreditCard },
    { url: 'https://www.equitygroupholdings.com', label: 'Equity Bank', icon: FiTrendingUp },
    { url: 'https://www.mpesa.co.ke', label: 'M-Pesa', icon: FiGrid },
  ];

  const allNavigationLinks = [
    { name: 'Dashboard', path: '/', icon: FiHome, description: 'Home dashboard with stats', role: 'all' },
    { name: 'Marketplace', path: '/marketplace', icon: FiShoppingBag, description: 'Browse products and shops', role: 'all' },
    { name: 'Services', path: '/services', icon: FiTool, description: 'Book professional services', role: 'all' },
    { name: 'My Shop', path: '/shop/mine', icon: FiUser, description: 'Manage your seller shop', role: 'seller' },
    { name: 'Business Analytics', path: '/analytics', icon: FiActivity, description: 'View business performance', role: 'seller' },
    { name: 'My Orders', path: '/orders', icon: FiInbox, description: 'View order history', role: 'all' },
    { name: 'Escrow Lock', path: '/escrow', icon: FiLock, description: 'Secure payment protection', role: 'all' },
    { name: 'My Wallet', path: '/wallet', icon: FiCreditCard, description: 'Manage wallet balance', role: 'all' },
    { name: 'Jobs Hub', path: '/jobs', icon: FiJob, description: 'Find freelance work', role: 'all' },
    { name: 'My Services', path: '/services/mine', icon: FiTool, description: 'Manage service listings', role: 'freelancer' },
    { name: 'Bookings', path: '/bookings', icon: FiCalendar, description: 'View service bookings', role: 'service_provider' },
    { name: 'Rider Console', path: '/rider/dashboard', icon: FiTruck, description: 'Delivery partner dashboard', role: 'rider' },
    { name: 'Chat Room', path: '/chat', icon: FiUsers, description: 'Real-time messaging', role: 'all' },
    { name: 'Settings', path: '/settings', icon: FiSliders, description: 'Account settings', role: 'all' },
    { name: 'Admin Console', path: '/admin', icon: FiSliders, description: 'System administration', role: 'admin' },
  ];

  // Filter navigation links based on user role
  const navigationLinks = allNavigationLinks.filter(link => {
    if (link.role === 'all') return true;
    return user?.roles?.includes(link.role);
  });

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
      className: roleColors[user?.activeRole] || roleColors.buyer,
      text: roleNames[user?.activeRole] || 'Buyer',
    };
  };

  return (
    <>
      {/* Mobile Close Button - Only visible when sidebar is open */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed top-20 right-4 z-50 w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-white"
        >
          <FiX className="text-lg" />
        </button>
      )}

      <aside className={`
        w-64 lg:w-64 h-screen fixed left-0 top-0 glass-panel border-r border-dark-border flex flex-col justify-between py-4 lg:py-6 z-30 lg:z-20
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="px-4 lg:px-6 mb-4 lg:mb-8 flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-brand flex items-center justify-center font-bold text-black text-lg lg:text-xl shadow-glow-green">
              N
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white font-sans">
                Net<span className="text-brand">soko</span>
              </h1>
              <span className="text-[10px] lg:text-xs text-dark-muted font-mono tracking-wider">v1.0.0 PROD</span>
            </div>
          </div>

          {/* User Card */}
          {user && (
            <div className="px-3 lg:px-4 mb-4 lg:mb-6">
              <div className="p-2 lg:p-3 bg-dark-cardMuted/50 border border-dark-border rounded-xl">
                <div className="flex items-center gap-2 lg:gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border border-brand/35"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs lg:text-sm font-semibold text-white truncate">{user.name}</p>
                    <button
                      onClick={() => setShowRoleMenu(!showRoleMenu)}
                      className="flex items-center gap-1 text-[9px] lg:text-[10px] uppercase font-mono rounded font-semibold border transition-colors hover:bg-dark-card/50"
                    >
                      <span className={getRoleBadge().className}>{getRoleBadge().text}</span>
                      <FiChevronDown className={`w-3 h-3 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Role Menu Dropdown — Switch Roles & Navigate (all devices) */}
                {showRoleMenu && (
                  <div className="mt-2 pt-2 border-t border-dark-border/50">
                    {/* Switch Role Section */}
                    {user?.roles?.length > 1 && (
                      <>
                        <p className="text-[10px] text-gray-500 mb-2 font-medium">Switch Role</p>
                        <div className="space-y-1 mb-3">
                          {user.roles.map((role) => {
                            const isActive = role === user.activeRole;
                            const roleLabels = {
                              buyer: '🛒 Buyer',
                              seller: '🏪 Seller',
                              service_provider: '🔧 Service Provider',
                              rider: '🚚 Rider',
                              freelancer: '💼 Freelancer',
                              admin: '⚙️ Admin',
                            };
                            return (
                              <button
                                key={role}
                                onClick={() => handleRoleSwitch(role)}
                                disabled={isActive}
                                className={`w-full flex items-center gap-2 px-2 py-1.5 text-[10px] lg:text-xs rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-brand/20 text-brand border border-brand/30 cursor-default'
                                    : 'text-gray-400 hover:text-white hover:bg-dark-card/50'
                                }`}
                              >
                                <span>{roleLabels[role]}</span>
                                {isActive && <span className="ml-auto text-[9px] text-brand">Active</span>}
                              </button>
                            );
                          })}
                        </div>
                        <div className="border-t border-dark-border/50 mb-2" />
                      </>
                    )}

                    {/* General Links */}
                    <p className="text-[10px] text-gray-500 mb-2 font-medium">Quick Access</p>
                    <div className="space-y-1 mb-3">
                      {generalLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <button
                            key={link.path}
                            onClick={() => {
                              navigate(link.path);
                              setShowRoleMenu(false);
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-[10px] lg:text-xs text-gray-400 hover:text-white hover:bg-dark-card/50 rounded-lg transition-colors"
                          >
                            <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>{link.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* External Portals */}
                    <p className="text-[10px] text-gray-500 mb-2 font-medium border-t border-dark-border/50 pt-2">External Portals</p>
                    <div className="space-y-1 mb-3">
                      {externalPortals.map((portal) => {
                        const Icon = portal.icon;
                        return (
                          <a
                            key={portal.url}
                            href={portal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-[10px] lg:text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>{portal.label}</span>
                            <span className="text-[8px] text-gray-500 ml-auto">↗</span>
                          </a>
                        );
                      })}
                    </div>

                    {/* Role-specific Links */}
                    {user?.roles?.length > 0 && (
                      <>
                        <p className="text-[10px] text-gray-500 mb-2 font-medium border-t border-dark-border/50 pt-2">Role Pages</p>
                        {user?.roles?.map((role) => (
                          <div key={role} className="space-y-1">
                            {roleLinks[role]?.map((link) => {
                              const Icon = link.icon;
                              return (
                                <button
                                  key={link.path}
                                  onClick={() => {
                                    navigate(link.path);
                                    setShowRoleMenu(false);
                                    setIsOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 text-[10px] lg:text-xs text-brand hover:text-white hover:bg-brand/20 rounded-lg transition-colors"
                                >
                                  <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span>{link.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="px-2 lg:px-3 space-y-0.5 lg:space-y-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-brand/10 border-l-2 lg:border-l-4 border-brand text-brand shadow-glow-green/5'
                      : 'hover:bg-dark-cardMuted/30 hover:translate-x-1'
                    }
                  `}
                  title={link.description}
                >
                  <Icon className="text-base lg:text-lg shrink-0" />
                  <span className="flex-1 truncate">{link.name}</span>
                  {link.role !== 'all' && (
                    <span className="text-[9px] lg:text-[10px] px-1.5 lg:px-2 py-0.5 rounded-full border border-gray-600 text-gray-500">
                      {link.role === 'seller' && '🏪'}
                      {link.role === 'freelancer' && '💼'}
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
        <div className="px-2 lg:px-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg lg:rounded-xl transition-all duration-200"
          >
            <FiLogOut className="text-base lg:text-lg shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;