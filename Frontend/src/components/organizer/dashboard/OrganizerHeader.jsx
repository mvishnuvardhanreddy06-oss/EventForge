import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';

const OrganizerHeader = ({ userName = 'Vishnureddy' }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
          Good morning, {userName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Here's what's happening with your events today.
        </p>
      </div>

      <div className="flex items-center space-x-2.5 shrink-0">
        <Link
          to="/organizer/calendar"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>View Calendar</span>
        </Link>

        <Link
          to="/organizer/events/create"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Event</span>
        </Link>
      </div>
    </div>
  );
};

export default OrganizerHeader;
