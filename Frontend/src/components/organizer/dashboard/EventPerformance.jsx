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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Event Performance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key metrics by individual corporate summit.
          </p>
        </div>
        <Link
          to="/organizer/analytics"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>View Analytics</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Event</th>
              <th className="py-2.5 px-3">Registrations</th>
              <th className="py-2.5 px-3">Attendance</th>
              <th className="py-2.5 px-3">Revenue</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/90 text-slate-700">
            {performanceData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900">
                  {row.name}
                </td>
                <td className="py-3 px-3 font-semibold">{row.registrations}</td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px]">
                    {row.attendance}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                  {row.revenue}
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
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
