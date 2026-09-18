import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarX2, SearchX, Plus, RotateCcw } from 'lucide-react';

export const NoEventsState = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
        <CalendarX2 className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          No events yet
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Create your first corporate event and start managing registrations, sessions, speakers and attendees.
        </p>
      </div>
      <Link
        to="/organizer/events/create"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>+ Create Your First Event</span>
      </Link>
    </div>
  );
};

export const NoSearchResultsState = ({ onReset }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3.5 max-w-md mx-auto shadow-2xs">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <SearchX className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          No events found
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Try changing your search terms or clearing your status and date filters.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Clear Filters</span>
      </button>
    </div>
  );
};
