import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/api';
import EventCard from '../../components/EventCard';
import Loader from '../../components/Loader';
import { Search, Compass } from 'lucide-react';

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await eventService.getAll({ search, category, status: 'published' });
      if (res.success) setEvents(res.data.events);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discover Conferences & Summits</h1>
        <p className="text-xs text-slate-500 mt-0.5">Browse premier technology conferences, executive workshops, and exhibitions.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 min-w-[200px] flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, keywords, AI, cloud..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchEvents()}
            className="w-full text-xs focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          <option value="">All Topics</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="Cloud Computing">Cloud Computing</option>
          <option value="Business">Business</option>
          <option value="DevOps">DevOps</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Web Development">Web Development</option>
        </select>
        <button
          onClick={fetchEvents}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
        >
          Search
        </button>
      </div>

      {loading ? (
        <Loader text="Searching upcoming events..." />
      ) : events.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white text-slate-400 text-xs">
          No events found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(ev => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
