import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Clock, Mic, Award, ArrowUpRight } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: '+ Create Event',
      subtitle: 'Create a new corporate event.',
      link: '/organizer/events/create',
      icon: CalendarPlus,
      color: 'bg-accent/10 text-accent'
    },
    {
      title: '+ Add Session',
      subtitle: 'Schedule a new session.',
      link: '/organizer/sessions',
      icon: Clock,
      color: 'bg-teal/10 text-teal'
    },
    {
      title: '+ Add Speaker',
      subtitle: 'Add a speaker to an event.',
      link: '/organizer/speakers',
      icon: Mic,
      color: 'bg-gold/10 text-gold'
    },
    {
      title: '+ Add Sponsor',
      subtitle: 'Manage event sponsorships.',
      link: '/organizer/sponsors',
      icon: Award,
      color: 'bg-accent/10 text-accent'
    }
  ];

  return (
    <div className="panel space-y-4">
      <div>
        <h3 className="text-sm sm:text-base font-display font-bold text-ink tracking-tight">
          Quick Actions
        </h3>
        <p className="text-xs text-muted mt-0.5">
          Fast shortcuts for common event lifecycle tasks.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <Link
              key={i}
              to={act.link}
              className="slot group flex flex-col justify-between space-y-2 !p-3.5"
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink block group-hover:text-accent transition-colors">
                  {act.title}
                </span>
                <span className="text-[11px] text-muted leading-snug mt-0.5 block">
                  {act.subtitle}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
