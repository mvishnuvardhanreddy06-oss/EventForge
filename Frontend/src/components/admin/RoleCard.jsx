import React from 'react';

const RoleCard = ({
  role,
  count,
  icon: Icon,
  accentColor = 'text-blue-600 bg-blue-50'
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-sm hover:border-blue-200 hover:shadow transition-all flex flex-col justify-between min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-1 mb-2 min-w-0">
        <span className="text-xs font-bold text-slate-600 capitalize truncate">
          {role}
        </span>
        <div className={`p-1.5 rounded-lg shrink-0 ${accentColor}`}>
          {Icon && <Icon className="w-3.5 h-3.5" />}
        </div>
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
          {count}
        </p>
        <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate">
          Verified Accounts
        </p>
      </div>
    </div>
  );
};

export default RoleCard;
