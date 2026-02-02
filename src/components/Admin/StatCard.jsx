import React from 'react';

/**
 * @param {string} title - The label for the metric (e.g., "Total Tea Stock")
 * @param {string} value - The actual number or amount
 * @param {React.ElementType} icon - The Lucide icon component
 * @param {string} trend - Optional percentage change (e.g., "+12%")
 * @param {string} color - The text color for the icon container
 */
const StatCard = ({ title, value, icon: Icon, trend, color = "text-emerald-500" }) => {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[30px] hover:border-emerald-500/50 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-[0.2em]">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {value}
          </h3>
          
          {trend && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500`}>
                {trend}
              </span>
              <span className="text-white/20 text-[10px] font-medium uppercase tracking-wider">
                vs last month
              </span>
            </div>
          )}
        </div>

        <div className={`p-4 rounded-2xl bg-white/5 ${color} group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;