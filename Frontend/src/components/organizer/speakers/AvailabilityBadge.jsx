import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const AVAILABILITY_CONFIG = {
  available: {
    label: 'Available',
    icon: CheckCircle2,
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500'
  },
  'partially available': {
    label: 'Partially Available',
    icon: Clock,
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500'
  },
  unavailable: {
    label: 'Unavailable',
    icon: AlertCircle,
    bgClass: 'bg-slate-100 text-slate-600 border-slate-200',
    dotClass: 'bg-slate-400'
  }
};

const AvailabilityBadge = ({ availability = 'available', size = 'sm', className = '' }) => {
  const normalized = (availability || 'available').toLowerCase();
  const config = AVAILABILITY_CONFIG[normalized] || AVAILABILITY_CONFIG.available;
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

export default AvailabilityBadge;
