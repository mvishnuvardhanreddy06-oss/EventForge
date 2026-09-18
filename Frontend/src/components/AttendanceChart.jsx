import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AttendanceChart = ({ checkIns = 0, confirmed = 0 }) => {
  const noShows = Math.max(0, confirmed - checkIns);
  const data = [
    { name: 'Checked In', value: checkIns, color: '#10b981' },
    { name: 'No-Show / Pending', value: noShows, color: '#f59e0b' }
  ];

  if (confirmed === 0) {
    return <div className="h-64 flex items-center justify-center text-xs text-slate-400">No registrations recorded yet</div>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
