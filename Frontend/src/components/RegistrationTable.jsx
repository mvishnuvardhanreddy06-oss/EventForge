import React from 'react';
import Badge from './Badge';
import { formatDateTime, formatCurrency } from '../utils/formatters';
import { QrCode, XCircle, CheckCircle } from 'lucide-react';

const RegistrationTable = ({ registrations = [], onCancel, onApprove, onViewQR, isOrganizer = false }) => {
  if (registrations.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
        No registration records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Attendee</th>
            <th className="py-3 px-4">Ticket Tier</th>
            <th className="py-3 px-4">Reg #</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Check-in</th>
            <th className="py-3 px-4">Registered At</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {registrations.map((reg) => (
            <tr key={reg._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{reg.attendeeId?.name || 'Attendee'}</div>
                <div className="text-[11px] text-slate-400">{reg.attendeeId?.email}</div>
              </td>
              <td className="py-3.5 px-4">
                <span className="font-bold text-slate-800">{reg.ticketId?.name || 'Pass'}</span>
                <div className="text-[10px] text-slate-400">{formatCurrency(reg.finalAmount)}</div>
              </td>
              <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-blue-600">
                {reg.registrationNumber}
              </td>
              <td className="py-3.5 px-4">
                <Badge status={reg.status} />
              </td>
              <td className="py-3.5 px-4">
                {reg.checkedIn ? (
                  <span className="inline-flex items-center text-emerald-600 font-bold text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Checked In
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Not Checked In</span>
                )}
              </td>
              <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                {formatDateTime(reg.registeredAt || reg.createdAt)}
              </td>
              <td className="py-3.5 px-4 text-right space-x-2">
                {onViewQR && (
                  <button
                    onClick={() => onViewQR(reg)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Digital QR Badge"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                )}
                {isOrganizer && reg.status === 'pending' && onApprove && (
                  <button
                    onClick={() => onApprove(reg._id)}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Approve Registration"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {reg.status !== 'cancelled' && onCancel && (
                  <button
                    onClick={() => onCancel(reg._id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Cancel Registration"
                  >
                    <XCircle className="w-4 h-4" />
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

export default RegistrationTable;
