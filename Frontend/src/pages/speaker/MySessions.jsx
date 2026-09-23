import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { speakerPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Clock,
  Calendar,
  MapPin,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  Check,
  Eye
} from 'lucide-react';

const MySessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmingId, setConfirmingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await speakerPortalService.getSessions({ filter });
      if (res.success && res.data) {
        setSessions(res.data.sessions || []);
      }
    } catch (err) {
      console.error('Failed to load speaker sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSession = async (sessionId) => {
    try {
      setConfirmingId(sessionId);
      const res = await speakerPortalService.confirmSession(sessionId);
      if (res.success) {
        setToastMessage('Session participation confirmed successfully!');
        setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, speakerConfirmationStatus: 'Confirmed', status: 'Confirmed' } : s));
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to confirm session.');
    } finally {
      setConfirmingId(null);
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.eventTitle && s.eventTitle.toLowerCase().includes(q)) ||
      (s.room && s.room.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage your upcoming and completed speaking sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/speaker/materials"
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Slide Deck</span>
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions by title, event, or room..."
            className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'upcoming', 'today', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                filter === f
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* SESSIONS LIST */}
      {loading ? (
        <Loader text="Loading your speaking sessions..." />
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Sessions Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No speaking engagements matched your search criteria. Check back once session agendas are finalized.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div
              key={session._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* SESSION BRIEF */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 uppercase">
                    {session.category || 'Keynote'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      session.status === 'Live'
                        ? 'bg-purple-600 text-white animate-pulse'
                        : session.status === 'Completed'
                        ? 'bg-slate-100 text-slate-700'
                        : session.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    ● {session.status}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      session.presentationStatus === 'Uploaded' || session.presentationStatus === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}
                  >
                    Presentation: {session.presentationStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {session.title}
                </h3>
                <p className="text-xs text-purple-700 font-semibold">{session.eventTitle}</p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{session.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{session.time}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{session.room} ({session.venue})</span>
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {session.speakerConfirmationStatus === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => handleConfirmSession(session._id)}
                    disabled={confirmingId === session._id}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors inline-flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{confirmingId === session._id ? 'Confirming...' : 'Confirm'}</span>
                  </button>
                )}

                <Link
                  to={`/speaker/sessions/${session._id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors inline-flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Details</span>
                </Link>

                <Link
                  to={`/speaker/materials?sessionId=${session._id}`}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors inline-flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Presentation</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;
