import React from 'react';
import { X, Hourglass, CheckCircle2, ArrowUpRight } from 'lucide-react';

const WaitlistManagerModal = ({
  isOpen,
  onClose,
  attendee,
  onConfirmPromote
}) => {
  if (!isOpen || !attendee) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/60 text-purple-600 flex items-center justify-center shrink-0">
            <Hourglass className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Promote Attendee from Waitlist?
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Capacity has become available for this event. Promoting this attendee will confirm their registration and issue an official ticket barcode.
          </p>
        </div>

        {/* Waitlist Position Card */}
        <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-purple-800 font-bold">Waitlist Queue Position:</span>
            <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white shadow-2xs">
              #{attendee.waitlistPosition || 12}
            </span>
          </div>

          <div className="pt-2 border-t border-purple-200/60 space-y-1">
            <p className="font-bold text-slate-900">{attendee.firstName} {attendee.lastName}</p>
            <p className="text-slate-600">{attendee.email}</p>
            <p className="text-slate-600">Requested Pass: <strong className="text-purple-900">{attendee.ticketType}</strong></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmPromote(attendee);
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Promote to Registration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitlistManagerModal;
