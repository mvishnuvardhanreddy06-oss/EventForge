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
    <div className="panel min-w-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4 min-w-0">
        <div>
          <h3 className="text-base font-display font-bold text-ink tracking-tight truncate">
            Recent Platform Activity
          </h3>
          <p className="text-xs text-muted mt-0.5 truncate">
            Real-time multi-tenant audit trail
          </p>
        </div>
        <button
          onClick={() => alert('Viewing full platform audit history.')}
          className="text-xs font-semibold text-accent hover:underline shrink-0 cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="divide-y divide-line">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-bg/40 rounded-lg px-2 -mx-2 transition-colors min-w-0"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-bg text-muted border border-line flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <p className="text-xs font-semibold text-ink truncate">
                      {item.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5 truncate">
                    {item.entity}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:text-right shrink-0 pl-10 sm:pl-0">
                <span className="chip !py-0.5 !px-2 text-[10px]">
                  {item.status}
                </span>
                <span className="text-xs text-muted font-normal">
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
