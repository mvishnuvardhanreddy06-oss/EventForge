import React from 'react';
import { Users, CheckCircle2, Clock, AlertTriangle, CalendarCheck } from 'lucide-react';

const SpeakerSummaryCards = ({ stats, activeFilter, onFilterChange }) => {
  const cards = [
    {
      id: 'all',
      title: 'TOTAL SPEAKERS',
      value: stats.total,
      icon: Users,
      colorClass: 'text-slate-900',
      bgClass: 'bg-slate-50 border-slate-200 text-slate-700',
      subtext: 'Across managed events',
      filterType: 'status',
      filterValue: 'all'
    },
    {
      id: 'confirmed',
      title: 'CONFIRMED',
      value: stats.confirmed,
      icon: CheckCircle2,
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-700',
      subtext: 'Ready for active agenda',
      filterType: 'status',
      filterValue: 'confirmed'
    },
    {
      id: 'pending',
      title: 'PENDING',
      value: stats.pending,
      icon: Clock,
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50/70 border-amber-200 text-amber-700',
      subtext: 'Awaiting confirmation',
      filterType: 'status',
      filterValue: 'pending'
    },
    {
      id: 'materials',
      title: 'MATERIALS PENDING',
      value: stats.materialsPending,
      icon: AlertTriangle,
      colorClass: 'text-orange-700',
      bgClass: 'bg-orange-50/70 border-orange-200 text-orange-700',
      subtext: 'Slides or bio awaiting review',
      filterType: 'materials',
      filterValue: 'pending'
    },
    {
      id: 'assigned',
      title: 'SESSIONS ASSIGNED',
      value: stats.sessionsAssigned,
      icon: CalendarCheck,
      colorClass: 'text-blue-700',
      bgClass: 'bg-blue-50/70 border-blue-200 text-blue-700',
      subtext: 'Keynotes, workshops & panels',
      filterType: 'session',
      filterValue: null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = Boolean(card.filterValue);
        const isActive = activeFilter === card.filterValue;

        return (
          <div
            key={card.id}
            onClick={() => isClickable && onFilterChange?.(card.filterType, card.filterValue)}
            className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all duration-200 ${
              isClickable ? 'cursor-pointer hover:shadow-xs hover:border-slate-300' : ''
            } ${
              isActive
                ? 'ring-2 ring-blue-600 border-blue-300 shadow-xs'
                : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-xl border ${card.bgClass}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <span className={`text-2xl font-black tracking-tight ${card.colorClass}`}>
                {card.value}
              </span>
              {isActive && (
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">
                  Filtered
                </span>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SpeakerSummaryCards;
