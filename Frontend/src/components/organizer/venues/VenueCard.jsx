import React from 'react';
import { MapPin, Users, Layers, Calendar, Check } from 'lucide-react';
import VenueStatusBadge from './VenueStatusBadge';
import VenueActionsMenu from './VenueActionsMenu';

const DEFAULT_VENUE_IMAGE = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop';

const VenueCard = ({
  venue,
  onViewDetails,
  onEdit,
  onDuplicate,
  onToggleMaintenance,
  onDeactivate
}) => {
  const coverImage = (venue.images && venue.images.length > 0)
    ? venue.images[0]
    : DEFAULT_VENUE_IMAGE;

  const facilitiesList = venue.facilities || [];
  const displayFacilities = facilitiesList.slice(0, 4);
  const remainingCount = facilitiesList.length - 4;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Card Header & Image */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={coverImage}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_VENUE_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

          {/* Status Badge in Top-Left */}
          <div className="absolute top-3 left-3">
            <VenueStatusBadge status={venue.status} size="sm" />
          </div>

          {/* Venue Type Tag in Top-Right */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs border border-white/60 shadow-2xs">
              {venue.type}
            </span>
          </div>

          {/* Title & Location Overlaid at Bottom */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3
              onClick={() => onViewDetails(venue)}
              className="font-black text-base text-white tracking-tight leading-snug truncate hover:text-blue-200 cursor-pointer transition-colors drop-shadow-xs"
              title={venue.name}
            >
              {venue.name}
            </h3>
            <p className="text-xs text-slate-200 flex items-center space-x-1 mt-0.5 drop-shadow-xs truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>{venue.city}{venue.state ? `, ${venue.state}` : ''}</span>
            </p>
          </div>
        </div>

        {/* Specs Strip: Capacity & Rooms */}
        <div className="p-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Capacity</p>
                <p className="font-extrabold text-slate-800">
                  {Number(venue.capacity).toLocaleString()} <span className="text-[10px] font-normal text-slate-500">attendees</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 border-l border-slate-200/80 pl-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Rooms</p>
                <p className="font-extrabold text-slate-800">
                  {venue.rooms?.length || venue.roomCount || 0} <span className="text-[10px] font-normal text-slate-500">halls</span>
                </p>
              </div>
            </div>
          </div>

          {/* Current Event Banner (If Booked) */}
          {venue.currentEvent && (
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
              <div className="flex items-center space-x-1.5 text-blue-800 font-bold text-[11px] mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Current Booking:</span>
              </div>
              <p className="font-semibold text-slate-900 truncate">
                {venue.currentEvent.title}
              </p>
              {venue.currentEvent.date && (
                <p className="text-[10px] text-blue-700 font-medium mt-0.5">
                  {venue.currentEvent.date}
                </p>
              )}
            </div>
          )}

          {/* Facilities Pill List */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Key Facilities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {displayFacilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                  <span>{fac}</span>
                </span>
              ))}
              {remainingCount > 0 && (
                <span
                  onClick={() => onViewDetails(venue)}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100 cursor-pointer transition-colors"
                  title="Click to view all facilities"
                >
                  +{remainingCount} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onViewDetails(venue)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs transition-all"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onEdit(venue)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 transition-all"
          >
            Edit
          </button>
        </div>

        <VenueActionsMenu
          venue={venue}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onToggleMaintenance={onToggleMaintenance}
          onDeactivate={onDeactivate}
        />
      </div>
    </div>
  );
};

export default VenueCard;
