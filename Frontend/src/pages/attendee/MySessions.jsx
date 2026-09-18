import React, { useState, useEffect } from 'react';
import { registrationService } from '../../services/api';
import SessionCard from '../../components/SessionCard';
import Loader from '../../components/Loader';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const res = await registrationService.getAll();
        if (res.success) {
          const selected = [];
          res.data.registrations.forEach(r => {
            if (Array.isArray(r.selectedSessions)) selected.push(...r.selectedSessions);
          });
          setSessions(selected);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMySessions();
  }, []);

  if (loading) return <Loader text="Loading your conference itinerary..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Conference Itinerary</h1>
        <p className="text-xs text-slate-500 mt-0.5">Personalized agenda of scheduled keynotes and workshops.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-xs text-slate-400">
          No sessions added to your itinerary yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((s, i) => (
            <SessionCard key={i} session={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;
