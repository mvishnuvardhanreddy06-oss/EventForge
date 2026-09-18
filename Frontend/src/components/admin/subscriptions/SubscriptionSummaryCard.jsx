import React from 'react';

const SubscriptionSummaryCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendType = 'positive'
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
            {title}
          </span>
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight my-2">
          {value}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs border-t border-slate-100 pt-2.5 mt-1">
        {trend && (
          <span
            className={`font-semibold inline-flex items-center shrink-0 text-[11px] ${
              trendType === 'positive'
                ? 'text-emerald-600 bg-emerald-50/80 px-1.5 py-0.5 rounded-md'
                : trendType === 'warning'
                ? 'text-amber-600 bg-amber-50/80 px-1.5 py-0.5 rounded-md'
                : trendType === 'neutral'
                ? 'text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md'
                : 'text-rose-600 bg-rose-50/80 px-1.5 py-0.5 rounded-md'
            }`}
          >
            {trend}
          </span>
        )}
        <span className="text-slate-500 text-[11px] font-medium truncate ml-auto">
          {description}
        </span>
      </div>
    </div>
  );
};

export default SubscriptionSummaryCard;
