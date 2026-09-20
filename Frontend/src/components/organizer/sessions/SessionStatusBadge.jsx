import React from 'react';
import { CalendarCheck, FileEdit, Radio, CheckCircle2, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  scheduled: {
    label: 'Scheduled',
    icon: CalendarCheck,
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500'
  },
  draft: {
    label: 'Draft',
    icon: FileEdit,
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500'
  },
  live: {
    label: 'Live Now',
    icon: Radio,
    bgClass: 'bg-rose-50 text-rose-700 border-rose-200/80 animate-pulse',
    dotClass: 'bg-rose-500'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    bgClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dotClass: 'bg-blue-500'
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    bgClass: 'bg-slate-100 text-slate-600 border-slate-200',
    dotClass: 'bg-slate-400'
  }
};

const SessionStatusBadge = ({ status = 'scheduled', size = 'sm', className = '' }) => {
  const normalized = (status || 'scheduled').toLowerCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.scheduled;
  const Icon = config.icon;

  const sizeClasses = size === 'xs'
    ? 'px-2 py-0.5 text-[11px] gap-1'
    : size === 'md'
    ? 'px-3 py-1 text-xs gap-1.5'
    : 'px-2.5 py-0.5 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-2xs ${config.bgClass} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

export default SessionStatusBadge;
