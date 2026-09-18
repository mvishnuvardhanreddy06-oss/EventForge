import React, { useState, useEffect } from 'react';
import { sessionService, eventService, speakerService, venueService } from '../../services/api';
import SessionCard from '../../components/SessionCard';
import SessionForm from '../../components/SessionForm';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Plus, Calendar, AlertCircle } from 'lucide-react';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [speakers, setSpeakers] = useState([]);
  const [currentVenue, setCurrentVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [conflictError, setConflictError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'calendar'

  const fetchSessions = async (eventId) => {
    try {
      const res = await sessionService.getAll({ eventId });
      if (res.success) setSessions(res.data.sessions);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [evRes, spRes, vRes] = await Promise.all([
          eventService.getAll(),
          speakerService.getAll(),
          venueService.getAll()
        ]);
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const initialEvent = evRes.data.events[0];
          setSelectedEventId(initialEvent._id);
          if (initialEvent.venueId) {
            setCurrentVenue(initialEvent.venueId);
          } else if (vRes.success && vRes.data.venues.length > 0) {
            setCurrentVenue(vRes.data.venues[0]);
          }
          await fetchSessions(initialEvent._id);
        }
        if (spRes.success) setSpeakers(spRes.data.speakers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    const ev = events.find(x => x._id === eventId);
    if (ev?.venueId) setCurrentVenue(ev.venueId);
    fetchSessions(eventId);
  };

  const handleCreateSession = async (formData) => {
    setConflictError(null);
    try {
      const res = await sessionService.create({
        ...formData,
        eventId: selectedEventId,
        venueId: currentVenue?._id
      });
      if (res.success) {
        setShowModal(false);
        fetchSessions(selectedEventId);
      }
    } catch (err) {
      setConflictError(err.message);
    }
  };

  if (loading) return <Loader text="Loading session manager..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Session Scheduling & Conflicts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage keynote agendas with real-time room & speaker overlap protection.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Timeline
            </button>
          </div>
          <button
            onClick={() => {
              setConflictError(null);
              setShowModal(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Event Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-bold text-slate-700">Select Target Conference:</span>
        <select
          value={selectedEventId}
          onChange={handleEventChange}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title} ({ev.category})</option>
          ))}
        </select>
      </div>

      {viewMode === 'calendar' ? (
        <ScheduleCalendar sessions={sessions} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map(s => (
            <SessionCard key={s._id} session={s} />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule New Session">
        <SessionForm
          venue={currentVenue}
          speakers={speakers}
          conflictError={conflictError}
          onSubmit={handleCreateSession}
        />
      </Modal>
    </div>
  );
};

export default Sessions;
