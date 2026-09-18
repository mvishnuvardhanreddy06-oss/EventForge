import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarX2, Plus } from 'lucide-react';

export const NoEventsState = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-3">
    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
      <CalendarX2 className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-900">No events yet</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Create your first event and start managing registrations, sessions and attendees.
      </p>
    </div>
    <Link
      to="/organizer/events/create"
      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>+ Create Event</span>
    </Link>
  </div>
);

export const NoRegistrationsState = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
    <h4 className="text-sm font-bold text-slate-900">No registrations yet</h4>
    <p className="text-xs text-slate-500 max-w-sm mx-auto">
      Registrations will appear here once attendees start registering for your events.
    </p>
  </div>
);
