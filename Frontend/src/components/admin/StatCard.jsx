import React from 'react';

const StatCard = ({
  title,
  value,
  trend,
  trendType = 'positive',
  subtitle,
  icon: Icon
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between min-w-0 overflow-hidden">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
            {title}
          </span>
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight my-2 truncate">
          {value}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs border-t border-slate-100/90 pt-2.5 mt-1">
        {trend && (
          <span
            className={`font-semibold inline-flex items-center shrink-0 ${
              trendType === 'positive'
                ? 'text-emerald-600'
                : trendType === 'neutral'
                ? 'text-slate-600'
                : 'text-rose-600'
            }`}
          >
            {trend}
          </span>
        )}
        <span className="text-slate-500 font-normal truncate ml-auto text-[11px] sm:text-xs">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
