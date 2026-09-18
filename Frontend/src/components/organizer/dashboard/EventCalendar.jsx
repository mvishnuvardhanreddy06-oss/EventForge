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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Upcoming Calendar
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            September 2026
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {dates.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 hover:border-blue-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              {item.day}
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
