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
  FileText
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

  // Default rendering for other roles (Staff, Speakers, Sponsors, Attendees)
  const getNavItems = () => {
    switch (user.role) {
      case 'organizer':
        return [
          { label: 'Dashboard', to: '/organizer/dashboard', icon: LayoutDashboard },
          { label: 'Events', to: '/organizer/events', icon: Calendar },
          { label: 'Venues', to: '/organizer/venues', icon: Building2 },
          { label: 'Sessions', to: '/organizer/sessions', icon: Clock },
          { label: 'Speakers', to: '/organizer/speakers', icon: Mic },
          { label: 'Sponsors', to: '/organizer/sponsors', icon: Award },
          { label: 'Sponsorship Packages', to: '/organizer/packages', icon: PackageCheck },
          { label: 'Tickets', to: '/organizer/tickets', icon: Ticket },
          { label: 'Attendees', to: '/organizer/attendees', icon: Users },
          { label: 'Announcements', to: '/organizer/announcements', icon: Megaphone },
          { label: 'Feedback', to: '/organizer/feedback', icon: MessageSquare },
          { label: 'Analytics', to: '/organizer/analytics', icon: BarChart3 },
          { label: 'AI Studio', to: '/organizer/ai-studio', icon: Sparkles, highlight: true }
        ];
      case 'staff':
        return [
          { label: 'Staff Dashboard', to: '/staff/dashboard', icon: LayoutDashboard },
          { label: 'QR Scan Check-in', to: '/staff/checkin', icon: QrCode, highlight: true },
          { label: 'Session Attendance', to: '/staff/session-attendance', icon: Clock },
          { label: 'Attendee Support', to: '/staff/support', icon: Users }
        ];
      case 'speaker':
        return [
          { label: 'Speaker Dashboard', to: '/speaker/dashboard', icon: LayoutDashboard },
          { label: 'Speaker Profile', to: '/speaker/profile', icon: Mic },
          { label: 'My Sessions', to: '/speaker/sessions', icon: Clock },
          { label: 'Availability', to: '/speaker/availability', icon: Calendar },
          { label: 'Presentation Materials', to: '/speaker/materials', icon: FileText }
        ];
      case 'sponsor':
        return [
          { label: 'Sponsor Dashboard', to: '/sponsor/dashboard', icon: LayoutDashboard },
          { label: 'Company Profile', to: '/sponsor/profile', icon: Building2 },
          { label: 'Sponsorship Package', to: '/sponsor/package', icon: Award },
          { label: 'Brand Assets', to: '/sponsor/brand-assets', icon: FileText },
          { label: 'Deliverable Tracker', to: '/sponsor/deliverables', icon: PackageCheck, highlight: true }
        ];
      case 'attendee':
      default:
        return [
          { label: 'Attendee Dashboard', to: '/attendee/dashboard', icon: LayoutDashboard },
          { label: 'Browse Events', to: '/attendee/browse', icon: Compass },
          { label: 'My Tickets & Passes', to: '/attendee/tickets', icon: Ticket },
          { label: 'My Digital QR Badge', to: '/attendee/qr-code', icon: QrCode, highlight: true },
          { label: 'My Sessions Agenda', to: '/attendee/sessions', icon: Calendar },
          { label: 'AI Session Recommendations', to: '/attendee/recommendations', icon: Sparkles, highlight: true },
          { label: 'Session Feedback', to: '/attendee/feedback', icon: MessageSquare }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-60 bg-white border-r border-slate-200 hidden lg:block shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-3.5">
        <div className="mb-3 px-2.5 py-2 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Scope</p>
          <p className="text-xs font-bold text-slate-800 capitalize">{user.role} Portal</p>
        </div>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : item.highlight
                      ? 'text-blue-700 bg-blue-50/70 hover:bg-blue-100/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
