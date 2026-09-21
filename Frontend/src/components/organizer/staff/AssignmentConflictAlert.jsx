import React from 'react';
import { AlertTriangle, Clock, MapPin, X } from 'lucide-react';

const AssignmentConflictAlert = ({
  conflict,
  onChooseDifferentStaff,
  onAdjustShift,
  onClose
}) => {
  if (!conflict) return null;

  const { details = {} } = conflict;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 w-full max-w-md overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 bg-amber-50/80 border-b border-amber-200/80 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-amber-900">Assignment Conflict</h3>
              <p className="text-xs text-amber-700 font-medium">
                Overlapping duty schedule detected
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-amber-500 hover:text-amber-800 hover:bg-amber-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conflict Details */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-bold">{details.staffName || 'Staff Member'}</strong> is already scheduled for an active assignment during this time window:
          </p>

          {/* Existing Assignment Card */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Existing Assignment
            </span>
            <div className="flex items-center space-x-2 text-slate-800 font-bold">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{details.existingLocation || 'Registration Desk'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{details.existingShift || '09:00 AM – 01:00 PM'}</span>
            </div>
          </div>

          {/* Attempted Assignment Card */}
          <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200 space-y-1.5">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
              Attempted Assignment
            </span>
            <div className="flex items-center space-x-2 text-rose-900 font-bold">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{details.attemptedLocation || 'Hall A'}</span>
            </div>
            <div className="flex items-center space-x-2 text-rose-700 font-medium">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>{details.attemptedShift || '10:00 AM – 02:00 PM'}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            To prevent staff fatigue and scheduling collisions, EventForge does not allow accidental overlapping assignments.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onChooseDifferentStaff}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
          >
            Choose Different Staff
          </button>
          <button
            type="button"
            onClick={onAdjustShift}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
          >
            Adjust Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentConflictAlert;
