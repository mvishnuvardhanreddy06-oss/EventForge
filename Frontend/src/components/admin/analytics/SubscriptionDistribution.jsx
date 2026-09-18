import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const PLAN_DATA = [
  { name: 'Pro', value: 50, count: '2 Orgs', color: '#6366f1' },
  { name: 'Enterprise', value: 30, count: '2 Orgs', color: '#2563eb' },
  { name: 'Free', value: 20, count: '1 Org', color: '#94a3b8' }
];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-md text-xs">
        <p className="font-bold text-slate-900">{payload[0].name} Tier</p>
        <p className="text-slate-600 mt-0.5">
          {payload[0].value}% of Base ({payload[0].payload.count})
        </p>
      </div>
    );
  }
  return null;
};

const SubscriptionDistribution = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between min-w-0 overflow-hidden h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Subscription Distribution
          </h3>
          <span className="text-xs font-semibold text-slate-500">5 Total Tenants</span>
        </div>
        <p className="text-xs text-slate-500 mb-2">
          Active tenant tier breakdown across multi-tenant workspaces.
        </p>

        {/* Donut Chart with Center Label */}
        <div className="h-[180px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={PLAN_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {PLAN_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
              5
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
              Organizations
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {PLAN_DATA.map((plan) => (
            <div key={plan.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: plan.color }}
                />
                <span className="font-medium text-slate-700">{plan.name}</span>
              </div>
              <span className="text-slate-800 font-semibold">
                {plan.value}% <span className="text-slate-400 font-normal">({plan.count})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 text-[11px] text-slate-500 mt-4 flex items-center justify-between">
        <span>Primary Tier: <strong>Pro Plan (50%)</strong></span>
        <span className="text-blue-600 font-semibold">100% Active</span>
      </div>
    </div>
  );
};

export default SubscriptionDistribution;
