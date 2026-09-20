import React, { useState, useMemo } from 'react';
import {
  X,
  Layers,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Check
} from 'lucide-react';

const MOCK_AVAILABLE_SESSIONS = [
  {
    id: 'ses-101',
    title: 'Opening Keynote: Next-Gen Autonomous AI Systems',
    type: 'Keynote',
    date: '2026-09-24',
    dateFormatted: 'Sep 24, 2026',
    startTime: '09:00',
    endTime: '10:15',
    time: '09:00 AM – 10:15 AM',
    room: 'Grand Ballroom A',
    event: 'Global Tech Leadership Summit 2026'
  },
  {
    id: 'ses-102',
    title: 'Cloud Security at Scale',
    type: 'Talk',
    date: '2026-09-24',
    dateFormatted: 'Sep 24, 2026',
    startTime: '10:00',
    endTime: '11:00',
    time: '10:00 AM – 11:00 AM',
    room: 'Hall B',
    event: 'Global Tech Leadership Summit 2026'
  },
  {
    id: 'ses-103',
    title: 'Panel: Security in an Agentic AI World',
    type: 'Panel',
    date: '2026-09-24',
    dateFormatted: 'Sep 24, 2026',
    startTime: '13:00',
    endTime: '14:30',
    time: '01:00 PM – 02:30 PM',
    room: 'Grand Ballroom B',
    event: 'Global Tech Leadership Summit 2026'
  },
  {
    id: 'ses-104',
    title: 'Hands-on Workshop: Scalable Microservices',
    type: 'Workshop',
    date: '2026-09-25',
    dateFormatted: 'Sep 25, 2026',
    startTime: '10:00',
    endTime: '12:30',
    time: '10:00 AM – 12:30 PM',
    room: 'Workshop Lab 1',
    event: 'Global Tech Leadership Summit 2026'
  },
  {
    id: 'ses-105',
    title: 'Fireside Chat: Executive Leadership in Uncertainty',
    type: 'Keynote',
    date: '2026-09-25',
    dateFormatted: 'Sep 25, 2026',
    startTime: '14:00',
    endTime: '15:15',
    time: '02:00 PM – 03:15 PM',
    room: 'Executive Pavilion',
    event: 'Global Tech Leadership Summit 2026'
  }
];

const toMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const clean = timeStr.replace(/[^0-9:]/g, '');
  const [h, m] = clean.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

const AssignSessionModal = ({
  isOpen,
  onClose,
  speaker,
  onAssign,
  sessions = MOCK_AVAILABLE_SESSIONS
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');
  const [sessionRole, setSessionRole] = useState('Keynote Presenter');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.room.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
      );
    });
  }, [sessions, searchQuery]);

  const selectedSession = useMemo(() => {
    return sessions.find((s) => s.id === selectedSessionId);
  }, [sessions, selectedSessionId]);

  // Conflict Detection
  const conflict = useMemo(() => {
    if (!speaker || !selectedSession) return null;
    const speakerSessions = speaker.sessions || speaker.assignedSessions || [];

    for (const existing of speakerSessions) {
      if (existing.id === selectedSession.id) {
        return {
          type: 'already_assigned',
          title: existing.title,
          time: existing.time,
          message: `${speaker.name} is already assigned to this session.`
        };
      }

      // Check overlap
      const startA = toMinutes(existing.startTime || '10:00');
      const endA = toMinutes(existing.endTime || '11:00');
      const startB = toMinutes(selectedSession.startTime || '10:00');
      const endB = toMinutes(selectedSession.endTime || '11:00');

      if (startA < endB && endA > startB) {
        return {
          type: 'schedule_overlap',
          title: existing.title,
          time: existing.time || '10:00 AM – 11:00 AM',
          message: `${speaker.name} is already assigned to: ${existing.title} (${existing.time || '10:00 AM – 11:00 AM'})`
        };
      }
    }

    // Availability Check
    if (speaker.availability === 'unavailable') {
      return {
        type: 'unavailable',
        message: 'Speaker unavailable during this session.'
      };
    }

    return null;
  }, [speaker, selectedSession]);

  if (!isOpen || !speaker) return null;

  const handleConfirm = () => {
    if (conflict) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAssign(speaker.id || speaker._id, {
        session: selectedSession,
        role: sessionRole
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Assign Session
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Speaker: <strong className="text-slate-800">{speaker.name}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-xs">
          {/* Exact Prompt Conflict Warning Banner */}
          {conflict && conflict.type === 'schedule_overlap' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 font-bold text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠ Speaker Schedule Conflict</span>
              </div>
              <p className="text-xs">
                <strong>{speaker.name}</strong> is already assigned to:
              </p>
              <p className="font-bold text-slate-900 bg-white/70 p-2 rounded-lg border border-amber-200">
                {conflict.title}
                <br />
                <span className="text-[11px] font-medium text-slate-600">{conflict.time}</span>
              </p>
              <p className="text-xs text-amber-800">
                Choose another session or adjust the schedule.
              </p>
            </div>
          )}

          {conflict && conflict.type === 'unavailable' && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>⚠ Speaker unavailable during this session.</span>
            </div>
          )}

          {/* Session Details Box */}
          {selectedSession && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Session Information
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedSession.type}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedSession.title}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400">Date: </span>
                  <strong className="text-slate-800">{selectedSession.dateFormatted}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Time: </span>
                  <strong className="text-slate-800">{selectedSession.time}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Room: </span>
                  <strong className="text-slate-800">{selectedSession.room}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Event: </span>
                  <strong className="text-slate-800">{selectedSession.event}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Session Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Select Session
            </label>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {filteredSessions.map((session) => {
                const isSelected = selectedSessionId === session.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-900 text-xs truncate">
                          {session.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {session.dateFormatted} • {session.time} • {session.room}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedSession || conflict || isSubmitting}
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            {isSubmitting ? (
              <span>Assigning...</span>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Assignment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignSessionModal;
