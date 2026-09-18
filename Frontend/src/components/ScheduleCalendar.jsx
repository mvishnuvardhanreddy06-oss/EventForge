import React from 'react';
import { formatTime } from '../utils/formatters';

const ScheduleCalendar = ({ sessions = [] }) => {
  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
        No sessions scheduled yet.
      </div>
    );
  }

  // Group sessions by date
  const groupedByDate = sessions.reduce((acc, s) => {
    const dateKey = new Date(s.startTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([dateLabel, daySessions]) => (
        <div key={dateLabel} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            {dateLabel}
          </h4>
          <div className="space-y-3">
            {daySessions.map((session) => (
              <div key={session._id} className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold shrink-0 text-center">
                    {formatTime(session.startTime)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight mb-0.5">{session.title}</h5>
                    <p className="text-[11px] text-slate-500">
                      {session.roomName || 'Main Hall'} • Speaker: {session.speakerId?.name || 'Keynote Speaker'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0 self-start sm:self-auto">
                  {session.category || 'Technical Track'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleCalendar;
