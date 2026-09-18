import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, ArrowRight } from 'lucide-react';

const AttendanceSnapshot = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Live Attendance
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Today's Attendance
        </h3>
        <p className="text-xs text-slate-500">
          On-site QR scanner check-in progress across all active halls.
        </p>
      </div>

      <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block">Expected</span>
            <span className="font-black text-slate-900 text-lg mt-0.5 block">1,240</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-emerald-600 block">Checked In</span>
            <span className="font-black text-emerald-700 text-lg mt-0.5 block">986</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block">Remaining</span>
            <span className="font-black text-slate-700 text-lg mt-0.5 block">254</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1 pt-1">
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-700"
              style={{ width: '79.5%' }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-500">Scan Progress</span>
            <span className="text-emerald-700 font-bold">79.5%</span>
          </div>
        </div>
      </div>

      <Link
        to="/organizer/registrations"
        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
      >
        <span>View Check-in</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default AttendanceSnapshot;
