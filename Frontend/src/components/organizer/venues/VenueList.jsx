import React from 'react';
import { MapPin, Users, Layers, Calendar, ExternalLink } from 'lucide-react';
import VenueStatusBadge from './VenueStatusBadge';
import VenueActionsMenu from './VenueActionsMenu';

const DEFAULT_VENUE_IMAGE = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop';

const VenueList = ({
  venues,
  onViewDetails,
  onEdit,
  onDuplicate,
  onToggleMaintenance,
  onDeactivate
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Venue</th>
              <th className="py-3.5 px-3">Type</th>
              <th className="py-3.5 px-3">Location</th>
              <th className="py-3.5 px-3 text-right">Capacity</th>
              <th className="py-3.5 px-3 text-center">Rooms</th>
              <th className="py-3.5 px-3">Current Event</th>
              <th className="py-3.5 px-3 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {venues.map((venue) => {
              const coverImage = (venue.images && venue.images.length > 0)
                ? venue.images[0]
                : DEFAULT_VENUE_IMAGE;

              return (
                <tr
                  key={venue.id || venue._id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Venue: Image + Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/70">
                        <img
                          src={coverImage}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_VENUE_IMAGE;
                          }}
                        />
                      </div>
                      <div className="min-w-0 max-w-[220px]">
                        <p
                          onClick={() => onViewDetails(venue)}
                          className="font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer transition-colors"
                          title={venue.name}
                        >
                          {venue.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {venue.address || `${venue.city}, ${venue.state}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60 whitespace-nowrap">
                      {venue.type}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{venue.city}{venue.state ? `, ${venue.state}` : ''}</span>
                    </span>
                  </td>

                  {/* Capacity */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <span className="font-extrabold text-slate-800">
                      {Number(venue.capacity).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">seats</span>
                  </td>

                  {/* Rooms */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] bg-slate-100 text-slate-700">
                      {venue.rooms?.length || venue.roomCount || 0}
                    </span>
                  </td>

                  {/* Current Event */}
                  <td className="py-3.5 px-3 max-w-[200px]">
                    {venue.currentEvent ? (
                      <div className="truncate">
                        <p className="font-semibold text-blue-700 text-xs truncate">
                          {venue.currentEvent.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {venue.currentEvent.date}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">
                        No active booking
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <VenueStatusBadge status={venue.status} size="xs" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onViewDetails(venue)}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-blue-600 bg-slate-100/80 hover:bg-blue-50/60 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(venue)}
                        className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <VenueActionsMenu
                        venue={venue}
                        onViewDetails={onViewDetails}
                        onEdit={onEdit}
                        onDuplicate={onDuplicate}
                        onToggleMaintenance={onToggleMaintenance}
                        onDeactivate={onDeactivate}
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

export default VenueList;
