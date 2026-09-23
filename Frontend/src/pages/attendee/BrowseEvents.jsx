import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendeePortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Search,
  Compass,
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  Filter,
  Users,
  Clock,
  Sparkles,
  Ticket
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [format, setFormat] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      if (format !== 'all') params.eventType = format;
      if (sortBy) params.sort = sortBy;

      const res = await attendeePortalService.getEvents(params);
      if (res.data?.success) {
        setEvents(res.data.data.events || []);
      }
    } catch (e) {
      console.error('Failed to browse events:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, format, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const categories = [
    'all',
    'Artificial Intelligence',
    'Cloud Computing',
    'Cybersecurity',
    'Web Development',
    'Business',
    'DevOps'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discover Conferences & Summits</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore premier developer summits, AI conventions, executive panels, and hands-on technical labs.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics, keynote speakers, tracks, or venues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-semibold focus:outline-none"
            >
              <option value="all">All Formats</option>
              <option value="in-person">In-Person</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-semibold focus:outline-none"
            >
              <option value="date-asc">Date: Upcoming First</option>
              <option value="date-desc">Date: Latest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <Loader text="Discovering upcoming events..." />
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No matching events discovered</p>
          <p className="text-xs text-slate-400">Try modifying your keyword search or resetting category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-40 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-5 text-white flex flex-col justify-between relative">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white border border-white/20">
                      {ev.category || 'Technology'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/40 text-blue-200 border border-blue-400/30">
                      {ev.eventType || 'In-Person'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{ev.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{formatDate(ev.startDate)}</span>
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{ev.venueId?.name ? `${ev.venueId.name}, ${ev.venueId.city}` : 'Main Venue Hall'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Capacity: {ev.capacity || 2500} seats</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                <Link
                  to={`/attendee/events/${ev._id}`}
                  className="flex-1 py-2 text-center bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all"
                >
                  Event Brief
                </Link>
                <Link
                  to={`/attendee/register/${ev._id}`}
                  className="flex-1 py-2 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center space-x-1"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
