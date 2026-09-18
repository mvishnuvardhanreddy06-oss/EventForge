import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import EventStatusBadge from './EventStatusBadge';
import EventActionsMenu from './EventActionsMenu';

const EventList = ({
  events = [],
  onDuplicate,
  onArchive,
  onDeleteDraft,
  onPublish
}) => {
  const defaultBanner = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Event</th>
              <th className="py-3.5 px-3">Type</th>
              <th className="py-3.5 px-3">Date</th>
              <th className="py-3.5 px-3">Venue</th>
              <th className="py-3.5 px-3">Registrations</th>
              <th className="py-3.5 px-3">Capacity</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {events.map((event) => {
              const isDraft = (event.status || '').toLowerCase() === 'draft';
              const isCompleted = (event.status || '').toLowerCase() === 'completed';
              const registrations = event.registrationsCount || event.currentRegistrations || 0;
              const capacity = event.capacity || event.maxCapacity || 1000;
              const capacityPercent = Math.min(100, Math.round((registrations / capacity) * 100)) || event.capacityPercent || 0;
              const banner = event.coverImage || event.bannerImage || defaultBanner;

              return (
                <tr key={event.id || event._id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Event Thumbnail & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3 min-w-[200px]">
                      <img
                        src={banner}
                        alt={event.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/organizer/events/${event.id || event._id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors block truncate"
                        >
                          {event.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {event.organization || 'Apex Global Events'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                      {event.eventType || event.category || 'Conference'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 block">
                        {event.dateFormatted || event.date || 'Sep 24, 2026'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {event.timeFormatted || event.time || '09:00 AM'}
                      </span>
                    </div>
                  </td>

                  {/* Venue */}
                  <td className="py-3.5 px-3 max-w-[150px] truncate" title={event.venue || event.location}>
                    <span className="text-slate-600 font-medium truncate block">
                      {event.venue || event.location || 'Hyderabad'}
                    </span>
                  </td>

                  {/* Registrations */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {isDraft ? (
                      <span className="text-slate-400 italic">No registrations yet</span>
                    ) : isCompleted ? (
                      <span className="font-bold text-purple-700">{registrations.toLocaleString()} attendees</span>
                    ) : (
                      <span className="font-mono font-bold text-slate-800">
                        {registrations.toLocaleString()} / {capacity.toLocaleString()}
                      </span>
                    )}
                  </td>

                  {/* Capacity Progress */}
                  <td className="py-3.5 px-3 min-w-[110px]">
                    {isDraft ? (
                      <div className="space-y-1">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${event.setupProgress || 60}%` }} />
                        </div>
                        <span className="text-[10px] text-amber-600 font-bold">{event.setupProgress || 60}% Setup</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-full rounded-full ${capacityPercent >= 80 ? 'bg-blue-600' : 'bg-emerald-500'}`}
                            style={{ width: `${capacityPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold">{capacityPercent}%</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <EventStatusBadge status={event.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      {isDraft ? (
                        <Link
                          to={`/organizer/events/${event.id || event._id}/edit`}
                          className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs"
                        >
                          Edit
                        </Link>
                      ) : isCompleted ? (
                        <Link
                          to={`/organizer/events/${event.id || event._id}/analytics`}
                          className="px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors border border-purple-200/60"
                        >
                          Analytics
                        </Link>
                      ) : (
                        <Link
                          to={`/organizer/events/${event.id || event._id}`}
                          className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                        >
                          Manage
                        </Link>
                      )}

                      <EventActionsMenu
                        event={event}
                        onDuplicate={onDuplicate}
                        onArchive={onArchive}
                        onDeleteDraft={onDeleteDraft}
                        onPublish={onPublish}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
