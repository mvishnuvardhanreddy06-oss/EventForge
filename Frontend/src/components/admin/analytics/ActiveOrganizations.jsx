import React from 'react';
import { Building2, Award } from 'lucide-react';

const ORG_RANKINGS = [
  {
    rank: 1,
    name: 'Apex Global Events',
    events: 12,
    registrations: 3240,
    percentage: 42,
    color: 'bg-blue-600'
  },
  {
    rank: 2,
    name: 'Nexus Tech Summits',
    events: 8,
    registrations: 2140,
    percentage: 31,
    color: 'bg-indigo-600'
  },
  {
    rank: 3,
    name: 'TechWorld & CloudScale',
    events: 5,
    registrations: 1820,
    percentage: 27,
    color: 'bg-emerald-600'
  }
];

const ActiveOrganizations = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between min-w-0 overflow-hidden h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Most Active Organizations
          </h3>
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Ranked by hosted events, registrations, and platform volume.
        </p>

        <div className="space-y-4">
          {ORG_RANKINGS.map((org) => (
            <div key={org.rank} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {org.rank}
                  </span>
                  <span className="font-bold text-slate-900 truncate">
                    {org.name}
                  </span>
                </div>
                <span className="font-semibold text-slate-800 shrink-0 font-mono">
                  {org.percentage}%
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${org.color}`}
                  style={{ width: `${org.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{org.events} Events Hosted</span>
                <span>{org.registrations.toLocaleString()} Registrations</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 text-[11px] text-slate-500 mt-4 flex items-center justify-between">
        <span>Top Contributor: <strong>Apex Events (42%)</strong></span>
        <span className="text-emerald-600 font-semibold">High Engagement</span>
      </div>
    </div>
  );
};

export default ActiveOrganizations;
