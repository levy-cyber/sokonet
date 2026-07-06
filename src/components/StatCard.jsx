import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendType = 'up' }) => {
  // Force re-render
  const iconContent = typeof Icon === 'function' ? <Icon className="text-lg w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> : <span className="text-xl sm:text-2xl">📊</span>;
  return (
    <div className="glass-panel p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-brand/40 group">
      {/* Mini-glow background on hover */}
      <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <span className="text-[9px] sm:text-[10px] lg:text-xs text-dark-muted font-medium uppercase tracking-wider">{title}</span>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mt-1 sm:mt-2 tracking-tight line-clamp-1">{value}</h3>

          {trend && (
            <div className="flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
              <span className={`text-[9px] sm:text-[10px] lg:text-xs font-mono font-semibold ${trendType === 'up' ? 'text-brand' : 'text-red-400'}`}>
                {trendType === 'up' ? '+' : ''}{trend}
              </span>
              <span className="text-[8px] sm:text-[10px] lg:text-[10px] text-dark-muted font-medium hidden sm:block">vs last month</span>
            </div>
          )}
        </div>

        <div className="p-1.5 sm:p-2 lg:p-3 bg-dark-card border border-dark-border rounded-lg lg:rounded-xl text-brand group-hover:text-brand group-hover:border-brand/30 transition-all duration-300 shadow-sm flex-shrink-0">
          {iconContent}
        </div>
      </div>
    </div>
  );
};

export default StatCard;