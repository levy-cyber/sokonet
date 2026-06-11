import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendType = 'up' }) => {
  // Force re-render
  const iconContent = typeof Icon === 'function' ? <Icon className="text-xl w-5 h-5 lg:w-6 lg:h-6" /> : <span className="text-2xl">📊</span>;
  return (
    <div className="glass-panel p-4 lg:p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-brand/40 group">
      {/* Mini-glow background on hover */}
      <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <span className="text-[10px] lg:text-xs text-dark-muted font-medium uppercase tracking-wider">{title}</span>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mt-2 tracking-tight">{value}</h3>

          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={`text-[10px] lg:text-xs font-mono font-semibold ${trendType === 'up' ? 'text-brand' : 'text-red-400'}`}>
                {trendType === 'up' ? '+' : ''}{trend}
              </span>
              <span className="text-[8px] lg:text-[10px] text-dark-muted font-medium hidden sm:block">vs last month</span>
            </div>
          )}
        </div>

        <div className="p-2 lg:p-3 bg-dark-card border border-dark-border rounded-xl text-brand group-hover:text-brand group-hover:border-brand/30 transition-all duration-300 shadow-sm">
          {iconContent}
        </div>
      </div>
    </div>
  );
};

export default StatCard;