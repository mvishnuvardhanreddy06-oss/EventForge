import React from 'react';

const SettingCard = ({
  title,
  subtitle,
  children,
  badge,
  actionButton
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SettingCard;
