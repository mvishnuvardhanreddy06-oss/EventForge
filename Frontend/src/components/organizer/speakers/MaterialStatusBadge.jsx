import React from 'react';
import { Check, Clock, AlertTriangle, FileCheck, FileX } from 'lucide-react';

const MATERIAL_CONFIG = {
  approved: {
    label: 'Materials Approved',
    icon: FileCheck,
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    prefix: '✓'
  },
  submitted: {
    label: 'Presentation Uploaded',
    icon: Check,
    bgClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    prefix: '✓'
  },
  'pending review': {
    label: 'Pending Review',
    icon: Clock,
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    prefix: '●'
  },
  'needs changes': {
    label: 'Needs Changes',
    icon: AlertTriangle,
    bgClass: 'bg-orange-50 text-orange-700 border-orange-200/80',
    prefix: '⚠'
  },
  'not submitted': {
    label: 'Presentation Pending',
    icon: FileX,
    bgClass: 'bg-slate-100 text-slate-600 border-slate-200',
    prefix: '⚠'
  }
};

const MaterialStatusBadge = ({ status = 'approved', size = 'sm', className = '' }) => {
  const normalized = (status || 'approved').toLowerCase();
  const config = MATERIAL_CONFIG[normalized] || MATERIAL_CONFIG.approved;
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
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

export default MaterialStatusBadge;
