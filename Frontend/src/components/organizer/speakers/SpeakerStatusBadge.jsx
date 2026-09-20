import React from 'react';
import { CheckCircle2, Clock, Send, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500'
  },
  invited: {
    label: 'Invited',
    icon: Send,
    bgClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dotClass: 'bg-blue-500'
  },
  declined: {
    label: 'Declined',
    icon: XCircle,
    bgClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dotClass: 'bg-rose-500'
  }
};

const SpeakerStatusBadge = ({ status = 'confirmed', size = 'sm', className = '' }) => {
  const normalized = (status || 'confirmed').toLowerCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.confirmed;
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

export default SpeakerStatusBadge;
