import React from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  CalendarCheck2,
  UserX
} from 'lucide-react';

const StaffSummaryCards = ({ metrics, activeFilter, onFilterChange }) => {
  const cards = [
    {
      id: 'total',
      title: 'TOTAL STAFF',
      value: metrics?.totalStaff || 48,
      icon: Users,
      trend: 'Operations Team',
      subtext: 'Across all managed events',
      bgClass: 'bg-slate-50 border-slate-200 text-slate-700',
      colorClass: 'text-slate-900',
      filterKey: 'status',
      filterValue: 'all'
    },
    {
      id: 'active',
      title: 'ACTIVE',
      value: metrics?.activeStaff || 42,
      icon: UserCheck,
      trend: '87.5% operational',
      subtext: 'Ready for deployments',
      bgClass: 'bg-emerald-50/80 border-emerald-200 text-emerald-700',
      colorClass: 'text-emerald-700',
      filterKey: 'status',
      filterValue: 'Active'
    },
    {
      id: 'onDuty',
      title: 'ON DUTY',
      value: metrics?.onDutyStaff || 28,
      icon: ShieldCheck,
      trend: 'Live on venue',
      subtext: 'Currently deployed',
      bgClass: 'bg-blue-50/80 border-blue-200 text-blue-700',
      colorClass: 'text-blue-700',
      filterKey: 'attendance',
      filterValue: 'On Duty'
    },
    {
      id: 'shiftsToday',
      title: 'SHIFTS TODAY',
      value: metrics?.shiftsToday || 18,
      icon: CalendarCheck2,
      trend: 'Scheduled & running',
      subtext: 'Roster coverage today',
      bgClass: 'bg-indigo-50/80 border-indigo-200 text-indigo-700',
      colorClass: 'text-indigo-700',
      filterKey: 'shift',
      filterValue: 'Today'
    },
    {
      id: 'unassigned',
      title: 'UNASSIGNED',
      value: metrics?.unassignedStaff || 6,
      icon: UserX,
      trend: 'Available pool',
      subtext: 'Awaiting venue / session',
      bgClass: 'bg-amber-50/80 border-amber-200 text-amber-700',
      colorClass: 'text-amber-700',
      filterKey: 'assignment',
      filterValue: 'Unassigned'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter && activeFilter[card.filterKey] === card.filterValue;

        return (
          <div
            key={card.id}
            onClick={() => onFilterChange && onFilterChange(card.filterKey, card.filterValue)}
            className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all duration-200 cursor-pointer hover:shadow-xs hover:border-slate-300 ${
              isActive
                ? 'ring-2 ring-blue-600 border-blue-400 shadow-xs'
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
              {card.trend && (
                <span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200/60">
                  {card.trend}
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

export default StaffSummaryCards;
