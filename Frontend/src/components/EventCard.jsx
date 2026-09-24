import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Tag } from 'lucide-react';
import Badge from './Badge';
import { formatDate } from '../utils/formatters';

const EventCard = ({ event, isOrganizer = false }) => {
  const defaultBanner = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';

  return (
    <div className="panel !p-0 overflow-hidden flex flex-col group hover:border-accent/40 transition-all">
      {/* Image */}
      <div className="relative h-44 w-full bg-bg overflow-hidden">
        <img
          src={event.bannerImage || defaultBanner}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge status={event.status} />
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="chip !bg-surface/90 !text-ink !border-line backdrop-blur-sm">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-display font-bold text-ink mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-1.5 mb-4 text-xs text-muted font-medium">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-muted" />
              <span>{event.venueId?.name || 'Virtual / TBA'}, {event.venueId?.city || ''}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3.5 h-3.5 text-muted" />
              <span>Capacity: {event.capacity} delegates</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-line flex items-center justify-between">
          <div className="flex items-center space-x-1 overflow-hidden max-w-[60%]">
            {(event.tags || []).slice(0, 2).map((tag, idx) => (
              <span key={idx} className="chip !py-0.5 !px-2 text-[10px] truncate">
                #{tag}
              </span>
            ))}
          </div>

          {isOrganizer ? (
            <Link
              to={`/organizer/events/${event._id}`}
              className="inline-flex items-center space-x-1 text-xs font-bold text-accent hover:underline"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to={`/attendee/events/${event._id}`}
              className="btn-primary !py-1.5 !px-3 text-xs font-bold inline-flex items-center space-x-1"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
