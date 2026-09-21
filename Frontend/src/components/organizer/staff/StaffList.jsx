import React, { useState } from 'react';
import {
  MoreVertical,
  Eye,
  Edit,
  UserCheck,
  Clock,
  Send,
  UserX,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatIndianPhone } from '../../../utils/phoneUtils';

const StaffList = ({
  staffList = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onViewProfile,
  onEditStaff,
  onAssignStaff,
  onAddShift,
  onCheckIn,
  onCheckOut,
  onDeactivate,
  onSendMessage
}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const isAllSelected = staffList.length > 0 && selectedIds.length === staffList.length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Active
          </span>
        );
      case 'Invited':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Invited
          </span>
        );
      case 'Inactive':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
            Inactive
          </span>
        );
    }
  };

  const getAttendanceBadge = (attendanceStatus) => {
    switch (attendanceStatus) {
      case 'On Duty':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5 animate-pulse" />
            ● On Duty
          </span>
        );
      case 'Checked In':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Checked In
          </span>
        );
      case 'Checked Out':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Checked Out
          </span>
        );
      case 'Absent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Absent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4">Staff</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Event</th>
              <th className="py-3 px-4">Assignment</th>
              <th className="py-3 px-4">Shift</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {staffList.map((staff) => {
              const fullName = `${staff.firstName} ${staff.lastName}`;
              const initials = `${staff.firstName?.charAt(0) || ''}${staff.lastName?.charAt(0) || ''}`.toUpperCase();
              const isSelected = selectedIds.includes(staff._id);

              return (
                <tr
                  key={staff._id}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    isSelected ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(staff._id)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Staff Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {staff.profileImage ? (
                        <img
                          src={staff.profileImage}
                          alt={fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p
                          onClick={() => onViewProfile(staff)}
                          className="font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                        >
                          {fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{staff.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{staff.role}</span>
                    <p className="text-[10px] text-slate-400 truncate">{staff.department || 'Operations'}</p>
                  </td>

                  {/* Event */}
                  <td className="py-3 px-4">
                    <span className="text-slate-700 font-medium truncate block max-w-[180px]" title={staff.eventTitle}>
                      {staff.eventTitle || 'Global Tech Leadership Summit'}
                    </span>
                  </td>

                  {/* Assignment */}
                  <td className="py-3 px-4">
                    {staff.currentAssignment ? (
                      <span className="font-semibold text-slate-800 truncate block max-w-[140px]">
                        {staff.currentAssignment}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Shift */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-slate-600 font-medium">
                      {staff.shift ? staff.shift.replace(' – ', '–') : '08:00–06:00'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusBadge(staff.status)}
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getAttendanceBadge(staff.attendanceStatus)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === staff._id ? null : staff._id)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors shadow-2xs"
                      >
                        <span>Manage</span>
                        <MoreVertical className="w-3 h-3 text-blue-600" />
                      </button>

                      {activeMenuId === staff._id && (
                        <div
                          onMouseLeave={() => setActiveMenuId(null)}
                          className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs text-left animate-fade-in"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewProfile(staff);
                            }}
                            className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>View Profile</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditStaff(staff);
                            }}
                            className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-500" />
                            <span>Edit Staff</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onAssignStaff(staff);
                            }}
                            className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Assign Staff</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onAddShift(staff);
                            }}
                            className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Create Shift</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onSendMessage(staff);
                            }}
                            className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <Send className="w-3.5 h-3.5 text-slate-500" />
                            <span>Send Message</span>
                          </button>

                          {staff.attendanceStatus !== 'On Duty' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onCheckIn(staff);
                              }}
                              className="w-full px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2 font-medium"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Check In</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onCheckOut(staff);
                              }}
                              className="w-full px-3 py-1.5 text-amber-700 hover:bg-amber-50 flex items-center space-x-2 font-medium"
                            >
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Check Out</span>
                            </button>
                          )}

                          <div className="border-t border-slate-100 my-1" />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeactivate(staff);
                            }}
                            className="w-full px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-medium"
                          >
                            <UserX className="w-3.5 h-3.5 text-rose-500" />
                            <span>Deactivate</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
