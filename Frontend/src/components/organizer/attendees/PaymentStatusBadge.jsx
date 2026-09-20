import React from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  paid: {
    label: 'Paid',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    iconClass: 'text-emerald-600'
  },
  pending: {
    label: 'Payment Pending',
    icon: AlertCircle,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconClass: 'text-amber-600'
  },
  partially_paid: {
    label: 'Partially Paid',
    icon: Clock,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    iconClass: 'text-blue-600'
  },
  refunded: {
    label: 'Refunded',
    icon: RefreshCw,
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200/80',
    iconClass: 'text-slate-500'
  },
  free: {
    label: 'Free Pass',
    icon: CheckCircle2,
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80',
    iconClass: 'text-sky-600'
  }
};

const PaymentStatusBadge = ({
  status = 'paid',
  amount = null,
  showAmount = true,
  className = ''
}) => {
  const normalizedStatus = String(status).toLowerCase().replace(/[\s-]/g, '_');
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.paid;
  const Icon = config.icon;

  const formattedAmount = amount !== null && amount !== undefined
    ? (typeof amount === 'number' ? `₹${amount.toLocaleString('en-IN')}` : amount)
    : null;

  return (
    <div className={`inline-flex flex-col items-start space-y-0.5 ${className}`}>
      {showAmount && formattedAmount && (
        <span className="font-mono font-bold text-xs text-slate-900">
          {formattedAmount}
        </span>
      )}
      <span
        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-tight shrink-0 select-none ${config.badgeClass}`}
      >
        <Icon className={`w-2.5 h-2.5 shrink-0 ${config.iconClass}`} />
        <span>{config.label}</span>
      </span>
    </div>
  );
};

export default PaymentStatusBadge;
