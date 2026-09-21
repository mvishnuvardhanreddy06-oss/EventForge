import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

const SearchEmptyState = ({ onClearFilters }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-2xs max-w-lg mx-auto my-12 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-2xs">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-black text-slate-900 tracking-tight">
        No staff found
      </h3>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
        Try changing your search or filters.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl shadow-2xs transition-colors"
      >
        <RotateCcw className="w-4 h-4 text-slate-500" />
        <span>Clear Filters</span>
      </button>
    </div>
  );
};

export default SearchEmptyState;
