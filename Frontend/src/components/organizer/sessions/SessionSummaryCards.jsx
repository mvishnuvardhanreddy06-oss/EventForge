import React from 'react';
import { Clock, CalendarCheck, FileEdit, XCircle } from 'lucide-react';

const SessionSummaryCards = ({ stats, activeFilter, onFilterChange }) => {
  const cards = [
    {
      id: 'all',
      title: 'TOTAL SESSIONS',
      value: stats.total,
      icon: Clock,
      colorClass: 'text-slate-900',
      bgClass: 'bg-slate-50 border-slate-200 text-slate-700',
      subtext: 'Across full event agenda',
      filterValue: 'all'
    },
    {
      id: 'scheduled',
      title: 'SCHEDULED',
      value: stats.scheduled,
      icon: CalendarCheck,
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-700',
      subtext: 'Confirmed time & room slots',
      filterValue: 'scheduled'
    },
    {
      id: 'draft',
      title: 'DRAFT',
      value: stats.draft,
      icon: FileEdit,
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50/70 border-amber-200 text-amber-700',
      subtext: 'Pending speaker or room setup',
      filterValue: 'draft'
    },
    {
      id: 'cancelled',
      title: 'CANCELLED',
      value: stats.cancelled,
      icon: XCircle,
      colorClass: 'text-rose-700',
      bgClass: 'bg-rose-50/70 border-rose-200 text-rose-700',
      subtext: 'Withdrawn from active schedule',
      filterValue: 'cancelled'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = Boolean(card.filterValue);
        const isActive = activeFilter === card.filterValue;

        return (
          <div
            key={card.id}
            onClick={() => isClickable && onFilterChange?.(card.filterValue)}
            className={`bg-white rounded-2xl border p-4.5 shadow-2xs transition-all duration-200 ${
              isClickable ? 'cursor-pointer hover:shadow-xs hover:border-slate-300' : ''
            } ${
              isActive
                ? 'ring-2 ring-blue-600 border-blue-300 shadow-xs'
                : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.bgClass}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className={`text-2xl font-black tracking-tight ${card.colorClass}`}>
                {card.value}
              </span>
              {isActive && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Filtered
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SessionSummaryCards;
