import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Clock,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Edit,
  UserCheck,
  Send,
  UserX,
  Eye,
  Phone
} from 'lucide-react';
import { formatIndianPhone } from '../../../utils/phoneUtils';

const StaffCard = ({
  staff,
  isSelected,
  onToggleSelect,
  onViewProfile,
  onEditStaff,
  onAssignStaff,
  onAddShift,
  onCheckIn,
  onCheckOut,
  onDeactivate,
  onSendMessage
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = `${staff.firstName} ${staff.lastName}`;
  const initials = `${staff.firstName?.charAt(0) || ''}${staff.lastName?.charAt(0) || ''}`.toUpperCase();

  const getStatusBadge = () => {
    switch (staff.status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            ACTIVE
          </span>
        );
      case 'Invited':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            INVITED
          </span>
        );
      case 'Inactive':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
            INACTIVE
          </span>
        );
    }
  };

  const getDutyBadge = () => {
    switch (staff.attendanceStatus) {
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
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-1.5" />
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

  const getAvailabilityBadge = () => {
    switch (staff.availability) {
      case 'Available':
        return (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100">
            Available
          </span>
        );
      case 'Partially Available':
        return (
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-100">
            Partially Available
          </span>
        );
      case 'Unavailable':
      default:
        return (
          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50/60 px-2 py-0.5 rounded-md border border-rose-100">
            Unavailable
          </span>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between relative shadow-2xs hover:shadow-xs hover:border-slate-300 ${
        isSelected ? 'ring-2 ring-blue-600 border-blue-400 bg-blue-50/10' : 'border-slate-200/80'
      }`}
    >
      {/* Top Bar with Selection & Actions */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(staff._id)}
              className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer mt-0.5"
            />
            {getStatusBadge()}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs overflow-hidden animate-fade-in">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onViewProfile(staff);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEditStaff(staff);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Staff</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onAssignStaff(staff);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Assign Staff</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onAddShift(staff);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Create Shift</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onSendMessage(staff);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                  <span>Send Message</span>
                </button>

                {staff.attendanceStatus !== 'On Duty' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onCheckIn(staff);
                    }}
                    className="w-full text-left px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Check In</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onCheckOut(staff);
                    }}
                    className="w-full text-left px-3 py-1.5 text-amber-700 hover:bg-amber-50 flex items-center space-x-2 font-medium"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Check Out</span>
                  </button>
                )}

                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDeactivate(staff);
                  }}
                  className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-medium"
                >
                  <UserX className="w-3.5 h-3.5 text-rose-500" />
                  <span>Deactivate</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-center space-x-3 mt-3">
          {staff.profileImage ? (
            <img
              src={staff.profileImage}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-2xs shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3
              onClick={() => onViewProfile(staff)}
              className="text-sm font-black text-slate-900 truncate hover:text-blue-600 cursor-pointer"
            >
              {fullName}
            </h3>
            <p className="text-xs font-bold text-blue-700 truncate">{staff.role}</p>
            <p className="text-[11px] text-slate-400 truncate flex items-center space-x-1 mt-0.5">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{staff.company || 'EventForge Operations'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Details Box */}
      <div className="px-4 py-3 bg-slate-50/50 border-t border-b border-slate-100/90 space-y-2 text-xs">
        {/* Assignment */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Assignment:</span>
          <span className="text-xs font-bold text-slate-800 truncate max-w-[160px]">
            {staff.currentAssignment || (
              <span className="text-slate-400 font-normal italic">Unassigned</span>
            )}
          </span>
        </div>

        {/* Shift */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Shift:</span>
          <span className="text-xs font-semibold text-slate-700 truncate">
            {staff.shift || '08:00 AM – 06:00 PM'}
          </span>
        </div>

        {/* Duty Status & Availability */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-slate-500 font-medium">Status:</span>
          <div className="flex items-center space-x-1.5">
            {getDutyBadge()}
            {getAvailabilityBadge()}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-3 bg-white rounded-b-2xl flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewProfile(staff)}
          className="flex-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs text-center"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={() => onEditStaff(staff)}
          className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors shadow-2xs"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default StaffCard;
