import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { speakerPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Building2,
  Users,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

const SpeakerEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await speakerPortalService.getEvents({ filter: statusFilter });
      if (res.success && res.data) {
        setEvents(res.data.events || []);
      }
    } catch (err) {
      console.error('Failed to load speaker events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.venueName && e.venueName.toLowerCase().includes(q)) ||
      (e.city && e.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Events where you are participating as a speaker.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/speaker/sessions"
            className="px-3.5 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>My Sessions Agenda</span>
          </Link>
        </div>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, venue, or city..."
            className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'upcoming', 'live', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                statusFilter === f
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* EVENT CARDS GRID */}
      {loading ? (
        <Loader text="Loading your participating events..." />
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Events Yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            You haven't been assigned to any events matching this filter yet. When organizers invite you, your conferences will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                    {event.speakerRole || 'Keynote Speaker'}
                  </span>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{event.status || 'Confirmed'}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 py-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.venueName}, {event.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="font-semibold text-purple-700">{event.sessionsCount || 1} Speaking Sessions</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
                >
                  View Event
                </button>
                <Link
                  to="/speaker/sessions"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <span>Sessions</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EVENT DETAILS MODAL (READ-ONLY) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
                  Event Overview (Read-Only)
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Description</p>
                <p className="text-slate-700 mt-1 leading-relaxed">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Dates</p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {new Date(selectedEvent.startDate).toLocaleDateString()} – {new Date(selectedEvent.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Venue & Location</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedEvent.venueName}</p>
                  <p className="text-[11px] text-slate-500">{selectedEvent.city}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Your Role</p>
                  <p className="font-bold text-purple-700 mt-0.5">{selectedEvent.speakerRole || 'Keynote Speaker'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Participation Status</p>
                  <p className="font-bold text-emerald-600 mt-0.5">Confirmed by Organizer</p>
                </div>
              </div>

              {selectedEvent.sessions && selectedEvent.sessions.length > 0 && (
                <div>
                  <p className="font-bold text-slate-700 mb-2">Your Assigned Sessions in this Event</p>
                  <div className="space-y-2">
                    {selectedEvent.sessions.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{s.title}</p>
                          <p className="text-[11px] text-slate-500">{s.time} • Room: {s.room}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                          Confirmed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50/80 border border-blue-200/70 rounded-xl text-blue-900 text-[11px] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Event parameters and logistics are managed by the Event Organizer. Contact the organizer team for venue modifications.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <Link
                to="/speaker/sessions"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
              >
                Go to Sessions
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerEvents;
