import React from 'react';
import { AlertTriangle } from 'lucide-react';

const CancelSubscriptionModal = ({
  subscription,
  isOpen,
  onClose,
  onConfirmCancel
}) => {
  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Cancel this subscription?
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              <strong>{subscription.orgName}</strong>
            </p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed bg-rose-50/70 p-3 rounded-xl border border-rose-100">
              The organization will lose access to paid features after the current billing period.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Keep Subscription
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmCancel(subscription.id);
                onClose();
              }}
              className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
