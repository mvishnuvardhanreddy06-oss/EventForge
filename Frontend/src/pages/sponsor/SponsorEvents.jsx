import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sponsorPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import {
  Calendar,
  MapPin,
  Search,
  Filter,
  Award,
  ArrowRight,
  ExternalLink,
  Users,
  Clock,
  Eye
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const SponsorEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await sponsorPortalService.getEvents();
        if (res.data?.success) {
          setEvents(res.data.data.events || []);
        }
      } catch (err) {
        console.error('Failed to fetch sponsor events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(item => {
    const ev = item.event || item;
    const titleMatch = ev.title?.toLowerCase().includes(search.toLowerCase()) ||
                       ev.description?.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === 'all' || ev.status === statusFilter;
    return titleMatch && statusMatch;
  });

  if (loading) return <Loader text="Loading your sponsored events..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Participating Events</h1>
          <p className="text-xs text-slate-500 mt-1">Conferences, summits, and exhibitions where your organization is a confirmed sponsor partner.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title, keyword, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'upcoming', 'live', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No sponsored events found</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filter tags.'
              : 'Your organization has not yet been assigned to any events.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((item) => {
            const ev = item.event || item;
            const pkg = item.package || {};
            return (
              <div
                key={ev._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-gradient-to-br from-slate-800 to-indigo-950 p-5 text-white flex flex-col justify-between relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white border border-white/20">
                        {ev.category || 'Technology'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                        {pkg.name || 'Sponsor'}
                      </span>
                    </div>

                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ev.status === 'published' || ev.status === 'upcoming'
                          ? 'bg-blue-500/30 text-blue-200'
                          : ev.status === 'live'
                          ? 'bg-emerald-500/30 text-emerald-200'
                          : 'bg-slate-500/30 text-slate-300'
                      }`}>
                        {ev.status || 'Active'}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5 line-clamp-1">{ev.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatDate(ev.startDate)} — {formatDate(ev.endDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ev.venue?.name ? `${ev.venue.name}, ${ev.venue.city}` : 'Virtual Conference'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Event Brief</span>
                  </button>
                  {item._id && (
                    <Link
                      to={`/sponsor/sponsorships/${item._id}`}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Sponsorship</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                {selectedEvent.category || 'General Summit'}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Dates</span>
                <p className="font-semibold text-slate-800">{formatDate(selectedEvent.startDate)}</p>
                <p className="text-slate-500">to {formatDate(selectedEvent.endDate)}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Venue</span>
                <p className="font-semibold text-slate-800 truncate">{selectedEvent.venue?.name || 'Main Hall'}</p>
                <p className="text-slate-500 truncate">{selectedEvent.venue?.city || 'Online'}</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-800">
              <p className="font-semibold">Organizer Contact</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                For questions regarding keynote presence, booth positioning, or AV support, please reach out via announcements or contact your event lead.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SponsorEvents;
