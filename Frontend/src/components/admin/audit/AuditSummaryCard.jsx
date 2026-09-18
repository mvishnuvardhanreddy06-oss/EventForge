import React from 'react';

const AuditSummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral'
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between min-w-0">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
            {title}
          </span>
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight my-1.5 truncate">
          {value}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1 text-xs border-t border-slate-100 pt-2 mt-1">
        <span className="text-slate-500 font-normal truncate text-[11px] sm:text-xs">
          {subtitle}
        </span>
        {trend && (
          <span
            className={`text-[11px] font-semibold inline-flex items-center shrink-0 ${
              trendType === 'positive'
                ? 'text-emerald-600'
                : trendType === 'warning'
                ? 'text-amber-600'
                : trendType === 'danger'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default AuditSummaryCard;
