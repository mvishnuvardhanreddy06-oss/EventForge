import React, { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';

const REJECTION_REASONS = [
  'Eligibility criteria not met',
  'Duplicate registration submission',
  'Event capacity exhausted',
  'Incomplete attendee profile',
  'Corporate domain verification failure',
  'Other / Custom Reason'
];

const RejectRegistrationModal = ({
  isOpen,
  onClose,
  attendee,
  onConfirm
}) => {
  const [reason, setReason] = useState('Eligibility criteria not met');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen || !attendee) return null;

  const handleReject = () => {
    const finalReason = reason === 'Other / Custom Reason' ? customNote : reason;
    onConfirm(attendee, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
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
            Reject Registration?
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            The attendee will not be allowed to attend this event unless they register again.
          </p>
        </div>

        {/* Attendee Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1">
          <p className="font-bold text-slate-900">{attendee.firstName} {attendee.lastName}</p>
          <p className="text-slate-500">{attendee.email}</p>
        </div>

        {/* Reason Selector */}
        <div className="space-y-2 text-xs">
          <label className="block font-bold text-slate-700">Optional Rejection Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-rose-500 outline-none"
          >
            {REJECTION_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {reason === 'Other / Custom Reason' && (
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Specify the reason for rejecting registration..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none mt-2"
            />
          )}
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
            onClick={handleReject}
            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center space-x-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject Registration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectRegistrationModal;
