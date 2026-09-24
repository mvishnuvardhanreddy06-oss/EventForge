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
    <div className="panel p-4 sm:p-5 hover:border-accent/40 transition-all flex flex-col justify-between min-w-0 overflow-hidden">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider truncate">
            {title}
          </span>
          {Icon && <Icon className="w-4 h-4 text-muted shrink-0" />}
        </div>
        <p className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight my-2 truncate">
          {value}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs border-t border-line pt-2.5 mt-1">
        {trend && (
          <span
            className={`font-semibold inline-flex items-center shrink-0 ${
              trendType === 'positive'
                ? 'text-teal'
                : trendType === 'neutral'
                ? 'text-muted'
                : 'text-accent'
            }`}
          >
            {trend}
          </span>
        )}
        <span className="text-muted font-normal truncate ml-auto text-[11px] sm:text-xs">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
