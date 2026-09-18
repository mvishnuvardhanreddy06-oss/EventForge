import React from 'react';
import { CheckCircle, TrendingUp } from 'lucide-react';

const AttendanceRate = ({
  rate = 78.4,
  trend = '+6.2%',
  comparison = 'Compared with previous period'
}) => {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Verified Attendance Rate
        </span>
        <div className="flex items-baseline space-x-2 my-1">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {rate}%
          </span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-500 truncate">
          {comparison}
        </p>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r="36"
            className="text-slate-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="44"
            cy="44"
            r="36"
            className="text-emerald-500 transition-all duration-1000"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-[11px] font-bold text-slate-700 font-mono">
          {rate}%
        </span>
      </div>
    </div>
  );
};

export default AttendanceRate;
