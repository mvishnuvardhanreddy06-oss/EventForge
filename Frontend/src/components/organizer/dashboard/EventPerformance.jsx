import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

const EventPerformance = () => {
  const performanceData = [
    {
      name: 'Global Tech Leadership Summit',
      registrations: '1,240',
      attendance: '82%',
      revenue: '₹4,20,000',
      status: 'Published'
    },
    {
      name: 'AI & Cloud Innovation Conference',
      registrations: '684',
      attendance: '68%',
      revenue: '₹2,10,000',
      status: 'Published'
    },
    {
      name: 'FinTech Future Forum',
      registrations: '420',
      attendance: '56%',
      revenue: '₹1,12,500',
      status: 'Published'
    }
  ];

  return (
    <div className="panel space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-display font-bold text-ink tracking-tight">
            Event Performance
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Key metrics by individual corporate summit.
          </p>
        </div>
        <Link
          to="/organizer/analytics"
          className="btn !py-1.5 !px-3 text-xs font-bold inline-flex items-center space-x-1"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>View Analytics</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-line text-[10px] font-bold text-muted uppercase tracking-wider">
              <th className="py-2.5 px-3">Event</th>
              <th className="py-2.5 px-3">Registrations</th>
              <th className="py-2.5 px-3">Attendance</th>
              <th className="py-2.5 px-3">Revenue</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {performanceData.map((row, idx) => (
              <tr key={idx} className="hover:bg-bg/40 transition-colors">
                <td className="py-3 px-3 font-bold text-ink">
                  {row.name}
                </td>
                <td className="py-3 px-3 font-semibold text-muted">{row.registrations}</td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-teal bg-teal/10 px-2 py-0.5 rounded-full border border-teal/20 text-[11px]">
                    {row.attendance}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-ink">
                  {row.revenue}
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal/10 text-teal border border-teal/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                    <span>{row.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventPerformance;
