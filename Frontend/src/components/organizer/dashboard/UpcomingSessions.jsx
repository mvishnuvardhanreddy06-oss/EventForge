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
    <div className="panel space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-display font-bold text-ink tracking-tight">
            Upcoming Sessions
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Key agenda presentations scheduled across tracks.
          </p>
        </div>
        <Link
          to="/organizer/sessions"
          className="text-xs font-bold text-accent hover:underline flex items-center space-x-1"
        >
          <span>All Sessions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {sessions.map((s, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-bg/40 hover:bg-bg/80 rounded-xl border border-line transition-colors flex items-start justify-between gap-3"
          >
            <div className="flex items-start space-x-3 min-w-0">
              <div className="w-14 h-11 rounded-lg bg-surface border border-line text-accent flex flex-col items-center justify-center shrink-0">
                <Clock className="w-3 h-3 text-accent mb-0.5" />
                <span className="font-mono font-bold text-[10px] leading-none">{s.time}</span>
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="text-xs font-display font-bold text-ink truncate">
                  {s.title}
                </h4>
                <p className="text-[11px] text-muted truncate">
                  {s.event} · <span className="font-medium text-ink">{s.room}</span>
                </p>
                <div className="flex items-center space-x-1.5 text-[11px] text-muted pt-0.5">
                  <User className="w-3 h-3 text-muted" />
                  <span>Speaker: <strong className="text-ink">{s.speaker}</strong></span>
                </div>
              </div>
            </div>

            <span className="chip !py-0.5 !px-2 text-[10px] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>{s.badge}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSessions;
