import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { staffService } from '../../../services/staffService';

const WorkloadIndicator = ({ staff }) => {
  const { percentage, assignmentsCount, isOverloaded } = staffService.calculateWorkload(staff);

  const getBarColor = () => {
    if (percentage >= 80) return 'bg-rose-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-blue-600';
  };

  return (
    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Workload Analysis
        </span>
        <span className={`text-xs font-black ${percentage >= 80 ? 'text-rose-600' : 'text-slate-800'}`}>
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
        />
      </div>

      {/* Breakdown counters */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 text-center">
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Assignments</p>
          <p className="text-xs font-bold text-slate-800">{assignmentsCount}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Today</p>
          <p className="text-xs font-bold text-slate-800">{staff.attendanceStatus === 'On Duty' ? 2 : 1}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Upcoming</p>
          <p className="text-xs font-bold text-slate-800">{Math.max(1, assignmentsCount - 1)}</p>
        </div>
      </div>

      {/* Warning if overloaded */}
      {isOverloaded && (
        <div className="flex items-start space-x-2 bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <p className="font-bold">⚠ High workload</p>
            <p className="text-amber-700 mt-0.5">
              This staff member has {assignmentsCount} overlapping responsibilities. Consider rebalancing shifts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkloadIndicator;
