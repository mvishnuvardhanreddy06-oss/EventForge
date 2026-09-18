import React, { useState, useEffect } from 'react';
import { feedbackService, eventService } from '../../services/api';
import Loader from '../../components/Loader';
import { Star, MessageSquare } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async (eventId) => {
    try {
      const [listRes, statsRes] = await Promise.all([
        feedbackService.getByEvent({ eventId }),
        feedbackService.getStats(eventId)
      ]);
      if (listRes.success) setFeedbacks(listRes.data.feedbackList);
      if (statsRes.success) setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const id = evRes.data.events[0]._id;
          setSelectedEventId(id);
          await fetchFeedback(id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    fetchFeedback(id);
  };

  if (loading) return <Loader text="Loading attendee feedback..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendee Feedback & Ratings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Post-event satisfaction scores and qualitative session evaluations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-bold text-slate-700">Select Event:</span>
        <select
          value={selectedEventId}
          onChange={handleEventChange}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Average Score</p>
          <div className="flex items-center space-x-2 mt-1">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span className="text-2xl font-black text-slate-900">{stats?.averageRating || '5.0'}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Reviews</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.total || 0}</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Satisfaction Rate</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">96%</p>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {feedbacks.map((f) => (
          <div key={f._id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400">
                  {[...Array(f.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{f.sessionId?.title || 'General Conference'}</span>
              </div>
              <span className="text-[10px] text-slate-400">{formatDateTime(f.createdAt)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">"{f.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
