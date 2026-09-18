import React, { useState, useEffect } from 'react';
import { eventService, sessionService, attendanceService } from '../../services/api';
import Loader from '../../components/Loader';
import AttendanceTable from '../../components/AttendanceTable';

const SessionAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [attendeeIdInput, setAttendeeIdInput] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const firstEventId = evRes.data.events[0]._id;
          setSelectedEventId(firstEventId);
          const sessRes = await sessionService.getAll({ eventId: firstEventId });
          if (sessRes.success && sessRes.data.sessions.length > 0) {
            setSessions(sessRes.data.sessions);
            setSelectedSessionId(sessRes.data.sessions[0]._id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await attendanceService.recordSessionAttendance({
        sessionId: selectedSessionId,
        attendeeId: attendeeIdInput,
        method: 'manual'
      });
      if (res.success) {
        alert('Session attendance marked!');
        setAttendeeIdInput('');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading session attendance station..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Session Attendance Tracking</h1>
        <p className="text-xs text-slate-500 mt-0.5">Log attendance for specific room sessions and workshops.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Select Event</label>
          <select
            value={selectedEventId}
            onChange={async (e) => {
              setSelectedEventId(e.target.value);
              const res = await sessionService.getAll({ eventId: e.target.value });
              if (res.success) {
                setSessions(res.data.sessions);
                if (res.data.sessions.length > 0) setSelectedSessionId(res.data.sessions[0]._id);
              }
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
          >
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Select Session</label>
          <select
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
          >
            {sessions.map(s => (
              <option key={s._id} value={s._id}>{s.title} ({s.roomName})</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SessionAttendance;
