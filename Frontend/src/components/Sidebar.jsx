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

  // For Platform Admin: Premium Linear/Stripe style grouped sidebar
  if (user.role === 'admin') {
    const adminSections = [
      {
        title: 'MAIN',
        items: [
          { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard }
        ]
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
        items: [
          { label: 'Platform Settings', to: '/admin/settings', icon: Settings }
        ]
      }
    ];

    return (
      <aside className="w-[240px] bg-white border-r border-slate-200/80 hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between">
        <div className="p-3.5 space-y-5">
          {adminSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  if (item.isPlaceholder) {
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50/60 transition-colors cursor-default select-none"
                        title={`${item.label} — Planned Module`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-400 uppercase">
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
                            ? 'bg-blue-50/80 text-blue-900 border-l-[3px] border-blue-600 rounded-l-none'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Admin Profile at Bottom */}
        <div className="p-3.5 border-t border-slate-100/90 bg-slate-50/40">
          <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">VR</div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-slate-900 truncate">Vishnureddy</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate">Platform Admin</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-white" title="Active Session" />
          </div>
        </div>
      </aside>
    );
  }

  // For Event Organizer: Grouped Linear/Stripe style organizer sidebar
  if (user.role === 'organizer') {
    const organizerSections = [
      {
        title: 'MAIN',
        items: [
          { label: 'Dashboard', to: '/organizer/dashboard', icon: LayoutDashboard }
        ]
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
        items: [
          { label: 'Staff', to: '/staff/dashboard', icon: ShieldCheck }
        ]
      },
      {
        title: 'INSIGHTS',
        items: [
          { label: 'Analytics', to: '/organizer/analytics', icon: BarChart3 }
        ]
      },
      {
        title: 'AI TOOLS',
        items: [
          { label: 'AI Event Assistant', to: '/organizer/ai-studio', icon: Sparkles, highlight: true }
        ]
      },
      {
        title: 'SYSTEM',
        items: [
          { label: 'Settings', to: '/organizer/settings', icon: Settings }
        ]
      }
    ];

    return (
      <aside className="w-[240px] bg-white border-r border-slate-200/80 hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {organizerSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                          isActive
                            ? 'bg-blue-50/80 text-blue-900 border-l-[3px] border-blue-600 rounded-l-none font-bold'
                            : item.highlight
                            ? 'text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/60 hover:text-indigo-900'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : item.highlight ? 'text-indigo-600' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                          {item.highlight && (
                            <span className="ml-auto px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 uppercase">
                              AI
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Organizer Profile at Bottom */}
        <div className="p-3.5 border-t border-slate-100/90 bg-slate-50/40">
          <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">VR</div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-slate-900 truncate">Vishnureddy</p>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide truncate">EVENT ORGANIZER</p>
              <p className="text-[10px] text-slate-400 truncate">Apex Global Events</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-white" title="Active Session" />
          </div>
        </div>
      </aside>
    );
  }

  // For Speaker: Grouped Linear/Stripe style speaker sidebar
  const currentRole = (user.role || '').toLowerCase();
  if (currentRole === 'speaker') {
    const speakerSections = [
      {
        title: 'MAIN',
        items: [
          { label: 'Dashboard', to: '/speaker/dashboard', icon: LayoutDashboard }
        ]
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
        items: [
          { label: 'Presentation Materials', to: '/speaker/materials', icon: FileText }
        ]
      },
      {
        title: 'SCHEDULE',
        items: [
          { label: 'Availability', to: '/speaker/availability', icon: CalendarCheck }
        ]
      },
      {
        title: 'PROFILE',
        items: [
          { label: 'Speaker Profile', to: '/speaker/profile', icon: Mic }
        ]
      },
      {
        title: 'COMMUNICATION',
        items: [
          { label: 'Announcements', to: '/speaker/announcements', icon: Megaphone }
        ]
      },
      {
        title: 'ACCOUNT',
        items: [
          { label: 'Settings', to: '/speaker/settings', icon: Settings }
        ]
      }
    ];

    const getInitials = (name) => {
      if (!name) return 'SP';
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
      <aside className="w-[240px] bg-white border-r border-slate-200/80 hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {speakerSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                          isActive
                            ? 'bg-purple-50/80 text-purple-900 border-l-[3px] border-purple-600 rounded-l-none font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Speaker Profile at Bottom */}
        <div className="p-3.5 border-t border-slate-100/90 bg-slate-50/40">
          <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Keynote Speaker'}</p>
              <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wide truncate">KEYNOTE SPEAKER</p>
              <p className="text-[10px] text-slate-400 truncate">EventForge Summit</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-white" title="Active Session" />
          </div>
        </div>
      </aside>
    );
  }

  // For Event Staff: Grouped staff sidebar
  if (currentRole === 'staff') {
    const staffSections = [
      {
        title: 'MAIN',
        items: [
          { label: 'Staff Dashboard', to: '/staff/dashboard', icon: LayoutDashboard }
        ]
      },
      {
        title: 'OPERATIONS',
        items: [
          { label: 'QR Scan Check-in', to: '/staff/checkin', icon: QrCode, highlight: true },
          { label: 'Session Attendance', to: '/staff/session-attendance', icon: Clock },
          { label: 'Attendee Support', to: '/staff/support', icon: Users }
        ]
      }
    ];

    const getStaffInitials = (name) => {
      if (!name) return 'ES';
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
      <aside className="w-[240px] bg-white border-r border-slate-200/80 hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {staffSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                          isActive
                            ? 'bg-emerald-50/80 text-emerald-900 border-l-[3px] border-emerald-600 rounded-l-none font-bold'
                            : item.highlight
                            ? 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/60 hover:text-emerald-900'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : item.highlight ? 'text-emerald-600' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                          {item.highlight && (
                            <span className="ml-auto px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                              SCAN
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Staff Profile at Bottom */}
        <div className="p-3.5 border-t border-slate-100/90 bg-slate-50/40">
          <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {getStaffInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Operations Staff'}</p>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide truncate">EVENT STAFF</p>
              <p className="text-[10px] text-slate-400 truncate">On-Site Operations</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-white" title="Active Duty" />
          </div>
        </div>
      </aside>
    );
  }

  // For Sponsor: Grouped sponsor portal sidebar
  if (currentRole === 'sponsor') {
    const sponsorSections = [
      {
        title: 'MAIN',
        items: [
          { label: 'Dashboard', to: '/sponsor/dashboard', icon: LayoutDashboard }
        ]
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
          { label: 'Deliverables', to: '/sponsor/deliverables', icon: PackageCheck, highlight: true }
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

    const getSponsorInitials = (name) => {
      if (!name) return 'SP';
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
      <aside className="w-[240px] bg-white border-r border-slate-200/80 hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between">
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {sponsorSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                          isActive
                            ? 'bg-amber-50/80 text-amber-900 border-l-[3px] border-amber-600 rounded-l-none font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                          {item.highlight && (
                            <span className="ml-auto px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 uppercase">
                              Active
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sponsor Profile at Bottom */}
        <div className="p-3.5 border-t border-slate-100/90 bg-slate-50/40">
          <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {getSponsorInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Corporate Partner'}</p>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide truncate">OFFICIAL SPONSOR</p>
              <p className="text-[10px] text-slate-400 truncate">Partner Portal</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-white" title="Active Partner" />
          </div>
        </div>
      </aside>
    );
  }

  // For Attendee: Grouped attendee portal sidebar
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
      items: [
        { label: 'Notifications', to: '/attendee/notifications', icon: Bell }
      ]
    },
    {
      title: 'FEEDBACK',
      items: [
        { label: 'Feedback & Reviews', to: '/attendee/feedback', icon: MessageSquare }
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Settings', to: '/attendee/settings', icon: Settings }
      ]
    }
  ];

  const getAttendeeInitials = (name) => {
    if (!name) return 'AT';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-[240px] bg-white border-r border-slate-200/80 hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] justify-between">
      <div className="p-3.5 space-y-4 overflow-y-auto">
        {attendeeSections.map((sec) => (
          <div key={sec.title}>
            <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              {sec.title}
            </p>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-blue-50/80 text-blue-900 border-l-[3px] border-blue-600 rounded-l-none font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Attendee Profile at Bottom */}
      <div className="p-3.5 border-t border-slate-100/90 bg-slate-50/40">
        <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            {getAttendeeInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Event Attendee'}</p>
            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide truncate">CONFERENCE ATTENDEE</p>
            <p className="text-[10px] text-slate-400 truncate">Participant Portal</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-white" title="Active Badge" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
