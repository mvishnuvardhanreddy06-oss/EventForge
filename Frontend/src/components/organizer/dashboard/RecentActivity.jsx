import React from 'react';
import { Check, Clock, User, Upload, CreditCard, Building } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      text: 'Priya Sharma registered for Global Tech Leadership Summit',
      time: '5 minutes ago',
      icon: User,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200/60'
    },
    {
      text: 'Speaker Sarah Wilson uploaded presentation material',
      time: '32 minutes ago',
      icon: Upload,
      color: 'text-blue-600 bg-blue-50 border-blue-200/60'
    },
    {
      text: 'Sponsor TechNova completed payment',
      time: '1 hour ago',
      icon: CreditCard,
      color: 'text-amber-600 bg-amber-50 border-amber-200/60'
    },
    {
      text: 'Organizer updated Main Hall capacity',
      time: '2 hours ago',
      icon: Building,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200/60'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Recent Activity
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time updates from your attendee and event streams.
        </p>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((act, i) => {
          const Icon = act.icon;
          return (
            <div key={i} className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${act.color}`}
              >
                <Icon className="w-2.5 h-2.5" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-slate-800 leading-snug">
                  {act.text}
                </p>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {act.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
