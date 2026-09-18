import React from 'react';
import Badge from './Badge';
import { formatDateTime } from '../utils/formatters';
import { ArrowUpRight } from 'lucide-react';

const Waitlist = ({ waitlist = [], onPromote }) => {
  if (waitlist.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
        No attendees currently on the waitlist.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Position</th>
            <th className="py-3 px-4">Attendee</th>
            <th className="py-3 px-4">Ticket Tier</th>
            <th className="py-3 px-4">Queued At</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {waitlist.map((item, index) => (
            <tr key={item._id} className="hover:bg-slate-50/50">
              <td className="py-3.5 px-4 font-bold text-blue-600">
                #{index + 1}
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{item.attendeeId?.name}</div>
                <div className="text-[11px] text-slate-400">{item.attendeeId?.email}</div>
              </td>
              <td className="py-3.5 px-4">
                {item.ticketId?.name || 'Standard Pass'}
              </td>
              <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                {formatDateTime(item.createdAt)}
              </td>
              <td className="py-3.5 px-4 text-right">
                {onPromote && (
                  <button
                    onClick={() => onPromote(item._id)}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    <span>Promote</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Waitlist;
