import React from 'react';
import { formatDateTime } from '../utils/formatters';
import { CheckCircle, QrCode } from 'lucide-react';

const AttendanceTable = ({ records = [] }) => {
  if (records.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
        No check-in activity recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Attendee</th>
            <th className="py-3 px-4">Session / Event</th>
            <th className="py-3 px-4">Method</th>
            <th className="py-3 px-4">Verified By Staff</th>
            <th className="py-3 px-4">Check-in Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {records.map((item) => (
            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{item.attendeeId?.name || 'Attendee'}</div>
                <div className="text-[11px] text-slate-400">{item.attendeeId?.email}</div>
              </td>
              <td className="py-3.5 px-4 font-semibold text-slate-800">
                {item.sessionId?.title || 'Master Event Entry'}
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                  <QrCode className="w-3 h-3 mr-1" /> {item.method}
                </span>
              </td>
              <td className="py-3.5 px-4 text-slate-600">
                {item.checkedInBy?.name || 'Staff'}
              </td>
              <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                {formatDateTime(item.checkedInAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
