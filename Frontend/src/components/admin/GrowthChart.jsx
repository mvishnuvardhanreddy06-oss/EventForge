import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const growthData = {
  users: [
    { month: 'Apr', value: 18 },
    { month: 'May', value: 26 },
    { month: 'Jun', value: 34 },
    { month: 'Jul', value: 42 },
    { month: 'Aug', value: 48 },
    { month: 'Sep', value: 56 }
  ],
  organizations: [
    { month: 'Apr', value: 1 },
    { month: 'May', value: 1 },
    { month: 'Jun', value: 1 },
    { month: 'Jul', value: 2 },
    { month: 'Aug', value: 2 },
    { month: 'Sep', value: 2 }
  ],
  events: [
    { month: 'Apr', value: 1 },
    { month: 'May', value: 2 },
    { month: 'Jun', value: 3 },
    { month: 'Jul', value: 4 },
    { month: 'Aug', value: 4 },
    { month: 'Sep', value: 5 }
  ],
  registrations: [
    { month: 'Apr', value: 320 },
    { month: 'May', value: 540 },
    { month: 'Jun', value: 890 },
    { month: 'Jul', value: 1240 },
    { month: 'Aug', value: 1680 },
    { month: 'Sep', value: 2150 }
  ]
};

const metricLabels = {
  users: 'Users',
  organizations: 'Organizations',
  events: 'Events',
  registrations: 'Registrations'
};

const GrowthChart = () => {
  const [metric, setMetric] = useState('users');
  const currentData = growthData[metric] || growthData.users;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full min-w-0 overflow-hidden">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 min-w-0">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
              Platform Growth
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Platform activity over the last 6 months
            </p>
          </div>

          {/* Clean Segmented Control */}
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600 gap-0.5 shrink-0">
            {['users', 'organizations', 'events', 'registrations'].map((key) => (
              <button
                key={key}
                onClick={() => setMetric(key)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  metric === key
                    ? 'bg-white text-blue-600 font-semibold shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Modern Clean Area Chart */}
        <div className="h-56 sm:h-60 w-full min-w-0 overflow-hidden pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentData}
              margin={{ top: 8, right: 10, left: -24, bottom: 0 }}
            >
              <defs>
                <linearGradient id="adminGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [value.toLocaleString(), metricLabels[metric]]}
                labelStyle={{ fontWeight: '600', color: '#0f172a' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#adminGrowthGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium truncate">Trend: Healthy enterprise expansion</span>
        <span className="font-semibold text-blue-600 shrink-0">Active Velocity</span>
      </div>
    </div>
  );
};

export default GrowthChart;
