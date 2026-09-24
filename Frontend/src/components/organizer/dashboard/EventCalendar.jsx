import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const EventCalendar = () => {
  const dates = [
    { day: '24', title: 'Global Tech Leadership Summit', link: '/organizer/events/evt-1' },
    { day: '28', title: 'Developer Workshop', link: '/organizer/events/evt-2' },
    { day: '30', title: 'Corporate Networking Evening', link: '/organizer/events/evt-3' }
  ];

  return (
    <div className="panel space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-display font-bold text-ink tracking-tight">
            Upcoming Calendar
          </h3>
          <p className="text-xs text-muted mt-0.5">
            September 2026
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 rounded-lg hover:bg-bg text-muted hover:text-ink cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-lg hover:bg-bg text-muted hover:text-ink cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {dates.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="slot !p-2.5 flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-accent text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              {item.day}
            </div>
            <span className="text-xs font-bold text-ink group-hover:text-accent transition-colors truncate">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
