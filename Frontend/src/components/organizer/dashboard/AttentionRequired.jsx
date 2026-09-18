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
    <div className="bg-amber-50/40 rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-2xs space-y-3.5">
      <div className="flex items-center space-x-2 text-amber-800">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
          Attention Required
        </h3>
      </div>

      <div className="space-y-2.5">
        {alerts.map((al, idx) => (
          <div
            key={idx}
            className="p-3 bg-white rounded-xl border border-amber-200/60 flex items-center justify-between gap-3 text-xs"
          >
            <div>
              <p className="font-bold text-slate-900 leading-snug">
                {al.title}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {al.time}
              </span>
            </div>
            <Link
              to={al.link}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors shrink-0"
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
