import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-10 text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
          No audit events found
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search or filters.
        </p>
      </div>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
