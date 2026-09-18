import React from 'react';
import { AlertTriangle, Wrench } from 'lucide-react';

const ConflictAlert = ({ conflict, onResolve }) => {
  if (!conflict) return null;

  return (
    <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs space-y-2 text-amber-900 shadow-2xs animate-in fade-in duration-150">
      <div className="flex items-center space-x-2 text-amber-800 font-bold">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>⚠ Schedule Conflict Detected</span>
      </div>

      <p className="text-slate-700 leading-relaxed font-medium">
        "{conflict.session1?.title || 'Session A'}" overlaps with "{conflict.session2?.title || 'Session B'}" in{' '}
        <strong>{conflict.room || 'Hall A'}</strong> from{' '}
        <span className="font-mono font-bold text-amber-900">{conflict.time || '10:00 AM – 11:00 AM'}</span>.
      </p>

      {onResolve && (
        <button
          type="button"
          onClick={onResolve}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-2xs"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Resolve Conflict</span>
        </button>
      )}
    </div>
  );
};

export default ConflictAlert;
