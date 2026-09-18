import React from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const AutoSaveIndicator = ({ status = 'saved', onRetry }) => {
  if (status === 'saving') {
    return (
      <span className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500">
        <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
        <span>Saving...</span>
      </span>
    );
  }

  if (status === 'error') {
    return (
      <span className="inline-flex items-center space-x-1.5 text-xs font-medium text-rose-600">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Unable to save</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="underline font-bold hover:text-rose-700 ml-1"
          >
            Retry
          </button>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-400">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      <span>Saved just now</span>
    </span>
  );
};

export default AutoSaveIndicator;
