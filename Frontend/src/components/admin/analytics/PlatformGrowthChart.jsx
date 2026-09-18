import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const GROWTH_SERIES = {
  users: {
    label: 'Users',
    'Last 7 Days': [
      { label: 'Mon', value: 50 },
      { label: 'Tue', value: 51 },
      { label: 'Wed', value: 53 },
      { label: 'Thu', value: 54 },
      { label: 'Fri', value: 55 },
      { label: 'Sat', value: 55 },
      { label: 'Sun', value: 56 }
    ],
    'Last 30 Days': [
      { label: 'Week 1', value: 48 },
      { label: 'Week 2', value: 50 },
      { label: 'Week 3', value: 53 },
      { label: 'Week 4', value: 56 }
    ],
    'Last 3 Months': [
      { label: 'Jul', value: 42 },
      { label: 'Aug', value: 48 },
      { label: 'Sep', value: 56 }
    ],
    'Last 6 Months': [
      { label: 'Apr', value: 18 },
      { label: 'May', value: 26 },
      { label: 'Jun', value: 34 },
      { label: 'Jul', value: 42 },
      { label: 'Aug', value: 48 },
      { label: 'Sep', value: 56 }
    ],
    'This Year': [
      { label: 'Jan', value: 6 },
      { label: 'Feb', value: 12 },
      { label: 'Mar', value: 16 },
      { label: 'Apr', value: 18 },
      { label: 'May', value: 26 },
      { label: 'Jun', value: 34 },
      { label: 'Jul', value: 42 },
      { label: 'Aug', value: 48 },
      { label: 'Sep', value: 56 }
    ]
  },
  organizations: {
    label: 'Organizations',
    'Last 7 Days': [
      { label: 'Mon', value: 2 },
      { label: 'Tue', value: 2 },
      { label: 'Wed', value: 2 },
      { label: 'Thu', value: 2 },
      { label: 'Fri', value: 2 },
      { label: 'Sat', value: 2 },
      { label: 'Sun', value: 2 }
    ],
    'Last 30 Days': [
      { label: 'Week 1', value: 1 },
      { label: 'Week 2', value: 2 },
      { label: 'Week 3', value: 2 },
      { label: 'Week 4', value: 2 }
    ],
    'Last 3 Months': [
      { label: 'Jul', value: 1 },
      { label: 'Aug', value: 2 },
      { label: 'Sep', value: 2 }
    ],
    'Last 6 Months': [
      { label: 'Apr', value: 1 },
      { label: 'May', value: 1 },
      { label: 'Jun', value: 1 },
      { label: 'Jul', value: 1 },
      { label: 'Aug', value: 2 },
      { label: 'Sep', value: 2 }
    ],
    'This Year': [
      { label: 'Jan', value: 1 },
      { label: 'Mar', value: 1 },
      { label: 'May', value: 1 },
      { label: 'Jul', value: 1 },
      { label: 'Aug', value: 2 },
      { label: 'Sep', value: 2 }
    ]
  },
  events: {
    label: 'Events',
    'Last 7 Days': [
      { label: 'Mon', value: 4 },
      { label: 'Tue', value: 4 },
      { label: 'Wed', value: 5 },
      { label: 'Thu', value: 5 },
      { label: 'Fri', value: 5 },
      { label: 'Sat', value: 5 },
      { label: 'Sun', value: 5 }
    ],
    'Last 30 Days': [
      { label: 'Week 1', value: 4 },
      { label: 'Week 2', value: 4 },
      { label: 'Week 3', value: 5 },
      { label: 'Week 4', value: 5 }
    ],
    'Last 3 Months': [
      { label: 'Jul', value: 3 },
      { label: 'Aug', value: 4 },
      { label: 'Sep', value: 5 }
    ],
    'Last 6 Months': [
      { label: 'Apr', value: 1 },
      { label: 'May', value: 2 },
      { label: 'Jun', value: 3 },
      { label: 'Jul', value: 3 },
      { label: 'Aug', value: 4 },
      { label: 'Sep', value: 5 }
    ],
    'This Year': [
      { label: 'Feb', value: 1 },
      { label: 'Apr', value: 1 },
      { label: 'Jun', value: 3 },
      { label: 'Aug', value: 4 },
      { label: 'Sep', value: 5 }
    ]
  },
  registrations: {
    label: 'Registrations',
    'Last 7 Days': [
      { label: 'Mon', value: 1140 },
      { label: 'Tue', value: 1180 },
      { label: 'Wed', value: 1210 },
      { label: 'Thu', value: 1245 },
      { label: 'Fri', value: 1260 },
      { label: 'Sat', value: 1275 },
      { label: 'Sun', value: 1284 }
    ],
    'Last 30 Days': [
      { label: 'Week 1', value: 920 },
      { label: 'Week 2', value: 1040 },
      { label: 'Week 3', value: 1170 },
      { label: 'Week 4', value: 1284 }
    ],
    'Last 3 Months': [
      { label: 'Jul', value: 780 },
      { label: 'Aug', value: 1080 },
      { label: 'Sep', value: 1284 }
    ],
    'Last 6 Months': [
      { label: 'Apr', value: 240 },
      { label: 'May', value: 480 },
      { label: 'Jun', value: 710 },
      { label: 'Jul', value: 780 },
      { label: 'Aug', value: 1080 },
      { label: 'Sep', value: 1284 }
    ],
    'This Year': [
      { label: 'Jan', value: 80 },
      { label: 'Mar', value: 190 },
      { label: 'May', value: 480 },
      { label: 'Jul', value: 780 },
      { label: 'Aug', value: 1080 },
      { label: 'Sep', value: 1284 }
    ]
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-lg text-xs">
        <p className="font-bold text-slate-800">{label}</p>
        <p className="text-blue-600 font-semibold mt-0.5">
          {payload[0].value.toLocaleString()} {payload[0].name}
        </p>
      </div>
    );
  }
  return null;
};

const PlatformGrowthChart = ({ dateRange = 'Last 30 Days' }) => {
  const [metric, setMetric] = useState('users');

  const currentData = useMemo(() => {
    const metricObj = GROWTH_SERIES[metric] || GROWTH_SERIES.users;
    return metricObj[dateRange] || metricObj['Last 30 Days'];
  }, [metric, dateRange]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Platform Growth
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Growth trajectory over the {dateRange.toLowerCase()}.
          </p>
        </div>

        {/* Metric Segmented Switcher */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg self-start sm:self-auto overflow-x-auto">
          {['users', 'organizations', 'events', 'registrations'].map((key) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize shrink-0 ${
                metric === key
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px] sm:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growthColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              name={metric}
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#growthColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlatformGrowthChart;
