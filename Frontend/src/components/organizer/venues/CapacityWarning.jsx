import React from 'react';
import { AlertCircle, Users, ArrowUpRight, X } from 'lucide-react';

const CapacityWarning = ({
  expectedAttendance = 1800,
  venueCapacity = 1500,
  venueName = 'Selected Venue',
  onDismiss,
  className = ''
}) => {
  const diff = expectedAttendance - venueCapacity;
  const percentOver = Math.round((diff / venueCapacity) * 100);

  return (
    <div
      className={`p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs shadow-2xs space-y-2.5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 text-amber-800 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
          <span className="text-xs uppercase tracking-wider font-extrabold">
            Capacity Warning
          </span>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-amber-500 hover:text-amber-800 p-0.5 rounded-md hover:bg-amber-100/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Expected Attendance
          </p>
          <p className="text-sm font-black text-slate-900">
            {expectedAttendance.toLocaleString()}{' '}
            <span className="text-[10px] font-medium text-slate-500">attendees</span>
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Venue Capacity
          </p>
          <p className="text-sm font-black text-amber-800">
            {venueCapacity.toLocaleString()}{' '}
            <span className="text-[10px] font-medium text-amber-600">max capacity</span>
          </p>
        </div>
      </div>

      <p className="text-[11px] text-amber-800 leading-snug">
        Expected attendees exceed {venueName}'s limit by{' '}
        <span className="font-bold text-amber-900">{diff.toLocaleString()} seats ({percentOver}% over capacity)</span>. This venue may not be suitable for this event.
      </p>
    </div>
  );
};

export default CapacityWarning;
