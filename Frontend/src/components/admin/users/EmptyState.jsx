import React from 'react';
import { Users as UsersIcon, RotateCcw } from 'lucide-react';

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
        <UsersIcon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">
        No users found
      </h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
        Try changing your search or filters to locate other platform accounts.
      </p>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
