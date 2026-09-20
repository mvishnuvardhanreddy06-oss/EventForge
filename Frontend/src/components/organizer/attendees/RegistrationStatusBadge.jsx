import React from 'react';
import { CheckCircle2, Clock, XCircle, Ban, Hourglass } from 'lucide-react';

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    iconClass: 'text-emerald-600'
  },
  pending: {
    label: 'Pending Approval',
    icon: Clock,
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconClass: 'text-amber-600'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    bgClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    iconClass: 'text-rose-600'
  },
  cancelled: {
    label: 'Cancelled',
    icon: Ban,
    bgClass: 'bg-slate-100 text-slate-600 border-slate-200/80',
    iconClass: 'text-slate-500'
  },
  waitlisted: {
    label: 'Waitlisted',
    icon: Hourglass,
    bgClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
    iconClass: 'text-purple-600'
  }
};

const RegistrationStatusBadge = ({ status = 'pending', className = '', queuePosition = null }) => {
  const normalizedStatus = String(status).toLowerCase().trim();
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-tight shrink-0 select-none ${config.bgClass} ${className}`}
    >
      <Icon className={`w-3 h-3 shrink-0 ${config.iconClass}`} />
      <span>{config.label}</span>
      {normalizedStatus === 'waitlisted' && queuePosition && (
        <span className="ml-1 px-1.5 py-0.2 rounded bg-purple-200/60 text-purple-900 text-[10px] font-extrabold font-mono">
          #{queuePosition}
        </span>
      )}
    </span>
  );
};

export default RegistrationStatusBadge;
