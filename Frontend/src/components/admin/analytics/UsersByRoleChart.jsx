import React from 'react';
import {
  Users,
  Mic,
  Award,
  CheckSquare,
  Building,
  Shield
} from 'lucide-react';

const ROLE_DISTRIBUTION = [
  {
    name: 'Attendee',
    count: 31,
    percentage: 55,
    barColor: 'bg-blue-600',
    icon: Users,
    iconBg: 'bg-blue-50 text-blue-600'
  },
  {
    name: 'Sponsor',
    count: 11,
    percentage: 20,
    barColor: 'bg-amber-500',
    icon: Award,
    iconBg: 'bg-amber-50 text-amber-600'
  },
  {
    name: 'Speaker',
    count: 5,
    percentage: 9,
    barColor: 'bg-purple-600',
    icon: Mic,
    iconBg: 'bg-purple-50 text-purple-600'
  },
  {
    name: 'Staff',
    count: 5,
    percentage: 9,
    barColor: 'bg-cyan-600',
    icon: CheckSquare,
    iconBg: 'bg-cyan-50 text-cyan-600'
  },
  {
    name: 'Organizer',
    count: 3,
    percentage: 5,
    barColor: 'bg-emerald-600',
    icon: Building,
    iconBg: 'bg-emerald-50 text-emerald-600'
  },
  {
    name: 'Platform Admin',
    count: 1,
    percentage: 2,
    barColor: 'bg-slate-900',
    icon: Shield,
    iconBg: 'bg-slate-100 text-slate-800'
  }
];

const UsersByRoleChart = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between min-w-0 overflow-hidden h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Users by Role
          </h3>
          <span className="text-xs font-semibold text-slate-500">56 Total</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Distribution across verified platform roles.
        </p>

        <div className="space-y-3.5">
          {ROLE_DISTRIBUTION.map((role) => {
            const IconComp = role.icon;
            return (
              <div key={role.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${role.iconBg}`}>
                      <IconComp className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-800">{role.name}</span>
                  </div>
                  <span className="text-slate-600 font-semibold">
                    {role.count} <span className="text-slate-400 font-normal font-mono">({role.percentage}%)</span>
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${role.barColor}`}
                    style={{ width: `${role.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 text-[11px] text-slate-500 mt-4 flex items-center justify-between">
        <span>Highest Cohort: <strong>Attendees (55%)</strong></span>
        <span className="text-blue-600 font-semibold">6 Active Roles</span>
      </div>
    </div>
  );
};

export default UsersByRoleChart;
