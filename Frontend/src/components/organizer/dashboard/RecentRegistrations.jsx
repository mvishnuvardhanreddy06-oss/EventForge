import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RecentRegistrations = () => {
  const registrations = [
    {
      name: 'Rahul Kumar',
      avatar: 'RK',
      event: 'Global Tech Leadership Summit',
      ticket: 'VIP',
      date: 'Today',
      status: 'Confirmed'
    },
    {
      name: 'Priya Sharma',
      avatar: 'PS',
      event: 'AI & Cloud Innovation Conference',
      ticket: 'Standard',
      date: 'Today',
      status: 'Confirmed'
    },
    {
      name: 'Ananya Reddy',
      avatar: 'AR',
      event: 'Global Tech Leadership Summit',
      ticket: 'Standard',
      date: 'Yesterday',
      status: 'Pending'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Registrations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest attendee passes claimed across your conferences.
          </p>
        </div>
        <Link
          to="/organizer/registrations"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <span>View All Registrations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {registrations.map((reg, idx) => (
          <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {reg.avatar}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-xs block truncate">
                  {reg.name}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {reg.event}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {reg.ticket}
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                {reg.date}
              </span>
              <span
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  reg.status === 'Confirmed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    reg.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>{reg.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRegistrations;
