import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DATA_SETS = {
  '7 Days': [
    { day: 'Mon', registrations: 120, confirmed: 105, waitlisted: 10, cancelled: 5 },
    { day: 'Tue', registrations: 165, confirmed: 148, waitlisted: 12, cancelled: 5 },
    { day: 'Wed', registrations: 142, confirmed: 130, waitlisted: 8, cancelled: 4 },
    { day: 'Thu', registrations: 210, confirmed: 190, waitlisted: 15, cancelled: 5 },
    { day: 'Fri', registrations: 245, confirmed: 220, waitlisted: 18, cancelled: 7 },
    { day: 'Sat', registrations: 280, confirmed: 255, waitlisted: 20, cancelled: 5 },
    { day: 'Sun', registrations: 310, confirmed: 285, waitlisted: 18, cancelled: 7 }
  ],
  '30 Days': [
    { day: 'Week 1', registrations: 580, confirmed: 520, waitlisted: 42, cancelled: 18 },
    { day: 'Week 2', registrations: 720, confirmed: 660, waitlisted: 45, cancelled: 15 },
    { day: 'Week 3', registrations: 890, confirmed: 810, waitlisted: 55, cancelled: 25 },
    { day: 'Week 4', registrations: 1040, confirmed: 960, waitlisted: 60, cancelled: 20 }
  ],
  '3 Months': [
    { day: 'Jul', registrations: 1850, confirmed: 1680, waitlisted: 120, cancelled: 50 },
    { day: 'Aug', registrations: 2340, confirmed: 2120, waitlisted: 160, cancelled: 60 },
    { day: 'Sep', registrations: 2846, confirmed: 2580, waitlisted: 190, cancelled: 76 }
  ],
  '6 Months': [
    { day: 'Apr', registrations: 950, confirmed: 860, waitlisted: 60, cancelled: 30 },
    { day: 'May', registrations: 1240, confirmed: 1120, waitlisted: 85, cancelled: 35 },
    { day: 'Jun', registrations: 1560, confirmed: 1410, waitlisted: 105, cancelled: 45 },
    { day: 'Jul', registrations: 1850, confirmed: 1680, waitlisted: 120, cancelled: 50 },
    { day: 'Aug', registrations: 2340, confirmed: 2120, waitlisted: 160, cancelled: 60 },
    { day: 'Sep', registrations: 2846, confirmed: 2580, waitlisted: 190, cancelled: 76 }
  ]
};

const RegistrationOverview = () => {
  const [activeTab, setActiveTab] = useState('7 Days');
  const data = DATA_SETS[activeTab];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Registration Overview
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registration performance across your events.
          </p>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          {['7 Days', '30 Days', '3 Months', '6 Months'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Registrations</span>
          <span className="font-bold text-slate-900 text-sm">2,846</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase block">Confirmed</span>
          <span className="font-bold text-emerald-700 text-sm">2,580</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase block">Waitlisted</span>
          <span className="font-bold text-amber-700 text-sm">190</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-rose-600 uppercase block">Cancelled</span>
          <span className="font-bold text-rose-700 text-sm">76</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            />
            <Area
              type="monotone"
              dataKey="registrations"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#regGradient)"
              name="Registrations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RegistrationOverview;
