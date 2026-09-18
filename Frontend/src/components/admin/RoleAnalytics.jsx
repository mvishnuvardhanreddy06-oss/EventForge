import React from 'react';
import {
  Ticket,
  Award,
  Mic,
  ShieldCheck,
  Building2,
  UserCheck
} from 'lucide-react';

const RoleAnalytics = ({ roleCounts = {} }) => {
  const roles = [
    {
      role: 'Attendee',
      count: roleCounts.attendee ?? 31,
      percentage: 55.4,
      icon: Ticket,
      color: 'bg-blue-600'
    },
    {
      role: 'Sponsor',
      count: roleCounts.sponsor ?? 11,
      percentage: 19.6,
      icon: Award,
      color: 'bg-indigo-500'
    },
    {
      role: 'Speaker',
      count: roleCounts.speaker ?? 5,
      percentage: 8.9,
      icon: Mic,
      color: 'bg-sky-500'
    },
    {
      role: 'Staff',
      count: roleCounts.staff ?? 5,
      percentage: 8.9,
      icon: ShieldCheck,
      color: 'bg-emerald-500'
    },
    {
      role: 'Organizer',
      count: roleCounts.organizer ?? 3,
      percentage: 5.4,
      icon: Building2,
      color: 'bg-amber-500'
    },
    {
      role: 'Admin',
      count: roleCounts.admin ?? 1,
      percentage: 1.8,
      icon: UserCheck,
      color: 'bg-purple-500'
    }
  ];

  const totalUsers = Object.values(roleCounts).reduce((acc, v) => acc + (v || 0), 0) || 56;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Users by System Role
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalUsers} users across 6 verified roles
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          100% Account Verification
        </span>
      </div>

      {/* Compact Horizontal Progress Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3.5">
        {roles.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.role} className="space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700 truncate">{item.role}</span>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className="font-bold text-slate-900">{item.count}</span>
                  <span className="text-[11px] text-slate-400">({item.percentage}%)</span>
                </div>
              </div>
              {/* Horizontal Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleAnalytics;
