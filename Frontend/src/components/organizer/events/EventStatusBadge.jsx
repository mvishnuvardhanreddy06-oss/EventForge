import React from 'react';
import { CheckCircle2, FileEdit, Radio, Award, XCircle } from 'lucide-react';

const EventStatusBadge = ({ status = 'draft', className = '' }) => {
  const normStatus = (status || 'draft').toLowerCase();

  switch (normStatus) {
    case 'published':
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="uppercase tracking-wider">Published</span>
        </span>
      );
    case 'ongoing':
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
          <span className="uppercase tracking-wider">Ongoing</span>
        </span>
      );
    case 'completed':
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/70 ${className}`}>
          <Award className="w-3 h-3 text-purple-600 shrink-0" />
          <span className="uppercase tracking-wider">Completed</span>
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/70 ${className}`}>
          <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
          <span className="uppercase tracking-wider">Cancelled</span>
        </span>
      );
    case 'draft':
    default:
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70 ${className}`}>
          <FileEdit className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="uppercase tracking-wider">Draft</span>
        </span>
      );
  }
};

export default EventStatusBadge;
