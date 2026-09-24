import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendeePortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Clock,
  Calendar,
  MapPin,
  Mic,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await attendeePortalService.getSessions();
        const list = res?.data?.sessions || res?.sessions || res?.data?.data?.sessions || [];
        setSessions(list);
      } catch (err) {
        console.error('Failed to load attendee sessions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) return <Loader text="Loading your session attendance tracking..." />;

  const filtered = sessions.filter(s => {
    if (filter === 'attended') return s.attended === true;
    if (filter === 'upcoming') return s.attended === false;
    return true;
  });

  const totalCount = sessions.length;
  const attendedCount = sessions.filter(s => s.attended).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Session Attendance & Materials</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track verified session check-ins, download presentation slides, and submit post-session feedback.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Sessions</span>
          <p className="text-xl font-black text-slate-900 mt-1">{totalCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Attendance Verified</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{attendedCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
          <p className="text-xl font-black text-purple-600 mt-1">
            {totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: `All Sessions (${totalCount})` },
          { key: 'attended', label: `✓ Attended (${attendedCount})` },
          { key: 'upcoming', label: `Not Yet Attended (${totalCount - attendedCount})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab.key
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Clock className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No sessions match this filter</p>
          <p className="text-xs text-slate-400">Head to My Schedule to add conference sessions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const s = item.session || item;
            const speaker = s.speakerId;
            const isAttended = item.attended;

            return (
              <div
                key={s._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                      {s.category || 'General'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      isAttended
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isAttended ? '✓ Attended' : 'Not Attended'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{s.description}</p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(s.startTime)} — {formatDate(s.endTime)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{s.roomName || 'Breakout Hall'}</span>
                    </div>

                    {speaker && (
                      <div className="flex items-center space-x-2 pt-1 text-slate-800">
                        <Mic className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="font-semibold">{speaker.name}</span>
                        <span className="text-slate-400 font-normal">({speaker.company || 'Keynote'})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {s.materials && s.materials.length > 0 ? (
                    <a
                      href={s.materials[0].fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-blue-600 hover:underline font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Slide Deck (PDF)</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Slides will be uploaded post-event</span>
                  )}

                  <Link
                    to="/attendee/feedback"
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Rate Session</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MySessions;
