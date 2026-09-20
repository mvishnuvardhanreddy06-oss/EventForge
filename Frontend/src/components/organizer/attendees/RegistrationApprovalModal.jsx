import React from 'react';
import { X, CheckCircle2, Ticket } from 'lucide-react';

const RegistrationApprovalModal = ({
  isOpen,
  onClose,
  attendee,
  onConfirm
}) => {
  if (!isOpen || !attendee) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
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
            Approve Registration?
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            This attendee will receive confirmation and their ticket will become active. They will be notified via email.
          </p>
        </div>

        {/* Attendee Preview Details */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Attendee:</span>
            <span className="font-bold text-slate-900">{attendee.firstName} {attendee.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email:</span>
            <span className="font-semibold text-slate-700">{attendee.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Ticket Tier:</span>
            <span className="font-bold text-blue-600">{attendee.ticketType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Event:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[200px]">{attendee.eventTitle}</span>
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
              onConfirm(attendee);
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationApprovalModal;
