import React from 'react';
import { FiLock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const EscrowCard = ({ escrow, userRole, onRelease, onDispute, onResolve }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Held':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'Released':
        return 'bg-brand/10 border-brand/20 text-brand';
      case 'Refunded':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'Disputed':
        return 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse';
      default:
        return 'bg-dark-cardMuted border-dark-border text-dark-muted';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-dark-border hover:border-dark-border/80 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono text-dark-muted">CONTRACT #{escrow._id}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-semibold ${getStatusStyle(escrow.status)}`}>
            {escrow.status}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted shrink-0">
            <FiLock />
          </div>
          <div>
            <span className="text-[10px] text-dark-muted block uppercase font-mono leading-none">Locked Escrow</span>
            <span className="text-lg font-bold text-white font-mono mt-1 block">
              KES {escrow.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 border-t border-dark-border/40 pt-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-dark-muted block">Buyer</span>
            <span className="text-white font-medium block truncate mt-0.5">{escrow.buyer?.name || 'Loading'}</span>
          </div>
          <div>
            <span className="text-[10px] text-dark-muted block">Seller</span>
            <span className="text-white font-medium block truncate mt-0.5">{escrow.seller?.name || 'Loading'}</span>
          </div>
        </div>

        {escrow.disputeReason && (
          <div className="mt-4 p-2.5 bg-red-950/20 border border-red-900/30 rounded-xl">
            <span className="text-[9px] text-red-400 font-bold block uppercase font-mono">Dispute Reason</span>
            <p className="text-xs text-red-300 mt-0.5 font-sans leading-relaxed">{escrow.disputeReason}</p>
          </div>
        )}
      </div>

      {/* Action Buttons based on roles and current status */}
      <div className="mt-6 flex flex-col gap-2 pt-2 border-t border-dark-border/40">
        {escrow.status === 'Held' && userRole === 'buyer' && (
          <button
            onClick={() => onRelease && onRelease(escrow)}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-brand hover:bg-brand-dark text-black font-bold text-xs rounded-xl transition-all shadow-glow-green/5"
          >
            <FiCheckCircle />
            <span>Confirm Delivery & Release</span>
          </button>
        )}

        {escrow.status === 'Held' && (userRole === 'buyer' || userRole === 'seller') && (
          <button
            onClick={() => onDispute && onDispute(escrow)}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 hover:border-red-500/40 text-red-400 font-semibold text-xs rounded-xl transition-all"
          >
            <FiAlertTriangle />
            <span>Raise Dispute</span>
          </button>
        )}

        {escrow.status === 'Disputed' && userRole === 'admin' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onResolve && onResolve(escrow, 'Release')}
              className="py-2 bg-brand hover:bg-brand-dark text-black font-bold text-[10px] rounded-xl transition-colors"
            >
              Release to Seller
            </button>
            <button
              onClick={() => onResolve && onResolve(escrow, 'Refund')}
              className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-xl transition-colors"
            >
              Refund to Buyer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowCard;
