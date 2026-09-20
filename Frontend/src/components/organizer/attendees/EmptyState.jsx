import React from 'react';
import { Users, SearchX, Plus, Upload, RotateCcw } from 'lucide-react';

const EmptyState = ({
  isSearch = false,
  onAddAttendee,
  onImportAttendees,
  onResetFilters
}) => {
  if (isSearch) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-8 shadow-2xs space-y-4 animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center mx-auto">
          <SearchX className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            No attendees found
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Try changing your search or filters to see registered attendees.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-8 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center mx-auto">
        <Users className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900 tracking-tight">
          No attendees registered yet
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Once registrations begin, attendees will appear here. You can manually add attendees or import from a spreadsheet.
        </p>
      </div>
      <div className="flex items-center justify-center space-x-3 pt-2">
        <button
          type="button"
          onClick={onAddAttendee}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Attendee</span>
        </button>
        <button
          type="button"
          onClick={onImportAttendees}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-all"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Import Attendees</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
