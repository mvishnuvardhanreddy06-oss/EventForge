import React from 'react';
import { Check, Clock, User, Upload, CreditCard, Building } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      text: 'Priya Sharma registered for Global Tech Leadership Summit',
      time: '5 minutes ago',
      icon: User,
      color: 'text-teal bg-teal/10 border-teal/20'
    },
    {
      text: 'Speaker Sarah Wilson uploaded presentation material',
      time: '32 minutes ago',
      icon: Upload,
      color: 'text-accent bg-accent/10 border-accent/20'
    },
    {
      text: 'Sponsor TechNova completed payment',
      time: '1 hour ago',
      icon: CreditCard,
      color: 'text-gold bg-gold/10 border-gold/20'
    },
    {
      text: 'Organizer updated Main Hall capacity',
      time: '2 hours ago',
      icon: Building,
      color: 'text-teal bg-teal/10 border-teal/20'
    }
  ];

  return (
    <div className="panel space-y-4">
      <div>
        <h3 className="text-base font-display font-bold text-ink tracking-tight">
          Recent Activity
        </h3>
        <p className="text-xs text-muted mt-0.5">
          Real-time updates from your attendee and event streams.
        </p>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
        {activities.map((act, i) => {
          const Icon = act.icon;
          return (
            <div key={i} className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${act.color}`}
              >
                <Icon className="w-2.5 h-2.5" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-ink leading-snug">
                  {act.text}
                </p>
                <span className="text-[10px] font-mono text-muted block">
                  {act.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
