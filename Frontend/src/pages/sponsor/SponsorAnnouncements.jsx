import React, { useState, useEffect } from 'react';
import { sponsorPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Megaphone,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Bell,
  Search,
  Check
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const SponsorAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const res = await sponsorPortalService.getAnnouncements();
      const list = res?.data?.announcements || res?.announcements || [];
      setAnnouncements(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch sponsor announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await sponsorPortalService.markAnnouncementRead(id);
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  if (loading) return <Loader text="Loading organizer announcements..." />;

  const filtered = announcements.filter(a => {
    const matchesSearch = a.title?.toLowerCase().includes(search.toLowerCase()) ||
                          a.message?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organizer Announcements</h1>
        <p className="text-xs text-slate-500 mt-1">
          Official bulletins, schedule adjustments, key stage deadlines, and VIP logistics announcements from event organizers.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search bulletins by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'general', 'venue', 'session', 'alert'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                typeFilter === tab
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bulletins Feed */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No announcements found</p>
          <p className="text-xs text-slate-400">There are no bulletins matching your current filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ann) => (
            <div
              key={ann._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ann.type === 'alert'
                      ? 'bg-rose-100 text-rose-700'
                      : ann.type === 'venue'
                      ? 'bg-purple-100 text-purple-700'
                      : ann.type === 'session'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {ann.type || 'General'}
                  </span>
                  {ann.eventId?.title && (
                    <span className="text-[11px] font-bold text-slate-500 line-clamp-1">
                      • {ann.eventId.title}
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {formatDate(ann.createdAt)}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {ann.message}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Broadcasted by: {ann.createdBy?.name || 'Summit Organizing Committee'}
                </span>

                <button
                  onClick={() => handleMarkRead(ann._id)}
                  className="inline-flex items-center space-x-1 text-slate-500 hover:text-emerald-600 transition-colors text-xs font-semibold"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Acknowledge</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsorAnnouncements;
