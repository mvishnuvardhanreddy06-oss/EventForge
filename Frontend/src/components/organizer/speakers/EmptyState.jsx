import React from 'react';
import { Users, Search, Plus, FilterX } from 'lucide-react';

const EmptyState = ({
  type = 'no_results',
  onClearFilters,
  onAddSpeaker
}) => {
  if (type === 'no_results') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-xs animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center mx-auto border border-slate-200">
          <Search className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900">
            No speakers found
          </h3>
          <p className="text-xs text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors inline-flex items-center space-x-1.5"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-xs animate-in fade-in duration-200">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
        <Users className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900">
          No speakers added yet
        </h3>
        <p className="text-xs text-slate-500">
          Add speakers to your events and assign them to sessions.
        </p>
      </div>
      {onAddSpeaker && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAddSpeaker}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Speaker</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
