import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Settings,
  Calendar,
  Clock,
  Mic,
  Award,
  PackageCheck,
  Ticket,
  Megaphone,
  MessageSquare,
  Sparkles,
  QrCode,
  Compass,
  FileText,
  CalendarCheck,
  User,
  Bell
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const getInitials = (name, fallback = 'U') => {
    if (!name) return fallback;
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const renderNavSection = (sec) => (
    <div key={sec.title}>
      <p className="px-2.5 mb-1.5 text-[10px] font-bold text-muted tracking-wider uppercase">
        {sec.title}
      </p>
      <div className="space-y-0.5">
        {sec.items.map((item) => {
          const Icon = item.icon;
          if (item.isPlaceholder) {
            return (
              <div
                key={item.label}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted/60 cursor-default select-none"
                title={`${item.label} — Planned Module`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0 text-muted/50" />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-bg text-muted uppercase">
                  Soon
                </span>
              </div>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-accent/10 text-accent border-l-[3px] border-accent rounded-l-none font-bold'
                    : item.highlight
                    ? 'text-accent bg-accent/5 hover:bg-accent/10'
                    : 'text-muted hover:text-ink hover:bg-bg'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : item.highlight ? 'text-accent' : 'text-muted'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.highlight && (
                    <span className="ml-auto px-1.5 py-0.2 rounded text-[9px] font-bold bg-accent/15 text-accent uppercase">
                      {item.badge || 'PRO'}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  const renderProfileFooter = (roleTitle, subTitle, initials, badgeColor = 'bg-accent') => (
    <div className="p-3.5 border-t border-line bg-surface/50">
      <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg">
        <div className={`w-8 h-8 rounded-full ${badgeColor} text-onaccent flex items-center justify-center font-bold text-xs shadow-xs`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-xs font-bold text-ink truncate">{user.name || 'User'}</p>
          <p className="text-[10px] font-bold text-accent uppercase tracking-wide truncate">{roleTitle}</p>
          {subTitle && <p className="text-[10px] text-muted truncate">{subTitle}</p>}
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-surface" title="Active Session" />
      </div>
    </div>
  );

  // 1. Platform Admin
  if (user.role === 'admin') {
    const adminSections = [
      {
        title: 'MAIN',
        items: [{ label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard }]
      },
      {
        title: 'MANAGEMENT',
        items: [
          { label: 'Organizations', to: '/admin/organizations', icon: Building2 },
          { label: 'Platform Users', to: '/admin/users', icon: Users },
          { label: 'Subscriptions', to: '/admin/subscriptions', icon: CreditCard }
        ]
      },
      {
        title: 'INSIGHTS',
        items: [
          { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
          { label: 'Audit Logs', to: '/admin/audit-logs', icon: ShieldCheck }
        ]
      },
      {
        title: 'SYSTEM',
        items: [{ label: 'Platform Settings', to: '/admin/settings', icon: Settings }]
      }
    ];

    return (
      <aside className="w-[240px] bg-surface border-r border-line hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between transition-colors duration-200">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {adminSections.map(renderNavSection)}
        </div>
        {renderProfileFooter('Platform Admin', 'Superuser Access', getInitials(user.name, 'PA'), 'bg-accent')}
      </aside>
    );
  }

  // 2. Event Organizer
  if (user.role === 'organizer') {
    const organizerSections = [
      {
        title: 'MAIN',
        items: [{ label: 'Dashboard', to: '/organizer/dashboard', icon: LayoutDashboard }]
      },
      {
        title: 'EVENT MANAGEMENT',
        items: [
          { label: 'My Events', to: '/organizer/events', icon: Calendar },
          { label: 'Venues', to: '/organizer/venues', icon: Building2 },
          { label: 'Sessions', to: '/organizer/sessions', icon: Clock },
          { label: 'Speakers', to: '/organizer/speakers', icon: Mic },
          { label: 'Sponsors', to: '/organizer/sponsors', icon: Award },
          { label: 'Attendees', to: '/organizer/attendees', icon: Users }
        ]
      },
      {
        title: 'PEOPLE',
        items: [{ label: 'Staff Management', to: '/organizer/staff', icon: ShieldCheck }]
      },
      {
        title: 'INSIGHTS',
        items: [{ label: 'Analytics', to: '/organizer/analytics', icon: BarChart3 }]
      },
      {
        title: 'AI TOOLS',
        items: [
          { label: 'AI Event Assistant', to: '/organizer/ai-studio', icon: Sparkles, highlight: true, badge: 'AI' }
        ]
      },
      {
        title: 'SYSTEM',
        items: [{ label: 'Settings', to: '/organizer/settings', icon: Settings }]
      }
    ];

    return (
      <aside className="w-[240px] bg-surface border-r border-line hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between transition-colors duration-200">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {organizerSections.map(renderNavSection)}
        </div>
        {renderProfileFooter('EVENT ORGANIZER', 'Apex Global Events', getInitials(user.name, 'EO'), 'bg-accent')}
      </aside>
    );
  }

  // 3. Speaker
  const currentRole = (user.role || '').toLowerCase();
  if (currentRole === 'speaker') {
    const speakerSections = [
      {
        title: 'MAIN',
        items: [{ label: 'Dashboard', to: '/speaker/dashboard', icon: LayoutDashboard }]
      },
      {
        title: 'EVENTS',
        items: [
          { label: 'My Events', to: '/speaker/events', icon: Calendar },
          { label: 'My Sessions', to: '/speaker/sessions', icon: Clock }
        ]
      },
      {
        title: 'CONTENT',
        items: [{ label: 'Presentation Materials', to: '/speaker/materials', icon: FileText }]
      },
      {
        title: 'SCHEDULE',
        items: [{ label: 'Availability', to: '/speaker/availability', icon: CalendarCheck }]
      },
      {
        title: 'PROFILE',
        items: [{ label: 'Speaker Profile', to: '/speaker/profile', icon: Mic }]
      },
      {
        title: 'COMMUNICATION',
        items: [{ label: 'Announcements', to: '/speaker/announcements', icon: Megaphone }]
      },
      {
        title: 'ACCOUNT',
        items: [{ label: 'Settings', to: '/speaker/settings', icon: Settings }]
      }
    ];

    return (
      <aside className="w-[240px] bg-surface border-r border-line hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between transition-colors duration-200">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {speakerSections.map(renderNavSection)}
        </div>
        {renderProfileFooter('KEYNOTE SPEAKER', 'EventForge Summit', getInitials(user.name, 'SP'), 'bg-gold')}
      </aside>
    );
  }

  // 4. Staff
  if (currentRole === 'staff') {
    const staffSections = [
      {
        title: 'MAIN',
        items: [{ label: 'Staff Dashboard', to: '/staff/dashboard', icon: LayoutDashboard }]
      },
      {
        title: 'OPERATIONS',
        items: [
          { label: 'QR Scan Check-in', to: '/staff/checkin', icon: QrCode, highlight: true, badge: 'SCAN' },
          { label: 'Session Attendance', to: '/staff/session-attendance', icon: Clock },
          { label: 'Attendee Support', to: '/staff/support', icon: Users }
        ]
      }
    ];

    return (
      <aside className="w-[240px] bg-surface border-r border-line hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between transition-colors duration-200">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {staffSections.map(renderNavSection)}
        </div>
        {renderProfileFooter('EVENT STAFF', 'On-Site Operations', getInitials(user.name, 'ST'), 'bg-teal')}
      </aside>
    );
  }

  // 5. Sponsor
  if (currentRole === 'sponsor') {
    const sponsorSections = [
      {
        title: 'MAIN',
        items: [{ label: 'Dashboard', to: '/sponsor/dashboard', icon: LayoutDashboard }]
      },
      {
        title: 'EVENTS & SPONSORSHIPS',
        items: [
          { label: 'My Events', to: '/sponsor/events', icon: Calendar },
          { label: 'Sponsorships', to: '/sponsor/sponsorships', icon: Award }
        ]
      },
      {
        title: 'OPERATIONS',
        items: [
          { label: 'Deliverables', to: '/sponsor/deliverables', icon: PackageCheck, highlight: true, badge: 'TASKS' }
        ]
      },
      {
        title: 'ACCOUNT',
        items: [
          { label: 'Sponsor Profile', to: '/sponsor/profile', icon: Building2 },
          { label: 'Payments & Invoices', to: '/sponsor/invoices', icon: CreditCard },
          { label: 'Announcements', to: '/sponsor/announcements', icon: Megaphone },
          { label: 'Settings', to: '/sponsor/settings', icon: Settings }
        ]
      }
    ];

    return (
      <aside className="w-[240px] bg-surface border-r border-line hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between transition-colors duration-200">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {sponsorSections.map(renderNavSection)}
        </div>
        {renderProfileFooter('OFFICIAL SPONSOR', 'Partner Portal', getInitials(user.name, 'SP'), 'bg-gold')}
      </aside>
    );
  }

  // 6. Attendee
  const attendeeSections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', to: '/attendee/dashboard', icon: LayoutDashboard },
        { label: 'Discover Events', to: '/attendee/browse', icon: Compass }
      ]
    },
    {
      title: 'MY EVENT ACTIVITY',
      items: [
        { label: 'My Registrations', to: '/attendee/registrations', icon: FileText },
        { label: 'My Tickets', to: '/attendee/tickets', icon: Ticket },
        { label: 'My Schedule', to: '/attendee/schedule', icon: CalendarCheck },
        { label: 'My Sessions', to: '/attendee/sessions', icon: Clock }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [{ label: 'Notifications', to: '/attendee/notifications', icon: Bell }]
    },
    {
      title: 'FEEDBACK',
      items: [{ label: 'Feedback & Reviews', to: '/attendee/feedback', icon: MessageSquare }]
    },
    {
      title: 'ACCOUNT',
      items: [{ label: 'Settings', to: '/attendee/settings', icon: Settings }]
    }
  ];

  return (
    <aside className="w-[240px] bg-surface border-r border-line hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between transition-colors duration-200">
      <div className="p-3.5 space-y-4 overflow-y-auto">
        {attendeeSections.map(renderNavSection)}
      </div>
      {renderProfileFooter('CONFERENCE ATTENDEE', 'Participant Portal', getInitials(user.name, 'AT'), 'bg-accent')}
    </aside>
  );
};

export default Sidebar;
