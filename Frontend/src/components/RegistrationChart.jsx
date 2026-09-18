import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const RegistrationChart = ({ tickets = [] }) => {
  if (tickets.length === 0) {
    return <div className="h-64 flex items-center justify-center text-xs text-slate-400">No ticket data available</div>;
  }

  const data = tickets.map(t => ({
    name: t.name,
    sold: t.sold,
    remaining: t.remaining,
    revenue: t.revenue || (t.sold * t.price)
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
          />
          <Bar dataKey="sold" fill="#2563eb" radius={[6, 6, 0, 0]} name="Sold Passes" />
          <Bar dataKey="remaining" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Remaining" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegistrationChart;
