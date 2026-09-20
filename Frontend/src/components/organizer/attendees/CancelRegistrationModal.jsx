import React, { useState } from 'react';
import { X, Ban, AlertTriangle } from 'lucide-react';

const CANCELLATION_REASONS = [
  'Attendee requested cancellation',
  'Duplicate booking / registration',
  'Event schedule conflict',
  'Visa / travel issue',
  'Corporate policy change',
  'Other / Unspecified'
];

const CancelRegistrationModal = ({
  isOpen,
  onClose,
  attendee,
  onConfirm
}) => {
  const [reason, setReason] = useState('Attendee requested cancellation');
  const [refundNote, setRefundNote] = useState('');

  if (!isOpen || !attendee) return null;

  const isPaid = attendee.paymentStatus === 'paid' || (attendee.amountPaid && attendee.amountPaid > 0);

  const handleCancel = () => {
    onConfirm(attendee, reason, refundNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center shrink-0">
            <Ban className="w-6 h-6" />
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
            Cancel Registration?
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            The attendee's registration will be cancelled. Their ticket barcode will be invalidated immediately.
          </p>
        </div>

        {/* Attendee Summary */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Attendee:</span>
            <span className="font-bold text-slate-900">{attendee.firstName} {attendee.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Ticket:</span>
            <span className="font-semibold text-slate-700">{attendee.ticketType} ({attendee.ticketId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment:</span>
            <span className="font-mono font-bold text-slate-900">
              ₹{typeof attendee.amountPaid === 'number' ? attendee.amountPaid.toLocaleString('en-IN') : '4,999'} ({attendee.paymentStatus})
            </span>
          </div>
        </div>

        {/* Refund Warning */}
        {isPaid && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex items-start space-x-2 text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">A refund may be required.</span>
              <p className="text-[11px] leading-relaxed">
                Cancelling this registration invalidates access. Refunds must be processed through your organization's finance gateway.
              </p>
            </div>
          </div>
        )}

        {/* Reason */}
        <div className="space-y-1 text-xs">
          <label className="block font-bold text-slate-700">Cancellation Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-rose-500 outline-none"
          >
            {CANCELLATION_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Keep Registration
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center space-x-1.5"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Cancel Registration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRegistrationModal;
