import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
          isSuccess
            ? 'bg-emerald-900 text-white border-emerald-800 shadow-emerald-950/20'
            : isError
            ? 'bg-rose-900 text-white border-rose-800 shadow-rose-950/20'
            : 'bg-slate-900 text-white border-slate-800 shadow-slate-950/20'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400 shrink-0" />}

        <span className="leading-snug">{toast.message}</span>

        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors ml-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
