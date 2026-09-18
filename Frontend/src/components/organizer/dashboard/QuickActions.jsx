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
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: '+ Add Session',
      subtitle: 'Schedule a new session.',
      link: '/organizer/sessions',
      icon: Clock,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: '+ Add Speaker',
      subtitle: 'Add a speaker to an event.',
      link: '/organizer/speakers',
      icon: Mic,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: '+ Add Sponsor',
      subtitle: 'Manage event sponsorships.',
      link: '/organizer/sponsors',
      icon: Award,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Quick Actions
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
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
              className="bg-slate-50/70 hover:bg-slate-100/90 border border-slate-200/70 hover:border-slate-300 rounded-xl p-3.5 transition-all group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">
                  {act.title}
                </span>
                <span className="text-[11px] text-slate-500 leading-snug mt-0.5 block">
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
