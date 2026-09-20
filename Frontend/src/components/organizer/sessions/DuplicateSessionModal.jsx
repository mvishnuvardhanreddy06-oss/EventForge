import React from 'react';
import { Copy, X } from 'lucide-react';

const DuplicateSessionModal = ({
  isOpen,
  onClose,
  session,
  onConfirm
}) => {
  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Duplicate Session?
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[220px]">
                {session.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-600 space-y-3">
          <p className="leading-relaxed">
            A new draft session will be created using this session's details. You can adjust the room, speaker, and time slot before publishing it to the live agenda.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
            New duplicate status will automatically be set to <span className="font-bold text-amber-700">Draft</span>.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(session)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            Duplicate
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateSessionModal;
