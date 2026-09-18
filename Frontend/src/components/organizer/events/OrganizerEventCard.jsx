import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import EventStatusBadge from './EventStatusBadge';
import EventActionsMenu from './EventActionsMenu';

const OrganizerEventCard = ({
  event,
  onDuplicate,
  onArchive,
  onDeleteDraft,
  onPublish
}) => {
  const isDraft = (event.status || '').toLowerCase() === 'draft';
  const isCompleted = (event.status || '').toLowerCase() === 'completed';

  const defaultBanner = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';
  const banner = event.coverImage || event.bannerImage || defaultBanner;

  // Capacity calculation
  const registrations = event.registrationsCount || event.currentRegistrations || 0;
  const capacity = event.capacity || event.maxCapacity || 1000;
  const capacityPercent = Math.min(100, Math.round((registrations / capacity) * 100)) || event.capacityPercent || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col group min-w-0">
      {/* Banner / Cover Header */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden shrink-0">
        <img
          src={banner}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md uppercase tracking-wide border border-white/10">
            {event.eventType || event.category || 'Conference'}
          </span>
          <EventStatusBadge status={event.status} className="shadow-xs backdrop-blur-md" />
        </div>

        {/* Organization / Tenant Scope at bottom-left */}
        <div className="absolute bottom-2.5 left-3 flex items-center space-x-1.5 text-white/90 text-[11px] font-medium drop-shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="truncate">{event.organization || 'Apex Global Events'}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
              {event.subtitle || event.theme || event.eventType || 'Corporate Summit'}
            </p>
          </div>

          {/* Date & Time */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700">{event.dateFormatted || event.date || 'Sep 24, 2026'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500">{event.timeFormatted || event.time || '09:00 AM – 06:00 PM'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-600 truncate">{event.venue || event.location || 'Hyderabad'}</span>
            </div>
          </div>

          {/* Registration / Setup Progress Bar */}
          <div className="pt-2 border-t border-slate-100">
            {isDraft ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Draft Setup</span>
                  <span className="font-bold text-amber-600">{event.setupProgress || 60}% Complete</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${event.setupProgress || 60}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">No registrations yet</p>
              </div>
            ) : isCompleted ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Attendees</span>
                  <span className="font-bold text-purple-700">{registrations} delegates</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full w-full" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-0.5">
                  <span>Revenue Generated</span>
                  <span className="font-mono text-emerald-700 font-bold">{event.revenue || '₹3,80,000'}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Registrations</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {registrations.toLocaleString()} / {capacity.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      capacityPercent >= 80 ? 'bg-blue-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Capacity</span>
                  <span className="font-bold text-slate-700">{capacityPercent}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {isDraft ? (
            <Link
              to={`/organizer/events/${event.id || event._id}/edit`}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <span>Continue Editing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : isCompleted ? (
            <Link
              to={`/organizer/events/${event.id || event._id}/analytics`}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors border border-purple-200/60"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to={`/organizer/events/${event.id || event._id}`}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
            >
              <span>Manage Event</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* 3-dot dropdown menu */}
          <EventActionsMenu
            event={event}
            onDuplicate={onDuplicate}
            onArchive={onArchive}
            onDeleteDraft={onDeleteDraft}
            onPublish={onPublish}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
