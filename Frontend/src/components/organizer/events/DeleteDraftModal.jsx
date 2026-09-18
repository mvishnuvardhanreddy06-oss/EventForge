import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';

const DeleteDraftModal = ({ isOpen, event, onClose, onConfirm }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Delete Draft?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed text-rose-700 font-semibold flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>This action cannot be undone.</span>
          </p>

          <p className="leading-relaxed">
            Are you sure you want to permanently delete this draft event? All unsaved sessions and staging records will be removed.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block truncate">{event.title}</span>
            <span className="text-[11px] text-slate-500 block">
              Draft setup progress: {event.setupProgress || 60}%
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(event)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Delete Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDraftModal;
