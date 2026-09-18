import React from 'react';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

const UPCOMING_RENEWALS_DATA = [
  {
    org: 'Apex Global Events',
    date: 'Oct 01, 2026',
    amount: '₹4,999',
    plan: 'Pro',
    daysLeft: 'in 14 days'
  },
  {
    org: 'Nexus Tech Summits',
    date: 'Oct 15, 2026',
    amount: '₹49,999',
    plan: 'Enterprise',
    daysLeft: 'in 28 days'
  },
  {
    org: 'Global Connect',
    date: 'Oct 21, 2026',
    amount: '₹4,999',
    plan: 'Pro',
    daysLeft: 'in 34 days'
  }
];

const UpcomingRenewals = ({ onViewAll }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-bold text-slate-900">
            Upcoming Renewals
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Next 45 days</span>
      </div>

      <div className="space-y-2.5">
        {UPCOMING_RENEWALS_DATA.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors text-xs"
          >
            <div className="min-w-0 pr-2">
              <p className="font-bold text-slate-900 truncate">{item.org}</p>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{item.date}</span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-600 font-semibold">{item.plan}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-extrabold text-slate-900 font-mono block">
                {item.amount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {item.daysLeft}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
      >
        <span>View All Renewals</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default UpcomingRenewals;
