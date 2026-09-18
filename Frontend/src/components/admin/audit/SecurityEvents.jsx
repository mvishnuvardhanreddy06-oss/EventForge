import React from 'react';
import { ShieldAlert, ArrowUpRight, AlertTriangle, KeyRound, UserX, ShieldCheck } from 'lucide-react';

const SecurityEvents = ({ onSelectSecurityFilter }) => {
  const items = [
    {
      title: 'Failed login attempt',
      detail: 'Michael Chen · 192.168.1.67',
      time: 'Sep 16 · 05:20 PM',
      icon: AlertTriangle,
      filterQuery: 'Failed login attempt'
    },
    {
      title: 'Multiple failed login attempts',
      detail: 'External IP · 45.33.32.119 (Rate limited)',
      time: 'Sep 16 · 09:12 AM',
      icon: ShieldAlert,
      filterQuery: 'Multiple failed login'
    },
    {
      title: 'Password reset requested',
      detail: 'Sarah Jenkins · Email OTP sent',
      time: 'Sep 15 · 03:14 PM',
      icon: KeyRound,
      filterQuery: 'Password reset'
    },
    {
      title: 'Role permission changed',
      detail: 'David Wilson: Staff → Organizer',
      time: 'Sep 16 · 06:42 PM',
      icon: ShieldCheck,
      filterQuery: 'Role Changed'
    },
    {
      title: 'Account suspended',
      detail: 'User: Rahul Kumar · Compliance check',
      time: 'Sep 16 · 10:21 AM',
      icon: UserX,
      filterQuery: 'Suspended'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Security Events
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              High-priority events and access control modifications
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
          Active Monitoring
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSecurityFilter && onSelectSecurityFilter(item.filterQuery)}
              className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/70 hover:border-slate-300 rounded-xl p-3 text-left transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {item.detail}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                {item.time}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SecurityEvents;
