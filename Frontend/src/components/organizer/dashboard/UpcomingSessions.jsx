import React from 'react';
import { Clock, MapPin, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UpcomingSessions = () => {
  const sessions = [
    {
      time: '10:00 AM',
      title: 'Opening Keynote',
      event: 'Global Tech Leadership Summit',
      room: 'Main Hall',
      speaker: 'Arjun Mehta',
      badge: 'In 2 days'
    },
    {
      time: '11:30 AM',
      title: 'AI Infrastructure at Scale',
      event: 'Global Tech Leadership Summit',
      room: 'Hall B',
      speaker: 'Sarah Wilson',
      badge: 'In 2 days'
    },
    {
      time: '02:00 PM',
      title: 'Future of Digital Finance',
      event: 'FinTech Future Forum',
      room: 'Room 201',
      speaker: 'Rahul Sharma',
      badge: 'In 30 days'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Upcoming Sessions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key agenda presentations scheduled across tracks.
          </p>
        </div>
        <Link
          to="/organizer/sessions"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <span>All Sessions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {sessions.map((s, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl border border-slate-200/70 transition-colors flex items-start justify-between gap-3"
          >
            <div className="flex items-start space-x-3 min-w-0">
              <div className="w-14 h-11 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-700 flex flex-col items-center justify-center shrink-0">
                <Clock className="w-3 h-3 text-blue-500 mb-0.5" />
                <span className="font-mono font-bold text-[10px] leading-none">{s.time}</span>
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {s.event} · <span className="font-medium text-slate-700">{s.room}</span>
                </p>
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 pt-0.5">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Speaker: <strong>{s.speaker}</strong></span>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-600 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{s.badge}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSessions;
