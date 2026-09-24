import React, { useState, useEffect } from 'react';
import { attendeePortalService, eventService, sessionService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  MapPin,
  Mic,
  Calendar,
  Sparkles
} from 'lucide-react';

const Feedback = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');

  // 5-Star Ratings
  const [ratings, setRatings] = useState({
    eventRating: 5,
    sessionRating: 5,
    speakerRating: 5,
    venueRating: 5,
    overallRating: 5
  });

  const [likedAspects, setLikedAspects] = useState('');
  const [improvements, setImprovements] = useState('');
  const [comment, setComment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        let evList = [];
        // 1. Fetch available feedback events (registered events for the attendee)
        try {
          const availRes = await attendeePortalService.getAvailableFeedback();
          const availData = availRes?.data?.availableEvents || availRes?.availableEvents || availRes?.data || [];
          if (Array.isArray(availData) && availData.length > 0) {
            evList = availData
              .filter(a => a && (a.eventId || a._id))
              .map(a => ({
                _id: String(a.eventId?._id || a.eventId || a._id),
                title: a.title || a.eventId?.title || 'Conference Event',
                hasSubmitted: Boolean(a.hasSubmitted)
              }));
          }
        } catch (e) {
          console.warn('Could not fetch registered feedback events:', e);
        }

        // 2. Also fetch all published conference events to ensure full catalogue is available
        try {
          const evRes = await attendeePortalService.getEvents();
          const rawEvents = evRes?.data?.events || evRes?.events || evRes?.data?.data?.events || (Array.isArray(evRes?.data) ? evRes.data : []);
          if (Array.isArray(rawEvents) && rawEvents.length > 0) {
            const existingIds = new Set(evList.map(e => e._id));
            rawEvents.forEach(e => {
              const id = String(e._id || e.id || '');
              if (id && !existingIds.has(id)) {
                evList.push({
                  _id: id,
                  title: e.title || 'Conference Event',
                  hasSubmitted: false
                });
                existingIds.add(id);
              }
            });
          }
        } catch (e) {
          console.warn('Could not fetch all events for feedback:', e);
        }

        if (evList.length > 0) {
          setEvents(evList);
          const firstId = evList[0]._id;
          setSelectedEventId(firstId);
          loadSessionsForEvent(firstId);
        }
      } catch (err) {
        console.error('Failed to load events for feedback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const loadSessionsForEvent = async (eventId) => {
    if (!eventId) {
      setSessions([]);
      return;
    }
    try {
      const sRes = await sessionService.getAll({ eventId });
      const sList = sRes?.data?.sessions || sRes?.sessions || sRes?.data?.data?.sessions || (Array.isArray(sRes?.data) ? sRes.data : []);
      setSessions(Array.isArray(sList) ? sList : []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setSessions([]);
    }
  };

  const handleEventChange = (e) => {
    const evId = e.target.value;
    setSelectedEventId(evId);
    setSelectedSessionId('');
    loadSessionsForEvent(evId);
  };

  const setRatingValue = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        eventId: selectedEventId,
        sessionId: selectedSessionId || undefined,
        rating: ratings.overallRating,
        eventRating: ratings.eventRating,
        sessionRating: ratings.sessionRating,
        speakerRating: ratings.speakerRating,
        venueRating: ratings.venueRating,
        overallRating: ratings.overallRating,
        likedAspects,
        improvements,
        comment
      };

      const res = await attendeePortalService.submitFeedback(payload);
      if (res?.success || res?.data?.success) {
        setMessage({
          type: 'success',
          text: 'Thank you! Your verified conference review and ratings have been submitted.'
        });
        setComment('');
        setLikedAspects('');
        setImprovements('');
      } else {
        setMessage({ type: 'error', text: res?.message || res?.data?.message || 'Failed to submit review.' });
      }
    } catch (err) {
      const isDuplicate = err.status === 409 ||
        err.response?.status === 409 ||
        (err.message && err.message.toLowerCase().includes('already submitted'));

      if (isDuplicate) {
        setMessage({
          type: 'error',
          text: 'You have already submitted a review for this event session. Duplicate reviews are prevented.'
        });
      } else {
        setMessage({
          type: 'error',
          text: err.response?.data?.message || err.message || 'Error submitting evaluation.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarInput = (category, label) => {
    const val = ratings[category] || 5;
    return (
      <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-xs">
        <span className="font-bold text-slate-700">{label}</span>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRatingValue(category, star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= val ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                }`}
              />
            </button>
          ))}
          <span className="font-bold text-slate-800 ml-1.5 w-4 text-center">{val}</span>
        </div>
      </div>
    );
  };

  if (loading) return <Loader text="Loading conference review form..." />;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Conference & Session Evaluation</h1>
        <p className="text-xs text-slate-500 mt-1">
          Your authentic feedback directly helps organizers improve keynote speaker quality, workshop delivery, and venue amenities.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event & Session Picker */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Select Event & Session</h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Conference Event *</label>
              <select
                required
                value={selectedEventId}
                onChange={handleEventChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:outline-none"
              >
                {events.length === 0 ? (
                  <option value="">No events available</option>
                ) : (
                  events.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title} {ev.hasSubmitted ? '✓ (Submitted)' : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Specific Session (Optional)</label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="">Overall Conference Experience (All Sessions)</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title} ({s.speakerId?.name || 'Keynote'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 5-Star Ratings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">5-Star Performance Ratings</h3>
          <div className="space-y-1">
            {renderStarInput('eventRating', 'Overall Event Organization & Atmosphere')}
            {renderStarInput('sessionRating', 'Technical Depth & Clarity of Session')}
            {renderStarInput('speakerRating', 'Speaker Delivery & Engagement')}
            {renderStarInput('venueRating', 'Venue Facilities, Audio/Visual & Catering')}
            {renderStarInput('overallRating', 'Overall Experience Rating')}
          </div>
        </div>

        {/* Written Review */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Written Feedback & Suggestions</h3>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">What did you enjoy the most?</label>
            <input
              type="text"
              placeholder="e.g. The live architecture demo and interactive Q&A session..."
              value={likedAspects}
              onChange={(e) => setLikedAspects(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">What could be improved for next time?</label>
            <input
              type="text"
              placeholder="e.g. More hands-on lab time, earlier slide deck distribution..."
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">General Comments *</label>
            <textarea
              required
              rows={4}
              placeholder="Share any additional thoughts, feedback for the speakers, or topics you want to see next year..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting Evaluation...' : 'Submit Conference Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;
