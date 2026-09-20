import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';

const CapacityIndicator = ({
  capacity = 500,
  expectedAttendance = 420,
  size = 'md',
  showWarning = true
}) => {
  const cap = Number(capacity) || 1;
  const exp = Number(expectedAttendance) || 0;
  const percent = Math.min(Math.round((exp / cap) * 100), 100);
  const isOverCapacity = exp > cap;

  let barColor = 'bg-emerald-500';
  let textColor = 'text-slate-700';

  if (percent >= 80 && !isOverCapacity) {
    barColor = 'bg-blue-600';
    textColor = 'text-blue-700 font-bold';
  } else if (isOverCapacity) {
    barColor = 'bg-rose-500';
    textColor = 'text-rose-700 font-bold';
  }

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center space-x-1 text-slate-500">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-medium">Capacity: {cap} seats</span>
        </span>
        <span className={`text-[11px] ${textColor}`}>
          {percent}% expected capacity
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {isOverCapacity && showWarning && (
        <p className="text-[10px] text-rose-600 font-semibold flex items-center space-x-1 mt-0.5">
          <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
          <span>⚠ Session capacity may be insufficient for expected crowd.</span>
        </p>
      )}
    </div>
  );
};

export default CapacityIndicator;
