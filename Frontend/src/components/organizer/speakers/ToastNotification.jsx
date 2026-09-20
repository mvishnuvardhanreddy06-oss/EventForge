import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  let borderClass = 'border-emerald-200 bg-emerald-50 text-emerald-900';

  if (isError) {
    icon = <AlertCircle className="w-4 h-4 text-rose-600" />;
    borderClass = 'border-rose-200 bg-rose-50 text-rose-900';
  } else if (isWarning) {
    icon = <AlertCircle className="w-4 h-4 text-amber-600" />;
    borderClass = 'border-amber-200 bg-amber-50 text-amber-900';
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xs ${borderClass}`}
      >
        <div className="shrink-0">{icon}</div>
        <p className="text-xs font-bold flex-1">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
