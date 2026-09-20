import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  Trash2,
  Layers,
  Calendar,
  Clock,
  ShieldAlert
} from 'lucide-react';

const RemoveSpeakerModal = ({
  isOpen,
  onClose,
  speaker,
  onConfirmRemove,
  onReviewSessions
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  if (!isOpen || !speaker) return null;

  const assignedSessions = speaker.sessions || speaker.assignedSessions || [];
  const hasSessions = assignedSessions.length > 0;

  const handleConfirm = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onConfirmRemove(speaker.id || speaker._id);
      setIsRemoving(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl text-white shadow-md ${hasSessions ? 'bg-amber-600 shadow-amber-500/20' : 'bg-rose-600 shadow-rose-500/20'}`}>
              {hasSessions ? <AlertTriangle className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {hasSessions ? 'Assigned Sessions Notice' : 'Remove Speaker?'}
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {hasSessions ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-1.5">
                <p className="text-sm font-bold">
                  Speaker has {assignedSessions.length} assigned session{assignedSessions.length > 1 ? 's' : ''}.
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Removing this speaker requires reassignment of those sessions.
                </p>
              </div>

              {/* Sessions summary */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Assigned Sessions:
                </p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {assignedSessions.map((ses, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-900 truncate max-w-[240px]">
                        {ses.title}
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {ses.time || '10:00 AM'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-slate-700 leading-relaxed text-xs">
              <p>
                This will remove the speaker from this event.
              </p>
              <p className="text-slate-500">
                Historical event records will remain available.
              </p>
            </div>
          )}
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

          {hasSessions ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReviewSessions?.(speaker);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Review Sessions
            </button>
          ) : (
            <button
              type="button"
              disabled={isRemoving}
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveSpeakerModal;
