import React, { useState, useEffect } from 'react';
import { attendeePortalService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Mic,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const MySchedule = () => {
  const [scheduleData, setScheduleData] = useState({ schedule: [], availableSessions: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my_schedule');

  // Conflict modal
  const [conflictModalData, setConflictModalData] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchSchedule = async () => {
    try {
      const res = await attendeePortalService.getSchedule();
      if (res.data?.success) {
        setScheduleData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Conflict detection helper:
  // s1.startTime < s2.endTime && s2.startTime < s1.endTime
  const checkConflict = (targetSession) => {
    const targetStart = new Date(targetSession.startTime).getTime();
    const targetEnd = new Date(targetSession.endTime).getTime();

    for (const s of scheduleData.schedule) {
      const sStart = new Date(s.startTime).getTime();
      const sEnd = new Date(s.endTime).getTime();

      if (targetStart < sEnd && sStart < targetEnd) {
        return s; // Returns conflicting session
      }
    }
    return null;
  };

  const handleAddClick = (session) => {
    const conflict = checkConflict(session);
    if (conflict) {
      setConflictModalData({
        targetSession: session,
        conflictingSession: conflict
      });
    } else {
      executeAdd(session._id);
    }
  };

  const executeAdd = async (sessionId) => {
    setActionInProgress(true);
    try {
      const res = await attendeePortalService.addToSchedule(sessionId);
      if (res.data?.success) {
        setConflictModalData(null);
        await fetchSchedule();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to add session');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRemove = async (sessionId) => {
    setActionInProgress(true);
    try {
      const res = await attendeePortalService.removeFromSchedule(sessionId);
      if (res.data?.success) {
        await fetchSchedule();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to remove session');
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading) return <Loader text="Building your conference agenda..." />;

  const { schedule = [], availableSessions = [] } = scheduleData;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personal Conference Agenda</h1>
        <p className="text-xs text-slate-500 mt-1">
          Curate your technical sessions, keynotes, and breakout workshops with automated schedule conflict detection.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('my_schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'my_schedule'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>My Booked Agenda ({schedule.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'available'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Available Sessions to Add ({availableSessions.length})</span>
        </button>
      </div>

      {/* Tab 1: My Schedule */}
      {activeTab === 'my_schedule' && (
        <div className="space-y-4">
          {schedule.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Your agenda is currently empty</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Switch to the "Available Sessions" tab to choose sessions, keynotes, and workshops to attend.
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Explore Sessions
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {schedule.map((session) => (
                <div
                  key={session._id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                        {session.category || 'Session'}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>{formatDate(session.startTime)} — {formatDate(session.endTime)}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{session.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{session.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      {session.speakerId && (
                        <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
                          <Mic className="w-3.5 h-3.5 text-purple-600" />
                          <span>{session.speakerId.name}</span>
                          <span className="text-slate-400 font-normal">({session.speakerId.designation || 'Speaker'})</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{session.roomName || 'Breakout Hall'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(session._id)}
                    disabled={actionInProgress}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center space-x-1.5 shrink-0 self-start md:self-auto disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Available Sessions */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableSessions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">All available sessions are already in your agenda!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                        {session.category || 'General'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatDate(session.startTime)}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{session.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{session.description}</p>

                    <div className="pt-1 text-xs text-slate-500 space-y-1">
                      {session.speakerId && (
                        <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                          <Mic className="w-3.5 h-3.5 text-purple-600" />
                          <span>{session.speakerId.name}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span>{session.roomName || 'Plenary Room'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleAddClick(session)}
                      disabled={actionInProgress}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to My Agenda</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conflict Warning Modal */}
      {conflictModalData && (
        <Modal
          isOpen={!!conflictModalData}
          onClose={() => setConflictModalData(null)}
          title="Schedule Time Conflict Detected"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Overlapping Session Schedule</span>
              </div>
              <p className="leading-relaxed">
                The session you selected overlaps in time with another session already booked on your personal agenda.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Session</span>
                <p className="font-bold text-slate-900 mt-0.5">{conflictModalData.targetSession.title}</p>
                <p className="text-slate-500">
                  {formatDate(conflictModalData.targetSession.startTime)} — {formatDate(conflictModalData.targetSession.endTime)}
                </p>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-600 uppercase">Existing Conflicting Session</span>
                <p className="font-bold text-rose-950 mt-0.5">{conflictModalData.conflictingSession.title}</p>
                <p className="text-rose-700">
                  {formatDate(conflictModalData.conflictingSession.startTime)} — {formatDate(conflictModalData.conflictingSession.endTime)}
                </p>
              </div>
            </div>

            <p className="text-slate-500 text-[11px]">
              Would you like to proceed and add this session to your agenda regardless?
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConflictModalData(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionInProgress}
                onClick={() => executeAdd(conflictModalData.targetSession._id)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-2xs disabled:opacity-50"
              >
                Add Anyway
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MySchedule;
