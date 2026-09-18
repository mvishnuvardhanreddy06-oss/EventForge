import React from 'react';

const UserSummaryCard = ({
  label,
  count,
  subtext,
  icon: Icon,
  color,
  active,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer ${
        active
          ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-sm'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {count}
      </div>
      <p className="text-xs text-slate-500 mt-1 font-medium truncate">
        {subtext}
      </p>
    </div>
  );
};

export default UserSummaryCard;
