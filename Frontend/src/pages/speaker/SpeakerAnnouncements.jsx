import React, { useState, useEffect } from 'react';
import { speakerPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Megaphone,
  Bell,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Calendar,
  UserCheck,
  Check,
  RefreshCw,
  Sparkles,
  Inbox,
  Flame
} from 'lucide-react';

const SpeakerAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // all | unread | important | event_updates
  const [searchQuery, setSearchQuery] = useState('');
  const [markingId, setMarkingId] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, [filterTab]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const params = filterTab !== 'all' ? { filter: filterTab } : {};
      const res = await speakerPortalService.getAnnouncements(params);
      if (res.success && res.data) {
        setAnnouncements(res.data.announcements || []);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      setMarkingId(id);
      const res = await speakerPortalService.markAnnouncementRead(id);
      if (res.success) {
        setAnnouncements(prev =>
          prev.map(a => (a._id === id ? { ...a, isRead: true } : a))
        );
        setSuccessToast('Announcement marked as read.');
        setTimeout(() => setSuccessToast(''), 3000);
      }
    } catch (err) {
      console.error('Failed to mark read:', err);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadItems = announcements.filter(a => !a.isRead);
    for (const item of unreadItems) {
      try {
        await speakerPortalService.markAnnouncementRead(item._id);
      } catch (e) {
        // continue
      }
    }
    setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));
    setSuccessToast('All announcements marked as read.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Filtered by search query
  const filtered = announcements.filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.message?.toLowerCase().includes(q) ||
      a.eventTitle?.toLowerCase().includes(q) ||
      a.sender?.toLowerCase().includes(q)
    );
  });

  const totalCount = announcements.length;
  const unreadCount = announcements.filter(a => !a.isRead).length;
  const urgentCount = announcements.filter(a => a.priority === 'urgent' || a.priority === 'high').length;

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p === 'urgent') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
          <Flame className="w-3 h-3 text-rose-600" />
          <span>Urgent</span>
        </span>
      );
    }
    if (p === 'high') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>High Priority</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
        <Info className="w-3 h-3 text-blue-500" />
        <span>Update</span>
      </span>
    );
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Announcements & Broadcasts
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-purple-600 text-white text-xs font-black rounded-full shadow-2xs">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Live organizer broadcasts, schedule change alerts, and logistics announcements.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors inline-flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5 text-purple-600" />
              <span>Mark All as Read</span>
            </button>
          )}
          <button
            type="button"
            onClick={loadAnnouncements}
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-2xs transition-colors"
            title="Refresh announcements"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOAST */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* METRIC STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Bulletins</p>
            <p className="text-xl font-black text-slate-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unread Alerts</p>
            <p className="text-xl font-black text-indigo-600">{unreadCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Urgent / High Priority</p>
            <p className="text-xl font-black text-rose-600">{urgentCount}</p>
          </div>
        </div>
      </div>

      {/* CONTROLS: TABS & SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* TABS */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Bulletins' },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'important', label: 'Important', count: urgentCount },
            { id: 'event_updates', label: 'Event & Venue Updates' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors inline-flex items-center space-x-1.5 ${
                filterTab === tab.id
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    filterTab === tab.id ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bulletins or events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
          />
        </div>
      </div>

      {/* ANNOUNCEMENT FEED */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Loader size="md" text="Loading announcements..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Announcements Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No announcements match "${searchQuery}". Try adjusting your keywords.`
              : 'You have no pending announcements in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs relative overflow-hidden ${
                item.isRead ? 'border-slate-200/80' : 'border-purple-300 ring-1 ring-purple-100'
              }`}
            >
              {/* UNREAD SIDE ACCENT */}
              {!item.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-600" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  {/* METADATA CHIPS */}
                  <div className="flex flex-wrap items-center gap-2">
                    {getPriorityBadge(item.priority)}
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.eventTitle}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(item.publishedAt)}</span>
                    </span>
                  </div>

                  {/* TITLE */}
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-base font-bold ${item.isRead ? 'text-slate-800' : 'text-slate-900 font-black'}`}>
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" title="Unread" />
                    )}
                  </div>

                  {/* MESSAGE BODY */}
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {item.message}
                  </p>

                  {/* SENDER INFO */}
                  <div className="flex items-center space-x-1.5 pt-1 text-[11px] text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Broadcast by:</span>
                    <span className="font-bold text-slate-700">{item.sender}</span>
                  </div>
                </div>

                {/* ACTION: MARK READ */}
                <div className="sm:self-center shrink-0">
                  {item.isRead ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Read</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item._id)}
                      disabled={markingId === item._id}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{markingId === item._id ? 'Marking...' : 'Mark as Read'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpeakerAnnouncements;
