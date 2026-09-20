import React from 'react';
import { X, QrCode, RotateCcw, CheckCircle2, Ticket } from 'lucide-react';

const CheckInModal = ({
  isOpen,
  onClose,
  attendee,
  isUndo = false,
  onConfirm
}) => {
  if (!isOpen || !attendee) return null;

  const handleAction = () => {
    onConfirm(attendee, isUndo);
    onClose();
  };

  if (isUndo) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
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
              Undo check-in?
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              The attendee will return to <strong className="text-slate-800">Not Checked In</strong> status and their check-in record will be reset.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1">
            <p className="font-bold text-slate-900">{attendee.firstName} {attendee.lastName}</p>
            <p className="text-slate-500">Ticket: {attendee.ticketType} · {attendee.ticketId}</p>
          </div>

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
              onClick={handleAction}
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo Check-In</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
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
            Check in {attendee.firstName} {attendee.lastName}?
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Verify attendee identity and grant venue admittance.
          </p>
        </div>

        {/* Verification Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Ticket Tier:</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {attendee.ticketType}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Registration:</span>
            <span className="font-bold text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed</span>
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Ticket ID:</span>
            <span className="font-mono font-bold text-slate-900">{attendee.ticketId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Payment Status:</span>
            <span className="font-bold text-slate-800 capitalize">{attendee.paymentStatus}</span>
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
            onClick={handleAction}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Check In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
