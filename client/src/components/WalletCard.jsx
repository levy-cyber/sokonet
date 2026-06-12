import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

const WalletCard = ({ balance, currency }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-br from-dark-card to-dark-cardMuted border border-dark-border shadow-2xl">
      {/* Decorative cybernetic overlay */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full"></div>

      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs text-dark-muted font-mono tracking-widest uppercase">Digital Wallet Balance</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {balance ? balance.toLocaleString() : '0'}
            </span>
            <span className="text-brand font-bold font-mono text-sm">{currency || 'KES'}</span>
          </div>
          <span className="text-[10px] text-brand/80 font-mono mt-1 block">Active Escrow Wallet Linked</span>
        </div>

        <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand">
          <FiDollarSign className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
