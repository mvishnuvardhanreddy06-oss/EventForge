import React, { useState, useEffect } from 'react';
import { eventService, sessionService, feedbackService } from '../../services/api';
import Loader from '../../components/Loader';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';

const Feedback = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const id = evRes.data.events[0]._id;
          setSelectedEventId(id);
          const sRes = await sessionService.getAll({ eventId: id });
          if (sRes.success) setSessions(sRes.data.sessions);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await feedbackService.submit({
        eventId: selectedEventId,
        sessionId: selectedSessionId || null,
        rating,
        comment
      });
      if (res.success) {
        setSubmitted(true);
        setComment('');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading review form..." />;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Session Evaluation & Feedback</h1>
        <p className="text-xs text-slate-500 mt-0.5">Help us improve speaker content and technical masterclasses.</p>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-bold">Thank you! Your feedback has been recorded.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Conference</label>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none font-medium"
          >
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Attended Session</label>
          <select
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
          >
            <option value="">General Conference Experience</option>
            {sessions.map(s => (
              <option key={s._id} value={s._id}>{s.title} ({s.roomName})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Rating (1 to 5 Stars)</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star className={`w-6 h-6 ${val <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Comments & Key Takeaways</label>
          <textarea
            rows="4"
            required
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
            placeholder="What worked well? What could be improved for next time?"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          Submit Evaluation
        </button>
      </form>
    </div>
  );
};

export default Feedback;
