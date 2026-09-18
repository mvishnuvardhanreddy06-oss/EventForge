import React from 'react';
import { getStatusBadgeColor } from '../utils/formatters';

const Badge = ({ children, status, className = '' }) => {
  const colorStyle = status ? getStatusBadgeColor(status) : 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorStyle} ${className}`}>
      {children || status}
    </span>
  );
};

export default Badge;
