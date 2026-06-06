import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SocketContext } from '../context/SocketContext';
import api from '../services/api';
import { FiBell, FiDollarSign, FiSearch, FiSettings } from 'react-icons/fi';

const Navbar = ({ title }) => {
  const { user } = useAuth();
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

  return (
    <header className="h-16 fixed top-0 right-0 left-64 glass-panel border-b border-dark-border flex items-center justify-between px-8 z-20">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-white tracking-wide">{title || 'Dashboard'}</h2>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        {/* Wallet Balance Badge */}
        {user && (
          <div className="flex items-center gap-2 bg-dark-card border border-dark-border px-3 py-1.5 rounded-xl">
            <FiDollarSign className="text-brand font-bold text-lg" />
            <div>
              <span className="text-xs text-dark-muted block leading-none font-mono">KES Wallet</span>
              <span className="text-sm font-bold text-white font-mono">{balance.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Notifications Icon */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted hover:text-white transition-colors"
          >
            <FiBell className="text-lg" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand rounded-full ring-2 ring-dark-bg animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel border border-dark-border rounded-2xl shadow-xl overflow-hidden py-2 z-50">
              <div className="px-4 py-2 border-b border-dark-border flex justify-between items-center">
                <span className="font-semibold text-sm text-white">Notifications</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-xs text-brand hover:underline font-mono"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-dark-muted font-mono">
                    No new alerts
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-dark-cardMuted/30 border-b border-dark-border/40 transition-colors last:border-b-0">
                      <p className="text-xs font-semibold text-white">{notif.title}</p>
                      <p className="text-[11px] text-dark-muted mt-0.5">{notif.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings shortcut */}
        <button className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted hover:text-white transition-colors">
          <FiSettings className="text-lg" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
