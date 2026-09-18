import React, { useState } from 'react';
import { Calendar, Check } from 'lucide-react';

const Availability = () => {
  const [days, setDays] = useState([
    { date: 'Oct 15, 2026', available: true, notes: 'Full day available' },
    { date: 'Oct 16, 2026', available: true, notes: 'Available 10 AM - 4 PM' },
    { date: 'Oct 17, 2026', available: false, notes: 'Departing early morning' }
  ]);

  const toggleDay = (idx) => {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, available: !d.available } : d));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Speaker Availability Calendar</h1>
        <p className="text-xs text-slate-500 mt-0.5">Indicate conference dates when you are available to present.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        {days.map((day, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">{day.date}</p>
                <p className="text-[11px] text-slate-400">{day.notes}</p>
              </div>
            </div>
            <button
              onClick={() => toggleDay(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                day.available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {day.available ? 'Available' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Availability;
