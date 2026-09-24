import React, { useState, useEffect, useMemo } from 'react';
import { eventService, sessionService, attendanceService } from '../../services/api';
import Loader from '../../components/Loader';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  UserCheck, 
  UserX, 
  RefreshCw,
  Sparkles,
  Ticket
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const SessionAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  
  const [feedback, setFeedback] = useState(null);

  // Helper to format session dropdown option
  const formatSessionLabel = (s) => {
    const parts = [s.title];
    if (s.speakerId?.name) {
      parts.push(`Speaker: ${s.speakerId.name}`);
    }
    if (s.startTime && s.endTime) {
      const st = new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const et = new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      parts.push(`${st} – ${et}`);
    }
    if (s.roomName) {
      parts.push(`Room: ${s.roomName}`);
    }
    return parts.join(' • ');
  };

  // 1. Initial Load: Fetch Staff-Accessible Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes.success && evRes.data.events && evRes.data.events.length > 0) {
          const staffEvents = evRes.data.events;
          setEvents(staffEvents);
          const firstEvId = staffEvents[0]._id;
          setSelectedEventId(firstEvId);
          await loadSessionsForEvent(firstEvId);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setFeedback({ type: 'error', message: err.response?.data?.message || err.message });
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Load Sessions for an Event
  const loadSessionsForEvent = async (eventId) => {
    setLoadingSessions(true);
    setSessions([]);
    setSelectedSessionId('');
    setAttendees([]);
    setSessionData(null);
    setFeedback(null);

    try {
      const sessRes = await sessionService.getAll({ eventId });
      if (sessRes.success && sessRes.data.sessions && sessRes.data.sessions.length > 0) {
        const eventSessions = sessRes.data.sessions;
        setSessions(eventSessions);
        const firstSessId = eventSessions[0]._id;
        setSelectedSessionId(firstSessId);
        await loadAttendanceForSession(firstSessId);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setFeedback({ type: 'error', message: err.response?.data?.message || err.message });
    } finally {
      setLoadingSessions(false);
    }
  };

  // 3. Load Attendance Data for a Session
  const loadAttendanceForSession = async (sessionId) => {
    if (!sessionId) return;
    setLoadingAttendance(true);
    setFeedback(null);
    try {
      const res = await attendanceService.getSessionAttendance(sessionId);
      if (res.success && res.data) {
        setSessionData(res.data.session);
        setAttendees(res.data.registeredAttendees || []);
      }
    } catch (err) {
      console.error('Failed to load session attendance:', err);
      setFeedback({ type: 'error', message: err.response?.data?.message || err.message });
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Event Selection Change
  const handleEventChange = async (e) => {
    const newEventId = e.target.value;
    setSelectedEventId(newEventId);
    await loadSessionsForEvent(newEventId);
  };

  // Session Selection Change
  const handleSessionChange = async (e) => {
    const newSessionId = e.target.value;
    setSelectedSessionId(newSessionId);
    await loadAttendanceForSession(newSessionId);
  };

  // Mark Attendance
  const handleMarkAttendance = async (attendeeId, attendeeName) => {
    if (!selectedSessionId || !attendeeId) return;
    setProcessingId(attendeeId);
    setFeedback(null);

    try {
      const res = await attendanceService.recordSessionAttendance({
        sessionId: selectedSessionId,
        attendeeId,
        method: 'manual'
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Attendance marked successfully for ${attendeeName}.`
        });
        // Refresh session attendance list
        await loadAttendanceForSession(selectedSessionId);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to record attendance.'
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Unmark Attendance
  const handleUnmarkAttendance = async (attendeeId, attendeeName) => {
    if (!selectedSessionId || !attendeeId) return;
    setProcessingId(attendeeId);
    setFeedback(null);

    try {
      const res = await attendanceService.unmarkSessionAttendance(selectedSessionId, attendeeId);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Attendance unmarked for ${attendeeName}.`
        });
        await loadAttendanceForSession(selectedSessionId);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to unmark attendance.'
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered Attendees by search query
  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) return attendees;
    const q = searchQuery.toLowerCase().trim();
    return attendees.filter(a => 
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.registrationNumber && a.registrationNumber.toLowerCase().includes(q))
    );
  }, [attendees, searchQuery]);

  // Metric Computations
  const totalRegistered = attendees.length;
  const totalPresent = attendees.filter(a => a.isCheckedIn).length;
  const attendanceRate = totalRegistered > 0 ? Math.round((totalPresent / totalRegistered) * 100) : 0;

  if (loadingInitial) return <Loader text="Loading session attendance station..." />;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Session Attendance Terminal</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select an assigned event and session to manage attendee check-ins in real time.
        </p>
      </div>

      {/* Selectors Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        {/* 1. Select Event Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Select Assigned Event
          </label>
          <select
            value={selectedEventId}
            onChange={handleEventChange}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors"
          >
            {events.length === 0 ? (
              <option value="">No events assigned to your account</option>
            ) : (
              events.map(ev => (
                <option key={ev._id} value={ev._id}>
                  {ev.title} {ev.category ? `(${ev.category})` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        {/* 2. Select Session Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Select Session
          </label>
          {loadingSessions ? (
            <div className="flex items-center space-x-2 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Fetching sessions...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center">
              <AlertCircle className="w-4 h-4 mr-1.5 shrink-0 text-amber-600" />
              <span>No sessions available for this event.</span>
            </div>
          ) : (
            <select
              value={selectedSessionId}
              onChange={handleSessionChange}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors"
            >
              {sessions.map(s => (
                <option key={s._id} value={s._id}>
                  {formatSessionLabel(s)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center space-x-3 text-xs font-semibold ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Selected Session Information & Metrics */}
      {sessionData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 uppercase tracking-wider mb-2">
              Active Session Details
            </span>
            <h3 className="text-base font-bold text-white leading-tight">{sessionData.title}</h3>
            <div className="mt-3 space-y-1 text-xs text-slate-300">
              {sessionData.speakerId?.name && (
                <div className="flex items-center">
                  <span className="text-slate-400 mr-2">Speaker:</span>
                  <span className="font-semibold text-white">{sessionData.speakerId.name}</span>
                  {sessionData.speakerId.company && <span className="text-slate-400 ml-1">({sessionData.speakerId.company})</span>}
                </div>
              )}
              {sessionData.startTime && (
                <div className="flex items-center">
                  <span className="text-slate-400 mr-2">Time:</span>
                  <span>
                    {new Date(sessionData.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(sessionData.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              {sessionData.roomName && (
                <div className="flex items-center">
                  <span className="text-slate-400 mr-2">Room / Stage:</span>
                  <span className="text-white font-medium">{sessionData.roomName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-center items-center text-center shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Registered</span>
            <span className="text-3xl font-black text-slate-900 mt-1">{totalRegistered}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Total event attendees</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-center items-center text-center shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Checked In</span>
            <span className="text-3xl font-black text-emerald-600 mt-1">{totalPresent}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">{attendanceRate}% Attendance Rate</span>
          </div>
        </div>
      )}

      {/* Attendees Table Section */}
      {selectedSessionId && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Session Roster & Attendance Log
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                {filteredAttendees.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search attendee by name, email, reg #..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Table Content */}
          {loadingAttendance ? (
            <div className="py-12 flex justify-center items-center text-slate-400 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
              Loading attendee session roster...
            </div>
          ) : filteredAttendees.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              {searchQuery ? `No attendees matching "${searchQuery}".` : 'No confirmed attendees registered for this event yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Attendee</th>
                    <th className="py-3 px-4">Ticket & Reg #</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Check-in Time</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredAttendees.map(att => (
                    <tr key={att.attendeeId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{att.name}</div>
                        <div className="text-[11px] text-slate-400">{att.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{att.ticketName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{att.registrationNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {att.isCheckedIn ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-500">
                            Not Checked In
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {att.checkedInAt ? (
                          <div>
                            <div>{formatDateTime(att.checkedInAt)}</div>
                            {att.checkedInBy && <div className="text-[10px] text-slate-400">By {att.checkedInBy}</div>}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {att.isCheckedIn ? (
                          <button
                            onClick={() => handleUnmarkAttendance(att.attendeeId, att.name)}
                            disabled={processingId === att.attendeeId}
                            className="inline-flex items-center px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-rose-600 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            {processingId === att.attendeeId ? (
                              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <UserX className="w-3 h-3 mr-1" />
                            )}
                            Unmark
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAttendance(att.attendeeId, att.name)}
                            disabled={processingId === att.attendeeId}
                            className="inline-flex items-center px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-colors disabled:opacity-50"
                          >
                            {processingId === att.attendeeId ? (
                              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <UserCheck className="w-3 h-3 mr-1" />
                            )}
                            Mark Present
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionAttendance;
