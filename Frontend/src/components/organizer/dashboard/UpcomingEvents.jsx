import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const UpcomingEvents = () => {
  const events = [
    {
      id: 'evt-1',
      title: 'Global Tech Leadership Summit 2026',
      date: 'Sep 24, 2026',
      time: '09:00 AM – 06:00 PM',
      location: 'Hyderabad International Convention Centre',
      currentRegistrations: 1240,
      maxCapacity: 1500,
      capacityPercent: 82,
      status: 'Published',
      actionLabel: 'Manage Event',
      actionLink: '/organizer/events/evt-1'
    },
    {
      id: 'evt-2',
      title: 'AI & Cloud Innovation Conference',
      date: 'Oct 04, 2026',
      time: '10:00 AM – 05:30 PM',
      location: 'Hyderabad',
      currentRegistrations: 684,
      maxCapacity: 1000,
      capacityPercent: 68,
      status: 'Published',
      actionLabel: 'Manage Event',
      actionLink: '/organizer/events/evt-2'
    },
    {
      id: 'evt-3',
      title: 'FinTech Future Forum',
      date: 'Oct 18, 2026',
      time: '09:30 AM – 04:30 PM',
      location: 'Bengaluru',
      currentRegistrations: 420,
      maxCapacity: 750,
      capacityPercent: 56,
      status: 'Draft',
      actionLabel: 'Continue Editing',
      actionLink: '/organizer/events/evt-3/edit'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Upcoming Events
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your next events and their current registration status.
          </p>
        </div>
        <Link
          to="/organizer/events"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((ev) => {
          const isPublished = ev.status === 'Published';
          return (
            <div
              key={ev.id}
              className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-4 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`}
                    />
                    <span>{ev.status}</span>
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    {ev.date}
                  </span>
                </div>

                {/* Event Title */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {ev.title}
                </h4>

                {/* Venue / Location */}
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                {/* Registration Capacity Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Registrations</span>
                    <span className="font-bold text-slate-900">
                      {ev.currentRegistrations.toLocaleString()} / {ev.maxCapacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ev.capacityPercent >= 80 ? 'bg-blue-600' : 'bg-blue-500'
                      }`}
                      style={{ width: `${ev.capacityPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 block text-right">
                    {ev.capacityPercent}% capacity
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={ev.actionLink}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>{ev.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;
