import React, { useState } from 'react';
import { authService, registrationService } from '../../services/api';
import { Search, Users, Shield } from 'lucide-react';

const AttendeeSupport = () => {
  const [query, setQuery] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await authService.getUsers({ search: query, role: 'attendee' });
      if (res.success) setAttendees(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendee Information & Support</h1>
        <p className="text-xs text-slate-500 mt-0.5">Look up attendee credentials, registration statuses, and badge details.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search attendee by name or email..."
          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          Search
        </button>
      </form>

      <div className="space-y-3">
        {attendees.map(a => (
          <div key={a._id} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{a.name}</h4>
              <p className="text-xs text-slate-400">{a.email} • Phone: {a.phone || 'N/A'}</p>
              <div className="flex gap-1 mt-2">
                {(a.interests || []).map((int, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">{int}</span>
                ))}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Account
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeeSupport;
