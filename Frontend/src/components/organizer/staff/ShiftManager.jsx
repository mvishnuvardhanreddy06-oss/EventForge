import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Copy,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const ShiftManager = ({
  shifts = [],
  onOpenAddShift,
  onEditShift,
  onDuplicateShift,
  onCancelShift
}) => {
  const [filterDate, setFilterDate] = useState('all');

  const filteredShifts = shifts.filter((sh) => {
    if (filterDate !== 'all' && !sh.date.includes(filterDate)) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Duty':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5 animate-pulse" />
            ● On Duty
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-1.5" />
            ● Scheduled
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'Cancelled':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4">
      {/* Shifts View Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-black text-slate-900">Staff Shifts</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              {filteredShifts.length} Shifts Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time daily roster, duty stations, and shift hours across venues.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onOpenAddShift}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Shift</span>
          </button>
        </div>
      </div>

      {/* Shifts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Staff</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Start</th>
              <th className="py-3 px-4">End</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredShifts.map((shift) => (
              <tr key={shift._id} className="hover:bg-slate-50/60 transition-colors">
                {/* Date */}
                <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shift.date}</span>
                  </div>
                </td>

                {/* Staff */}
                <td className="py-3 px-4">
                  <p className="font-bold text-slate-900">{shift.staffName}</p>
                </td>

                {/* Role */}
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-700">{shift.role}</span>
                </td>

                {/* Location */}
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold">{shift.room}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px] hidden md:inline">
                      ({shift.venue})
                    </span>
                  </div>
                </td>

                {/* Start Time */}
                <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                  {shift.startTime}
                </td>

                {/* End Time */}
                <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                  {shift.endTime}
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {getStatusBadge(shift.status)}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => onEditShift(shift)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Shift"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateShift(shift)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Duplicate Shift"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onCancelShift(shift)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Cancel Shift"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftManager;
