import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';

const OrganizerHeader = ({ userName = 'Vishnureddy' }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <h1 className="text-2xl sm:text-[26px] font-display font-bold text-ink tracking-tight">
          Good morning, {userName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-0.5 font-medium">
          Here's what's happening with your events today.
        </p>
      </div>

      <div className="flex items-center space-x-2.5 shrink-0">
        <Link
          to="/organizer/events"
          className="btn text-xs font-semibold"
        >
          <Calendar className="w-3.5 h-3.5 text-muted mr-1.5" />
          <span>Manage Events</span>
        </Link>

        <Link
          to="/organizer/events/create"
          className="btn btn-primary text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Create Event</span>
        </Link>
      </div>
    </div>
  );
};

export default OrganizerHeader;
