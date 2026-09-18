import React, { useState, useEffect } from 'react';
import { sessionService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SessionCard from '../../components/SessionCard';
import Loader from '../../components/Loader';
import { Mic, Clock, Calendar, CheckCircle } from 'lucide-react';

const SpeakerDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await sessionService.getAll();
        if (res.success) setSessions(res.data.sessions);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) return <Loader text="Loading speaker portal..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your speaking engagements, presentation materials, and schedule.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Assigned Sessions</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{sessions.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Speaking Status</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">Confirmed</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Materials Uploaded</p>
          <p className="text-2xl font-black text-slate-900 mt-1">Active</p>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">My Assigned Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.slice(0, 4).map(s => (
            <SessionCard key={s._id} session={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;
