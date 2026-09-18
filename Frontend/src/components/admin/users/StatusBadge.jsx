import React from 'react';

const STATUS_CONFIGS = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
  },
  pending: {
    label: 'Pending',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/70'
  },
  suspended: {
    label: 'Suspended',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/70'
  },
  inactive: {
    label: 'Inactive',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-200/70'
  }
};

const StatusBadge = ({ status }) => {
  const normalized = (status || 'active').toLowerCase();
  const config = STATUS_CONFIGS[normalized] || STATUS_CONFIGS.inactive;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.badge} select-none`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
