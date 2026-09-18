import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  type = 'suspend', // 'suspend' | 'activate'
  user,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !user) return null;

  const isSuspend = type === 'suspend';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 p-6 animate-in fade-in zoom-in-95 duration-150 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3.5 ${
            isSuspend ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isSuspend ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <CheckCircle2 className="w-6 h-6" />
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1.5">
          {isSuspend ? 'Suspend this user?' : 'Activate this user?'}
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          {isSuspend ? (
            <>
              <strong className="text-slate-700 font-semibold">{user.name}</strong> will no longer be able to access EventForge until activated again.
            </>
          ) : (
            <>
              <strong className="text-slate-700 font-semibold">{user.name}</strong> will regain immediate operational access to their EventForge workspace.
            </>
          )}
        </p>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(user)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-xs transition-colors ${
              isSuspend ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isSuspend ? 'Suspend User' : 'Activate User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
