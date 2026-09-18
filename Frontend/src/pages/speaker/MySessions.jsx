import React, { useState, useEffect } from 'react';
import { sessionService } from '../../services/api';
import SessionCard from '../../components/SessionCard';
import Loader from '../../components/Loader';

const MySessions = () => {
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

  if (loading) return <Loader text="Loading speaker sessions..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Speaking Sessions</h1>
        <p className="text-xs text-slate-500 mt-0.5">Schedule, breakout rooms, and audience capacities.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map(s => (
          <SessionCard key={s._id} session={s} />
        ))}
      </div>
    </div>
  );
};

export default MySessions;
