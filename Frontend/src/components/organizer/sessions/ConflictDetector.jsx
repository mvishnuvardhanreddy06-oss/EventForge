import React from 'react';
import { AlertTriangle, Clock, MapPin, User, X, Check } from 'lucide-react';

const ConflictDetector = ({
  conflict,
  isOpen = false,
  onClose,
  onResolve,
  onEditSchedule
}) => {
  if (!isOpen || !conflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-amber-500 text-white flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-white/20 text-white backdrop-blur-xs">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                Schedule Conflict Detected
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Overlapping session resource allocation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-amber-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-700 space-y-3.5">
          <p className="leading-relaxed">
            This session overlaps with an already scheduled session on the event agenda:
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-400 uppercase">Conflicting Event</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {conflict.type || 'Session Collision'}
              </span>
            </div>

            <p className="font-black text-slate-900 text-xs">
              "{conflict.conflictingSession || 'Cloud Security at Scale'}"
            </p>

            <div className="flex flex-col space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{conflict.occupiedRange || '10:30 AM – 11:30 AM'}</span>
              </div>
              {conflict.room && (
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{conflict.room}</span>
                </div>
              )}
              {conflict.speaker && (
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Speaker: {conflict.speaker}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Automated conflict engine prevents accidental double-bookings of rooms and keynote speakers.
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onEditSchedule || onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Edit Schedule
          </button>
          <button
            type="button"
            onClick={onResolve}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Resolve Conflict</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictDetector;
