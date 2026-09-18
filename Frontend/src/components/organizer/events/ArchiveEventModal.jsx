import React from 'react';
import { Archive, X } from 'lucide-react';

const ArchiveEventModal = ({ isOpen, event, onClose, onConfirm }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Archive className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Archive Event?
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
          <p className="leading-relaxed">
            This event will be removed from your active event list. Historical registrations and analytics will remain available.
          </p>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-1">
            <span className="font-bold text-slate-900 block truncate">{event.title}</span>
            <span className="text-[11px] text-amber-700 font-semibold block">
              Status: {event.status || 'Published'}
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
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Archive Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveEventModal;
