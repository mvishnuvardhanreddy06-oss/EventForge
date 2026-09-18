import React from 'react';
import { Calendar, Clock, Users, IndianRupee, Activity } from 'lucide-react';

const OrganizerKPICards = () => {
  const kpis = [
    {
      title: 'TOTAL EVENTS',
      value: '12',
      trend: '+2 this month',
      trendType: 'positive',
      icon: Calendar
    },
    {
      title: 'UPCOMING EVENTS',
      value: '4',
      trend: 'Next event in 3 days',
      trendType: 'neutral',
      icon: Clock
    },
    {
      title: 'TOTAL REGISTRATIONS',
      value: '2,846',
      trend: '+18.4% this month',
      trendType: 'positive',
      icon: Users
    },
    {
      title: 'TOTAL REVENUE',
      value: '₹8,42,500',
      trend: '+12.6% this month',
      trendType: 'positive',
      icon: IndianRupee
    },
    {
      title: 'ACTIVE EVENTS',
      value: '3',
      trend: 'Currently running',
      trendType: 'active',
      icon: Activity
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between min-w-0"
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                <div className="w-7 h-7 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight my-2 truncate">
                {kpi.value}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-2 mt-1">
              <span
                className={`text-[11px] font-semibold truncate block ${
                  kpi.trendType === 'positive'
                    ? 'text-emerald-600'
                    : kpi.trendType === 'active'
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500'
                }`}
              >
                {kpi.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrganizerKPICards;
