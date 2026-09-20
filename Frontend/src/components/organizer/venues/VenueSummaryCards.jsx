import React from 'react';
import { Building2, CheckCircle2, CalendarClock, Users } from 'lucide-react';

const VenueSummaryCards = ({ stats, activeFilter, onFilterChange }) => {
  const cards = [
    {
      id: 'all',
      title: 'TOTAL VENUES',
      value: stats.total,
      icon: Building2,
      colorClass: 'text-slate-900',
      bgClass: 'bg-slate-50 border-slate-200 text-slate-700',
      badgeClass: 'bg-slate-100 text-slate-700',
      subtext: 'Across all managed cities',
      filterValue: 'all'
    },
    {
      id: 'available',
      title: 'AVAILABLE',
      value: stats.available,
      icon: CheckCircle2,
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-700',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      subtext: 'Ready for new bookings',
      filterValue: 'available'
    },
    {
      id: 'booked',
      title: 'CURRENTLY BOOKED',
      value: stats.booked,
      icon: CalendarClock,
      colorClass: 'text-blue-700',
      bgClass: 'bg-blue-50/70 border-blue-200 text-blue-700',
      badgeClass: 'bg-blue-100 text-blue-800',
      subtext: 'Active event assignments',
      filterValue: 'booked'
    },
    {
      id: 'capacity',
      title: 'TOTAL CAPACITY',
      value: stats.totalCapacity.toLocaleString(),
      icon: Users,
      colorClass: 'text-indigo-700',
      bgClass: 'bg-indigo-50/70 border-indigo-200 text-indigo-700',
      badgeClass: 'bg-indigo-100 text-indigo-800',
      subtext: 'Maximum simultaneous attendees',
      filterValue: null
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

export default VenueSummaryCards;
