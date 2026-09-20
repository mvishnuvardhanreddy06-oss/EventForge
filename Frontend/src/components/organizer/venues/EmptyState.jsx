import React from 'react';
import { Building2, SearchX, Plus, RotateCcw } from 'lucide-react';

export const NoVenuesState = ({ onAddVenue }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-2xs max-w-xl mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
        <Building2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900 tracking-tight">
          No venues added yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Add your organization's first venue to start planning event locations and schedules.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onAddVenue}
          className="inline-flex items-center space-x-2 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Venue</span>
        </button>
      </div>
    </div>
  );
};

export const NoSearchResultsState = ({ onClearFilters }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-2xs max-w-xl mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
        <SearchX className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900 tracking-tight">
          No venues found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Try changing your search or filters to locate specific venues across managed cities.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center space-x-2 px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  );
};

export default { NoVenuesState, NoSearchResultsState };
