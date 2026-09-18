import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import AttendanceRate from './AttendanceRate';

const DUAL_TREND_DATA = [
  { month: 'Apr', registrations: 320, attendance: 245 },
  { month: 'May', registrations: 540, attendance: 420 },
  { month: 'Jun', registrations: 720, attendance: 560 },
  { month: 'Jul', registrations: 890, attendance: 695 },
  { month: 'Aug', registrations: 1080, attendance: 850 },
  { month: 'Sep', registrations: 1284, attendance: 1006 }
];

const CustomDualTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const reg = payload.find((p) => p.dataKey === 'registrations')?.value || 0;
    const att = payload.find((p) => p.dataKey === 'attendance')?.value || 0;
    const rate = reg > 0 ? ((att / reg) * 100).toFixed(1) : 0;

    return (
      <div className="bg-white px-3.5 py-2.5 border border-slate-200 rounded-lg shadow-lg text-xs space-y-1">
        <p className="font-bold text-slate-900">{label} Performance</p>
        <p className="text-blue-600 font-semibold">
          Registrations: {reg.toLocaleString()}
        </p>
        <p className="text-emerald-600 font-semibold">
          Attendance: {att.toLocaleString()} ({rate}%)
        </p>
      </div>
    );
  }
  return null;
};

const RegistrationAttendanceChart = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 overflow-hidden space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Registration & Attendance Trends
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare total registrations with actual on-site & virtual event attendance.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <AttendanceRate rate={78.4} trend="+6.2%" comparison="vs prior month average" />
        </div>
      </div>

      <div className="h-[260px] sm:h-[290px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DUAL_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip content={<CustomDualTooltip />} />
            <Area
              type="monotone"
              dataKey="registrations"
              name="Registrations"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#regGrad)"
            />
            <Area
              type="monotone"
              dataKey="attendance"
              name="Attendance"
              stroke="#059669"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#attGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RegistrationAttendanceChart;
