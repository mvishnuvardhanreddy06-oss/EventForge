import React, { useState } from 'react';
import {
  X,
  Send,
  Mail,
  RefreshCw,
  Clock,
  CheckCircle2
} from 'lucide-react';

const ResendInviteModal = ({
  isOpen,
  onClose,
  speaker,
  onConfirmResend
}) => {
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !speaker) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      onConfirmResend(speaker.id || speaker._id);
      setIsSending(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Resend Invitation?
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {speaker.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-700 leading-relaxed">
            A new invitation email will be sent to this speaker ({speaker.email}).
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center justify-between">
              <span>Event:</span>
              <span className="font-semibold text-slate-900">{speaker.eventName || 'Global Tech Leadership Summit 2026'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Originally Sent:</span>
              <span className="font-semibold text-slate-900">{speaker.invitation?.sentAt || 'Sep 15, 2026'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span className="text-amber-700 font-bold">Awaiting Response</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSending}
            onClick={handleSend}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            {isSending ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Resend</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendInviteModal;
