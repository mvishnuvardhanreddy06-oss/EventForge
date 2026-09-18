import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';

const PublishValidationModal = ({ isOpen, event, onClose, onConfirm }) => {
  if (!isOpen || !event) return null;

  // Determine readiness criteria
  const isReady = (event.setupProgress || 0) >= 80;

  const checks = [
    { label: 'Event name & overview', valid: true },
    { label: 'Date and time schedule', valid: true },
    { label: 'Venue location assigned', valid: (event.setupProgress || 0) >= 60 },
    { label: 'At least one session scheduled', valid: (event.setupProgress || 0) >= 70 },
    { label: 'Registration settings & capacity', valid: (event.setupProgress || 0) >= 80 },
    { label: 'Organizer details verified', valid: true }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isReady ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {isReady ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {isReady ? 'Publish Event?' : 'Event cannot be published yet'}
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

        <div className="p-5 space-y-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="font-bold text-slate-900 block truncate">{event.title}</span>
            <span className="text-[11px] text-slate-500 block">
              {event.eventType || 'Conference'} · {event.venue || 'Hyderabad'}
            </span>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
              Publishing Checklist:
            </span>
            <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
              {checks.map((chk, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className={chk.valid ? 'text-slate-700' : 'text-slate-400'}>
                    {chk.label}
                  </span>
                  {chk.valid ? (
                    <span className="flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-amber-600 font-bold text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Missing</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!isReady && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-amber-900 space-y-1">
              <span className="font-bold text-xs block">Missing requirements:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                <li>Venue floorplan assignment</li>
                <li>Registration capacity confirmation</li>
                <li>At least one verified track session</li>
              </ul>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          {!isReady ? (
            <Link
              to={`/organizer/events/${event.id || event._id}/edit`}
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Complete Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onConfirm(event)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Confirm & Publish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishValidationModal;
