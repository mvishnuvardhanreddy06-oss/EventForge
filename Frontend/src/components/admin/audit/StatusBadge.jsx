import React from 'react';

const StatusBadge = ({ status }) => {
  const isSuccess = (status || '').toLowerCase() === 'success';

  if (isSuccess) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
        <span>Success</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/70 shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
      <span>Failed</span>
    </span>
  );
};

export default StatusBadge;
