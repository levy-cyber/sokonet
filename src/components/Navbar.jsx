import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { SocketContext } from '../context/SocketContext';
import api from '../services/api';
import { FiBell, FiDollarSign, FiSearch, FiSettings, FiMenu, FiShoppingCart } from 'react-icons/fi';

const Navbar = ({ title, onMenuToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, getCartCount } = useCart();
  const { socket } = useContext(SocketContext);
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch Wallet Balance
  const fetchNavbarData = async () => {
    try {
      if (user) {
        const walletRes = await api.get('/wallet');
        setBalance(walletRes.data.balance || 0);
      }
    } catch (err) {
      console.log('Error fetching navbar metadata:', err);
    }
  };

  useEffect(() => {
    fetchNavbarData();
  }, [user]);

  // Listen to Socket notifications
  useEffect(() => {
    if (socket) {
      socket.on('notification', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        // Update balance if it was a wallet transaction notification
        if (newNotif.type === 'Wallet') {
          fetchNavbarData();
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);

  const cartCount = getCartCount();

  return (
    <header className="h-14 lg:h-16 fixed top-0 right-0 left-0 lg:left-64 glass-panel border-b border-dark-border flex items-center justify-between px-3 lg:px-8 z-20">
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted hover:text-white transition-colors"
        >
          <FiMenu className="text-base lg:text-lg" />
        </button>

        {/* Title */}
        <h2 className="text-base lg:text-lg font-semibold text-white tracking-wide truncate max-w-[200px] lg:max-w-none">
          {title || 'Dashboard'}
        </h2>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-2 lg:gap-6">
        {/* Shopping Cart */}
        {user && (
          <Link to="/cart" className="relative">
            <button type="button" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted hover:text-white transition-colors">
              <FiShoppingCart className="text-base lg:text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand rounded-full text-black text-xs font-bold flex items-center justify-center ring-2 ring-dark-bg">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        )}

        {/* Wallet Balance Badge - Simplified on mobile */}
        {user && (
          <div className="flex items-center gap-1.5 lg:gap-2 bg-dark-card border border-dark-border px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl">
            <FiDollarSign className="text-brand font-bold text-base lg:text-lg" />
            <div className="hidden sm:block">
              <span className="text-[10px] lg:text-xs text-dark-muted block leading-none font-mono">KES Wallet</span>
              <span className="text-xs lg:text-sm font-bold text-white font-mono">{balance.toLocaleString()}</span>
            </div>
            <div className="sm:hidden">
              <span className="text-xs font-bold text-white font-mono">{(balance / 1000).toFixed(0)}k</span>
            </div>
          </div>
        )}

        {/* Notifications Icon */}
        <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted hover:text-white transition-colors"
                    >
            <FiBell className="text-base lg:text-lg" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 lg:w-2.5 h-2 lg:h-2.5 bg-brand rounded-full ring-2 ring-dark-bg animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              {/* Backdrop for mobile */}
              <div
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 lg:mt-3 w-72 lg:w-80 glass-panel border border-dark-border rounded-2xl shadow-xl overflow-hidden py-2 z-50">
                <div className="px-3 lg:px-4 py-2 border-b border-dark-border flex justify-between items-center">
                  <span className="font-semibold text-xs lg:text-sm text-white">Notifications</span>
                    {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setNotifications([])}
                      className="text-[10px] lg:text-xs text-brand hover:underline font-mono"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-3 lg:px-4 py-6 lg:py-8 text-center text-[10px] lg:text-xs text-dark-muted font-mono">
                      No new alerts
                    </div>
                  ) : (
                    notifications.map((notif, index) => (
                      <div key={index} className="px-3 lg:px-4 py-2 lg:py-3 hover:bg-dark-cardMuted/30 border-b border-dark-border/40 transition-colors last:border-b-0">
                        <p className="text-[11px] lg:text-xs font-semibold text-white">{notif.title}</p>
                        <p className="text-[10px] lg:text-[11px] text-dark-muted mt-0.5">{notif.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings shortcut */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="hidden lg:flex w-10 h-10 rounded-xl bg-dark-card border border-dark-border items-center justify-center text-dark-muted hover:text-white transition-colors"
        >
          <FiSettings className="text-lg" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;