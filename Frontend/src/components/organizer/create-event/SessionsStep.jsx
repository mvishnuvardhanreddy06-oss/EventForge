import React, { useState, useMemo } from 'react';
import { Plus, Clock, MapPin, Edit, Copy, Trash2, Calendar } from 'lucide-react';
import ConflictAlert from './ConflictAlert';
import SessionFormModal from './SessionFormModal';

const SessionsStep = ({ formData, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const sessions = formData.sessions || [
    {
      id: 'sess-1',
      title: 'Opening Keynote: The Future of Autonomous Systems',
      description: 'Visionary insights into decentralized infrastructure and next-gen AI automation.',
      date: '2026-09-24',
      startTime: '09:00',
      endTime: '10:00',
      room: 'Main Hall A',
      type: 'Keynote',
      capacity: 1200,
      status: 'Scheduled'
    },
    {
      id: 'sess-2',
      title: 'AI & Cloud Infrastructure at Scale',
      description: 'Technical deep-dive on multi-cloud reliability and observability telemetry.',
      date: '2026-09-24',
      startTime: '10:15',
      endTime: '11:15',
      room: 'Hall B',
      type: 'Workshop',
      capacity: 400,
      status: 'Scheduled'
    },
    {
      id: 'sess-3',
      title: 'Panel: Enterprise Cyber Defense in 2026',
      description: 'Executive CISO panel examining proactive security and zero trust posture.',
      date: '2026-09-24',
      startTime: '11:30',
      endTime: '12:30',
      room: 'Main Hall A',
      type: 'Panel',
      capacity: 800,
      status: 'Scheduled'
    }
  ];

  // Conflict Detection Engine
  const detectedConflict = useMemo(() => {
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const s1 = sessions[i];
        const s2 = sessions[j];
        if (s1.room === s2.room && s1.date === s2.date) {
          // Check time overlap: (StartA < EndB) and (EndA > StartB)
          if (s1.startTime < s2.endTime && s1.endTime > s2.startTime) {
            return {
              session1: s1,
              session2: s2,
              room: s1.room,
              time: `${s1.startTime} – ${s2.endTime}`
            };
          }
        }
      }
    }
    return null;
  }, [sessions]);

  const handleResolveConflict = () => {
    if (!detectedConflict) return;
    // Shift session2 start by 1 hour
    const updated = sessions.map((s) => {
      if (s.id === detectedConflict.session2.id) {
        return {
          ...s,
          startTime: '13:00',
          endTime: '14:00'
        };
      }
      return s;
    });
    onChange('sessions', updated);
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setEditingSession(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (sess, idx) => {
    setEditingIndex(idx);
    setEditingSession(sess);
    setModalOpen(true);
  };

  const handleDuplicate = (sess) => {
    const copy = {
      ...sess,
      id: `sess-${Date.now()}`,
      title: `Copy of ${sess.title}`,
      startTime: '14:30',
      endTime: '15:30'
    };
    onChange('sessions', [...sessions, copy]);
  };

  const handleRemove = (idx) => {
    onChange('sessions', sessions.filter((_, i) => i !== idx));
  };

  const handleSaveSession = (savedSession) => {
    if (editingIndex !== null) {
      const updated = [...sessions];
      updated[editingIndex] = savedSession;
      onChange('sessions', updated);
    } else {
      const newSess = { ...savedSession, id: `sess-${Date.now()}` };
      onChange('sessions', [...sessions, newSess]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Event Sessions & Agenda
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Build your event agenda by adding sessions, talks, panel discussions, and workshops.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Session</span>
        </button>
      </div>

      {/* Conflict detection alert banner */}
      <ConflictAlert
        conflict={detectedConflict}
        onResolve={handleResolveConflict}
      />

      {/* Sessions Grid */}
      <div className="space-y-3 text-xs">
        {sessions.map((sess, idx) => (
          <div
            key={sess.id || idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">
                  {sess.type || 'Keynote'}
                </span>
                <span className="inline-flex items-center space-x-1 text-slate-500 font-mono text-[11px] font-semibold">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{sess.startTime} – {sess.endTime}</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-slate-500 text-[11px] font-semibold">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{sess.room}</span>
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                {sess.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">{sess.description}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleOpenEdit(sess, idx)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors shadow-2xs"
                title="Edit session"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDuplicate(sess)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                title="Duplicate session"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors shadow-2xs"
                title="Remove session"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <SessionFormModal
        isOpen={modalOpen}
        session={editingSession}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSession}
      />
    </div>
  );
};

export default SessionsStep;
