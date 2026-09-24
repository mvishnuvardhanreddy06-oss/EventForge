import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { analyticsService } from '../../../services/api';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await analyticsService.getOrganizerDashboard();
        const rawEvents = res?.data?.events || res?.events || [];
        if (Array.isArray(rawEvents)) {
          setEvents(rawEvents.slice(0, 3).map(e => ({
            id: e._id || e.id,
            title: e.title,
            date: e.startDate ? new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
            time: e.startDate ? new Date(e.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
            location: e.venue || 'Virtual',
            currentRegistrations: e.currentRegistrations || 0,
            maxCapacity: e.maxCapacity || 1000,
            capacityPercent: e.capacityPercent || 0,
            status: (e.status || 'published').charAt(0).toUpperCase() + (e.status || 'published').slice(1),
            actionLabel: 'Manage Event',
            actionLink: `/organizer/events/${e._id || e.id}`
          })));
        }
      } catch (err) {
        console.error('Failed to load upcoming events for dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="panel space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div>
          <h3 className="text-base font-display font-bold text-ink tracking-tight">
            Upcoming Events
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Your next events and their current registration status.
          </p>
        </div>
        <Link
          to="/organizer/events"
          className="text-xs font-bold text-accent hover:underline flex items-center space-x-1"
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
              className="bg-bg/40 rounded-xl border border-line p-4 hover:border-accent/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isPublished
                        ? 'bg-teal/10 text-teal border border-teal/20'
                        : 'bg-gold/10 text-gold border border-gold/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPublished ? 'bg-teal animate-pulse' : 'bg-gold'
                      }`}
                    />
                    <span>{ev.status}</span>
                  </span>

                  <span className="text-[11px] font-mono text-muted">
                    {ev.date}
                  </span>
                </div>

                {/* Event Title */}
                <h4 className="text-sm font-display font-bold text-ink leading-snug line-clamp-2">
                  {ev.title}
                </h4>

                {/* Venue / Location */}
                <div className="space-y-1 text-xs text-muted">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                {/* Registration Capacity Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">Registrations</span>
                    <span className="font-bold text-ink">
                      {ev.currentRegistrations.toLocaleString()} / {ev.maxCapacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-accent"
                      style={{ width: `${ev.capacityPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-muted block text-right">
                    {ev.capacityPercent}% capacity
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={ev.actionLink}
                className="btn w-full py-2 px-3 text-xs font-bold flex items-center justify-center space-x-1.5"
              >
                <span>{ev.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;
