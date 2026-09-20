import React from 'react';
import { CheckCircle2, CalendarCheck, AlertTriangle, PauseCircle } from 'lucide-react';

const STATUS_CONFIG = {
  available: {
    label: 'Available',
    icon: CheckCircle2,
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500'
  },
  booked: {
    label: 'Booked',
    icon: CalendarCheck,
    bgClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dotClass: 'bg-blue-500'
  },
  maintenance: {
    label: 'Maintenance',
    icon: AlertTriangle,
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500'
  },
  inactive: {
    label: 'Inactive',
    icon: PauseCircle,
    bgClass: 'bg-slate-100 text-slate-600 border-slate-200',
    dotClass: 'bg-slate-400'
  }
};

const VenueStatusBadge = ({ status = 'available', size = 'sm', className = '' }) => {
  const normalized = (status || 'available').toLowerCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.available;
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

export default VenueStatusBadge;
