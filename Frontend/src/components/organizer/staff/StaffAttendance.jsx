import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Calendar, User, ShieldCheck } from 'lucide-react';
import { staffService } from '../../../services/staffService';

const StaffAttendance = ({
  isOpen,
  staff,
  onClose,
  onRecordAttendance
}) => {
  if (!isOpen || !staff) return null;

  const fullName = `${staff.firstName} ${staff.lastName}`;
  const isCheckedIn = staff.attendanceStatus === 'On Duty' || staff.attendanceStatus === 'Checked In';

  const [checkInTime, setCheckInTime] = useState(
    staff.checkInTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  );
  const [checkOutTime, setCheckOutTime] = useState(
    staff.checkOutTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  );
  const [checkedInBy, setCheckedInBy] = useState('Organizer (Vishnureddy)');

  const handleCheckInSubmit = () => {
    const todayStr = 'Sep 24, 2026';
    onRecordAttendance({
      staffId: staff._id,
      action: 'check_in',
      checkInTime,
      checkInDate: todayStr,
      checkedInBy,
      attendanceStatus: 'On Duty'
    });
  };

  const handleCheckOutSubmit = () => {
    // calculate duration
    const duration = staffService.formatDuration(
      `2026-09-24T${staff.checkInTime || '08:00 AM'}`,
      `2026-09-24T${checkOutTime}`
    );

    onRecordAttendance({
      staffId: staff._id,
      action: 'check_out',
      checkOutTime,
      totalShiftDuration: duration || '09h 12m',
      attendanceStatus: 'Checked Out'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Attendance Verification</h3>
              <p className="text-xs text-slate-500">Record check-in / check-out times and audit stamps.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Staff Info Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">{fullName}</p>
                <p className="text-xs font-semibold text-blue-700">{staff.role}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  staff.attendanceStatus === 'On Duty'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                ● {staff.attendanceStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Shift</span>
                <span className="font-semibold text-slate-800">{staff.shift || '08:00 AM – 06:00 PM'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Duty Location</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {staff.currentAssignment || 'Main Hall'}
                </span>
              </div>
            </div>
          </div>

          {!isCheckedIn ? (
            /* Check In Form */
            <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80">
              <h4 className="font-bold text-emerald-900 text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Record Staff Check-In</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Check-in Time</label>
                  <input
                    type="text"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Checked In By</label>
                  <input
                    type="text"
                    value={checkedInBy}
                    onChange={(e) => setCheckedInBy(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckInSubmit}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Check In</span>
              </button>
            </div>
          ) : (
            /* Check Out Form */
            <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
              <h4 className="font-bold text-amber-900 text-xs flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Record Staff Check-Out</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Check-In Time</p>
                  <p className="font-bold text-slate-900 text-xs mt-0.5">{staff.checkInTime || '07:52 AM'}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Check-Out Time</label>
                  <input
                    type="text"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Estimated duration: <strong className="text-slate-800">09h 12m</strong>. This will be automatically recorded in the staff attendance logs.
              </p>

              <button
                type="button"
                onClick={handleCheckOutSubmit}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>Confirm Check Out</span>
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;
