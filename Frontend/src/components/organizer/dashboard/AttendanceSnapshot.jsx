import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, ArrowRight } from 'lucide-react';

const AttendanceSnapshot = () => {
  return (
    <div className="panel space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
            Live Attendance
          </span>
          <span className="w-2 h-2 rounded-full bg-teal animate-ping" />
        </div>
        <h3 className="text-base font-display font-bold text-ink tracking-tight">
          Today's Attendance
        </h3>
        <p className="text-xs text-muted">
          On-site QR scanner check-in progress across all active halls.
        </p>
      </div>

      <div className="space-y-3 bg-bg/50 p-4 rounded-xl border border-line">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[10px] font-semibold text-muted block">Expected</span>
            <span className="font-display font-bold text-ink text-lg mt-0.5 block">1,240</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-teal block">Checked In</span>
            <span className="font-display font-bold text-teal text-lg mt-0.5 block">986</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted block">Remaining</span>
            <span className="font-display font-bold text-muted text-lg mt-0.5 block">254</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1 pt-1">
          <div className="w-full bg-line rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-teal h-full rounded-full transition-all duration-700"
              style={{ width: '79.5%' }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-muted">Scan Progress</span>
            <span className="text-teal font-bold">79.5%</span>
          </div>
        </div>
      </div>

      <Link
        to="/organizer/registrations"
        className="btn w-full py-2.5 px-3 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
      >
        <span>View Check-in</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default AttendanceSnapshot;
