import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const SessionPopularity = ({ sessions = [] }) => {
  if (sessions.length === 0) {
    return <div className="h-64 flex items-center justify-center text-xs text-slate-400">No session activity recorded</div>;
  }

  const data = sessions.slice(0, 6).map(s => ({
    title: s.title.length > 20 ? s.title.substring(0, 20) + '...' : s.title,
    attendees: s.attendees || 0,
    capacity: s.capacity || 100
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis dataKey="title" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={120} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
          />
          <Bar dataKey="attendees" fill="#6366f1" radius={[0, 6, 6, 0]} name="Attended Delegates" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionPopularity;
