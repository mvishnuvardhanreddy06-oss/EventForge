import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RecentRegistrations = () => {
  const registrations = [
    {
      name: 'Rahul Kumar',
      avatar: 'RK',
      event: 'Global Tech Leadership Summit',
      ticket: 'VIP',
      date: 'Today',
      status: 'Confirmed'
    },
    {
      name: 'Priya Sharma',
      avatar: 'PS',
      event: 'AI & Cloud Innovation Conference',
      ticket: 'Standard',
      date: 'Today',
      status: 'Confirmed'
    },
    {
      name: 'Ananya Reddy',
      avatar: 'AR',
      event: 'Global Tech Leadership Summit',
      ticket: 'Standard',
      date: 'Yesterday',
      status: 'Pending'
    }
  ];

  return (
    <div className="panel space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-display font-bold text-ink tracking-tight">
            Recent Registrations
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Latest attendee passes claimed across your conferences.
          </p>
        </div>
        <Link
          to="/organizer/registrations"
          className="text-xs font-bold text-accent hover:underline flex items-center space-x-1"
        >
          <span>View All Registrations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-line">
        {registrations.map((reg, idx) => (
          <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {reg.avatar}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-ink text-xs block truncate">
                  {reg.name}
                </span>
                <span className="text-[11px] text-muted truncate block">
                  {reg.event}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-bg text-ink border border-line">
                {reg.ticket}
              </span>
              <span className="text-[11px] font-mono text-muted hidden sm:inline">
                {reg.date}
              </span>
              <span
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  reg.status === 'Confirmed'
                    ? 'bg-teal/10 text-teal border border-teal/20'
                    : 'bg-gold/10 text-gold border border-gold/20'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    reg.status === 'Confirmed' ? 'bg-teal' : 'bg-gold'
                  }`}
                />
                <span>{reg.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRegistrations;
