import React from 'react';
import { AlertTriangle, Calendar, Clock, ArrowRight, X } from 'lucide-react';

const VenueConflictAlert = ({
  isOpen = false,
  onClose,
  conflictData = {
    venueName: 'Hyderabad International Convention Centre',
    existingEvent: 'Global Tech Leadership Summit',
    date: 'September 24, 2026',
    time: '09:00 AM – 06:00 PM',
    room: 'Main Plenary Hall'
  },
  onChooseAnother,
  onViewBooking
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
        {/* Amber Warning Header */}
        <div className="p-5 bg-amber-500 text-white flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-white/20 text-white backdrop-blur-xs">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                Venue Booking Conflict
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Overlapping schedule detected for this facility
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-amber-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900">
              {conflictData.venueName || 'This venue'}
            </span>{' '}
            is already booked for another organization event on{' '}
            <span className="font-bold text-slate-900">{conflictData.date}</span> from{' '}
            <span className="font-bold text-slate-900">{conflictData.time}</span>.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-400 uppercase">Existing Booking:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Confirmed Event
              </span>
            </div>
            <p className="font-bold text-slate-900 text-xs">
              {conflictData.existingEvent}
            </p>
            <div className="flex items-center space-x-4 text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{conflictData.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{conflictData.time}</span>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Please choose a different venue, select another hall, or adjust the event start/end schedule to resolve this collision.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onChooseAnother || onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Choose Another Venue
          </button>
          <button
            type="button"
            onClick={onViewBooking || onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            <span>View Booking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueConflictAlert;
