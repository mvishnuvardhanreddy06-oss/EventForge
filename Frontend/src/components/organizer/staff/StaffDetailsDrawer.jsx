import React, { useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Edit,
  UserCheck,
  Send,
  UserX,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { formatIndianPhone } from '../../../utils/phoneUtils';
import WorkloadIndicator from './WorkloadIndicator';
import PermissionsPanel from './PermissionsPanel';

const StaffDetailsDrawer = ({
  isOpen,
  staff,
  onClose,
  onEditStaff,
  onAssignStaff,
  onAddShift,
  onCheckIn,
  onCheckOut,
  onSendMessage,
  onDeactivate
}) => {
  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !staff) return null;

  const fullName = `${staff.firstName} ${staff.lastName}`;
  const initials = `${staff.firstName?.charAt(0) || ''}${staff.lastName?.charAt(0) || ''}`.toUpperCase();

  const getStatusBadge = () => {
    switch (staff.status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
            Active
          </span>
        );
      case 'Invited':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
            Invited
          </span>
        );
      case 'Inactive':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400 mr-1.5" />
            Inactive
          </span>
        );
    }
  };

  const getDutyBadge = () => {
    switch (staff.attendanceStatus) {
      case 'On Duty':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-1.5 animate-pulse" />
            ● On Duty
          </span>
        );
      case 'Checked In':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Checked In
          </span>
        );
      case 'Checked Out':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Checked Out
          </span>
        );
      case 'Absent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Absent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-500 border border-slate-200">
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden sm:border-l border-slate-200">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Staff Profile
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Staff Main Identity Banner */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-4">
                {staff.profileImage ? (
                  <img
                    src={staff.profileImage}
                    alt={fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
                    {initials}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-black text-slate-900">{fullName}</h2>
                    {getStatusBadge()}
                  </div>
                  <p className="text-xs font-bold text-blue-700 mt-0.5">
                    {staff.designation || staff.role}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.company || 'EventForge Operations'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions in Drawer */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 border-t border-b border-slate-100">
              <button
                type="button"
                onClick={() => onAssignStaff(staff)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Assign Staff</span>
              </button>

              <button
                type="button"
                onClick={() => onAddShift(staff)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Add Shift</span>
              </button>

              {staff.attendanceStatus !== 'On Duty' ? (
                <button
                  type="button"
                  onClick={() => onCheckIn(staff)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Check In</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onCheckOut(staff)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors shadow-2xs"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Check Out</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onSendMessage(staff)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <Send className="w-3.5 h-3.5 text-slate-500" />
                <span>Message</span>
              </button>
            </div>

            {/* CONTACT SECTION */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                  <p className="font-semibold text-slate-800 mt-0.5 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Phone (+91 Fixed)</p>
                  <p className="font-semibold text-slate-800 mt-0.5 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatIndianPhone(staff.phone)}</span>
                  </p>
                </div>
                {staff.emergencyContact && (
                  <div className="sm:col-span-2 pt-1 border-t border-slate-200/60">
                    <p className="text-[10px] font-bold text-rose-500 uppercase">Emergency Contact</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {formatIndianPhone(staff.emergencyContact)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ROLE & EVENT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Role</p>
                <p className="text-xs font-bold text-slate-900">{staff.role}</p>
                <p className="text-[11px] text-slate-500">{staff.department || 'Operations Team'}</p>
              </div>
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Event</p>
                <p className="text-xs font-bold text-slate-900 truncate" title={staff.eventTitle}>
                  {staff.eventTitle || 'Global Tech Leadership Summit 2026'}
                </p>
                <p className="text-[11px] text-slate-500">Apex Global Events</p>
              </div>
            </div>

            {/* ASSIGNMENTS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Assignments
                </h3>
                <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => onAssignStaff(staff)}>
                  + Add Assignment
                </span>
              </div>
              <div className="space-y-2">
                {staff.assignments && staff.assignments.length > 0 ? (
                  staff.assignments.map((asg, idx) => (
                    <div
                      key={asg.id || idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{asg.name}</p>
                          <p className="text-[10px] text-slate-400">{asg.type || 'Duty Station'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        Active
                      </span>
                    </div>
                  ))
                ) : staff.currentAssignment ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <p className="text-xs font-bold text-slate-800">{staff.currentAssignment}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      Primary
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    No active assignments yet. Click [ Assign Staff ] to allocate duties.
                  </p>
                )}
              </div>
            </div>

            {/* CURRENT SHIFT & ATTENDANCE */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Current Shift
                </span>
                {getDutyBadge()}
              </div>
              <div className="flex items-baseline space-x-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-sm font-black text-slate-800">
                  {staff.shift || '08:00 AM – 06:00 PM'}
                </span>
              </div>

              {/* Check-In / Check-out timestamps */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Check-In</p>
                  <p className="font-semibold text-slate-800">
                    {staff.checkInTime ? `${staff.checkInTime} (${staff.checkInDate || 'Sep 24'})` : 'Not recorded'}
                  </p>
                  {staff.checkedInBy && (
                    <p className="text-[10px] text-slate-400 truncate">By: {staff.checkedInBy}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Check-Out</p>
                  <p className="font-semibold text-slate-800">
                    {staff.checkOutTime ? staff.checkOutTime : 'Active shift'}
                  </p>
                  {staff.totalShiftDuration && (
                    <p className="text-[10px] text-emerald-600 font-bold">
                      Duration: {staff.totalShiftDuration}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="flex items-center justify-between bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Availability</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{staff.availability || 'Available'}</p>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  staff.availability === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : staff.availability === 'Partially Available'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {staff.availability || 'Available'}
              </span>
            </div>

            {/* PERFORMANCE METRICS */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Performance
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
                  <p className="text-xl font-black text-slate-900">{staff.sessionsManaged ?? 12}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Sessions Managed</p>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
                  <p className="text-xl font-black text-slate-900">{staff.checkInsAssisted ?? 340}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Check-ins Assisted</p>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
                  <p className="text-xl font-black text-slate-900">{staff.tasksCompleted ?? 28}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Tasks Completed</p>
                </div>
              </div>
            </div>

            {/* WORKLOAD INDICATOR */}
            <WorkloadIndicator staff={staff} />

            {/* PERMISSIONS PANEL */}
            <PermissionsPanel role={staff.role} />
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onDeactivate(staff)}
              className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              Deactivate Staff
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onEditStaff(staff)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Edit Staff
              </button>
              <button
                type="button"
                onClick={() => onAssignStaff(staff)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
              >
                Assign Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsDrawer;
