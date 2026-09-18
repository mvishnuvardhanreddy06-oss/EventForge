import React from 'react';
import {
  Building2,
  UserPlus,
  Calendar,
  Award,
  Briefcase
} from 'lucide-react';

const activities = [
  {
    id: 1,
    title: 'Organization created',
    entity: 'TechCorp Solutions',
    relativeTime: '10 min ago',
    category: 'Organization',
    icon: Building2,
    status: 'Active'
  },
  {
    id: 2,
    title: 'Organizer registered',
    entity: 'Rahul Kumar (Nexus Tech Summits)',
    relativeTime: '25 min ago',
    category: 'User Access',
    icon: UserPlus,
    status: 'Verified'
  },
  {
    id: 3,
    title: 'Event published',
    entity: 'Global AI Summit 2026',
    relativeTime: '1 hour ago',
    category: 'Event Lifecycle',
    icon: Calendar,
    status: 'Published'
  },
  {
    id: 4,
    title: 'Subscription upgraded',
    entity: 'ABC Events → Enterprise Plan',
    relativeTime: '2 hours ago',
    category: 'Subscription',
    icon: Award,
    status: 'Upgraded'
  },
  {
    id: 5,
    title: 'New sponsor account',
    entity: 'DataFlow Inc. (DevOps World)',
    relativeTime: '5 hours ago',
    category: 'Sponsorship',
    icon: Briefcase,
    status: 'Review'
  }
];

const ActivityList = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4 min-w-0">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
            Recent Platform Activity
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Real-time multi-tenant audit trail
          </p>
        </div>
        <button
          onClick={() => alert('Viewing full platform audit history.')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline shrink-0"
        >
          View All
        </button>
      </div>

      <div className="divide-y divide-slate-100/90">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors min-w-0"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {item.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {item.entity}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:text-right shrink-0 pl-10 sm:pl-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                  {item.status}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  {item.relativeTime}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityList;
