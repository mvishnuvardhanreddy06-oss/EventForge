import React from 'react';
import { AlertCircle, AlertTriangle, PauseCircle, CheckCircle2, X } from 'lucide-react';

const DeactivateVenueModal = ({
  isOpen,
  onClose,
  venue,
  onConfirmDeactivate,
  onConfirmActivate
}) => {
  if (!isOpen || !venue) return null;

  const isBooked = venue.status === 'booked' || Boolean(venue.currentEvent);
  const isCurrentlyInactive = venue.status === 'inactive';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-2xl ${
                isBooked
                  ? 'bg-amber-100 text-amber-600'
                  : isCurrentlyInactive
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              {isBooked ? (
                <AlertCircle className="w-5 h-5 stroke-[2.5]" />
              ) : isCurrentlyInactive ? (
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <PauseCircle className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isBooked
                  ? 'Action Blocked'
                  : isCurrentlyInactive
                  ? 'Reactivate Venue?'
                  : 'Deactivate Venue?'}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[240px]">
                {venue.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-600 space-y-3.5">
          {isBooked ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1.5">
                <p className="font-bold">
                  This venue is currently assigned to an event.
                </p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Please review the active booking before deactivating the venue. Assigned venues cannot be retired while sessions or registrations are live.
                </p>
              </div>

              {venue.currentEvent && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Event</p>
                  <p className="font-bold text-slate-900 mt-0.5">{venue.currentEvent.title}</p>
                  <p className="text-[11px] text-slate-500">{venue.currentEvent.date}</p>
                </div>
              )}
            </div>
          ) : isCurrentlyInactive ? (
            <div className="space-y-2">
              <p className="leading-relaxed">
                Reactivating <span className="font-bold text-slate-900">{venue.name}</span> will restore it to the pool of venues available for scheduling and reservation.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="leading-relaxed">
                This venue will no longer be available for new event bookings. Existing event history will remain intact.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
                💡 <span className="font-semibold text-slate-700">Enterprise Audit Rule:</span> Venues are preserved for historical audit trails, accounting, and compliance.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            {isBooked ? 'Understood' : 'Cancel'}
          </button>

          {!isBooked && (
            <button
              type="button"
              onClick={() => {
                if (isCurrentlyInactive) {
                  onConfirmActivate(venue);
                } else {
                  onConfirmDeactivate(venue);
                }
              }}
              className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
                isCurrentlyInactive
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
              }`}
            >
              {isCurrentlyInactive ? 'Reactivate Venue' : 'Deactivate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeactivateVenueModal;
