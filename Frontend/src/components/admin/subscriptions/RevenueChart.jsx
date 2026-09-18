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
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const REVENUE_DATA_SETS = {
  '7d': [
    { label: 'Mon', revenue: 232000 },
    { label: 'Tue', revenue: 236500 },
    { label: 'Wed', revenue: 239000 },
    { label: 'Thu', revenue: 242200 },
    { label: 'Fri', revenue: 244500 },
    { label: 'Sat', revenue: 246800 },
    { label: 'Sun', revenue: 248500 }
  ],
  '30d': [
    { label: 'Week 1', revenue: 221000 },
    { label: 'Week 2', revenue: 229400 },
    { label: 'Week 3', revenue: 238200 },
    { label: 'Week 4', revenue: 248500 }
  ],
  '3m': [
    { label: 'Jul 2026', revenue: 198000 },
    { label: 'Aug 2026', revenue: 221000 },
    { label: 'Sep 2026', revenue: 248500 }
  ],
  '1y': [
    { label: 'Oct', revenue: 142000 },
    { label: 'Nov', revenue: 156000 },
    { label: 'Dec', revenue: 168000 },
    { label: 'Jan', revenue: 175000 },
    { label: 'Feb', revenue: 182000 },
    { label: 'Mar', revenue: 191000 },
    { label: 'Apr', revenue: 202000 },
    { label: 'May', revenue: 215000 },
    { label: 'Jun', revenue: 228000 },
    { label: 'Jul', revenue: 235000 },
    { label: 'Aug', revenue: 241000 },
    { label: 'Sep', revenue: 248500 }
  ]
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-700">
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{label}</p>
        <p className="font-bold text-sm text-blue-400 mt-0.5">
          ₹{val.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const data = REVENUE_DATA_SETS[timeframe] || REVENUE_DATA_SETS['30d'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Subscription Revenue
          </span>
          <div className="flex items-baseline space-x-2.5 mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              ₹2,48,500
            </h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>↑ 12.4%</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Monthly Recurring Revenue (MRR)
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '3m', label: '3 Months' },
            { id: '1y', label: '1 Year' }
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeframe === tf.id
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
