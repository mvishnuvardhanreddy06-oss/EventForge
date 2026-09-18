import React from 'react';
import { Calendar, CheckCircle2, Clock, FileEdit } from 'lucide-react';

const STATUS_DATA = [
  { label: 'Published', count: 3, percentage: 60, color: 'bg-emerald-500', icon: CheckCircle2 },
  { label: 'Draft', count: 1, percentage: 20, color: 'bg-amber-500', icon: FileEdit },
  { label: 'Completed', count: 1, percentage: 20, color: 'bg-slate-400', icon: Clock }
];

const LIFECYCLE_DATA = [
  { label: 'Upcoming', count: 3, percentage: 60, badge: 'text-emerald-700 bg-emerald-50' },
  { label: 'Ongoing', count: 1, percentage: 20, badge: 'text-blue-700 bg-blue-50' },
  { label: 'Completed', count: 1, percentage: 20, badge: 'text-slate-700 bg-slate-100' }
];

const EventsOverview = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between min-w-0 overflow-hidden h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Events Overview
          </h3>
          <span className="text-xs font-semibold text-slate-500">5 Total Summits</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Lifecycle status and execution states.
        </p>

        {/* Status Breakdown */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Publication Status
          </span>
          {STATUS_DATA.map((item) => {
            const IconComp = item.icon;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-1.5 text-slate-700 font-medium">
                    <IconComp className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.label}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {item.count} <span className="text-slate-400 font-normal font-mono">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Execution Lifecycle States */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Execution Timeline
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {LIFECYCLE_DATA.map((state) => (
              <div key={state.label} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60">
                <span className="text-[11px] text-slate-500 block">{state.label}</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{state.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 text-[11px] text-slate-500 mt-4 flex items-center justify-between">
        <span>Active Registrations Open: <strong>3 Summits</strong></span>
        <span className="text-emerald-600 font-semibold">100% On Schedule</span>
      </div>
    </div>
  );
};

export default EventsOverview;
