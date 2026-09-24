import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const AttentionRequired = () => {
  const alerts = [
    {
      title: 'Main Hall is nearing capacity.',
      time: '3 hours ago',
      link: '/organizer/venues'
    },
    {
      title: '2 speaker profiles are missing presentation materials.',
      time: '5 hours ago',
      link: '/organizer/speakers'
    },
    {
      title: '12 registrations are awaiting approval.',
      time: 'Today',
      link: '/organizer/registrations'
    }
  ];

  return (
    <div className="panel !bg-gold/10 border-gold/30 space-y-3.5">
      <div className="flex items-center space-x-2 text-gold">
        <AlertTriangle className="w-4 h-4 text-gold" />
        <h3 className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-ink">
          Attention Required
        </h3>
      </div>

      <div className="space-y-2.5">
        {alerts.map((al, idx) => (
          <div
            key={idx}
            className="p-3 bg-surface rounded-xl border border-line flex items-center justify-between gap-3 text-xs"
          >
            <div>
              <p className="font-bold text-ink leading-snug">
                {al.title}
              </p>
              <span className="text-[10px] text-muted mt-0.5 block">
                {al.time}
              </span>
            </div>
            <Link
              to={al.link}
              className="btn !py-1 !px-3 text-xs font-bold shrink-0"
            >
              Review
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttentionRequired;
