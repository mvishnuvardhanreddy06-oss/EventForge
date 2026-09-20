import React from 'react';
import { Calendar, MapPin, Layers, ChevronDown, Building } from 'lucide-react';

const EventSelector = ({
  events = [],
  selectedEventId,
  onEventChange,
  currentEvent
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Dropdown Left */}
        <div className="flex-1 min-w-[280px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Target Event Agenda
          </label>
          <div className="relative">
            <select
              value={selectedEventId}
              onChange={(e) => onEventChange(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/60 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer truncate"
            >
              {events.map((ev) => (
                <option key={ev.id || ev._id} value={ev.id || ev._id}>
                  {ev.title} {ev.eventType ? `(${ev.eventType})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Event Context Strip Right */}
        {currentEvent && (
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 text-xs">
            {/* Event Date */}
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Event Date</p>
                <p className="font-bold text-slate-800">
                  {currentEvent.dateFormatted || currentEvent.date || 'September 24, 2026'}
                </p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Venue</p>
                <p className="font-bold text-slate-800 max-w-[200px] truncate" title={currentEvent.venue}>
                  {currentEvent.venue || 'Hyderabad International Convention Centre'}
                </p>
              </div>
            </div>

            {/* Sessions Count */}
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Agenda</p>
                <p className="font-bold text-slate-800">
                  {currentEvent.sessionCount || 24} <span className="text-[10px] font-normal text-slate-500">sessions</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSelector;
