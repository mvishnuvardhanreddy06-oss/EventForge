import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { notificationService } from '../services/api';
import {
  Layers,
  Bell,
  LogOut,
  Search,
  ChevronDown,
  Building2,
  Users,
  Calendar,
  Settings,
  ArrowRight,
  X,
  Sparkles,
  Shield,
  Tag,
  CreditCard,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

// Comprehensive searchable index across the EventForge platform
const SEARCHABLE_ENTITIES = [
  // 1. Organizations
  {
    id: 'org-1',
    title: 'Nexus Tech Summits',
    category: 'Organizations',
    subtitle: 'Enterprise Tenant · 4 Events · 1,420 Users',
    badge: 'Enterprise',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    path: '/admin/organizations',
    icon: Building2,
    iconBg: 'bg-blue-50 text-blue-600',
    keywords: ['nexus', 'tech', 'summits', 'organization', 'tenant', 'enterprise']
  },
  {
    id: 'org-2',
    title: 'Apex Global Events',
    category: 'Organizations',
    subtitle: 'Pro Tenant · 2 Events · 620 Users',
    badge: 'Pro Tier',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    path: '/admin/organizations',
    icon: Building2,
    iconBg: 'bg-indigo-50 text-indigo-600',
    keywords: ['apex', 'global', 'events', 'organization', 'tenant', 'pro']
  },
  {
    id: 'org-3',
    title: 'TechCorp Solutions',
    category: 'Organizations',
    subtitle: 'Enterprise Tenant · Newly Provisioned',
    badge: 'Enterprise',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    path: '/admin/organizations',
    icon: Building2,
    iconBg: 'bg-blue-50 text-blue-600',
    keywords: ['techcorp', 'solutions', 'organization', 'tenant']
  },
  {
    id: 'org-4',
    title: 'CloudScale Dynamics',
    category: 'Organizations',
    subtitle: 'Tenant Organization · Pending Review',
    badge: 'Pending Review',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
    path: '/admin/organizations',
    icon: Building2,
    iconBg: 'bg-amber-50 text-amber-600',
    keywords: ['cloudscale', 'dynamics', 'organization', 'pending']
  },

  // 2. Users & Personnel
  {
    id: 'usr-1',
    title: 'Vishnureddy',
    category: 'Platform Users',
    subtitle: 'Platform Administrator · mvishnuvardhanreddy33@gmail.com',
    badge: 'Platform Admin',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/60',
    path: '/admin/users',
    icon: Shield,
    iconBg: 'bg-rose-50 text-rose-600',
    keywords: ['vishnureddy', 'vishnu', 'reddy', 'admin', 'administrator', 'user', 'platform']
  },
  {
    id: 'usr-2',
    title: 'Dr. Elena Rostova',
    category: 'Platform Users',
    subtitle: 'Keynote Speaker · Artificial Intelligence Specialist',
    badge: 'Speaker',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/60',
    path: '/admin/users',
    icon: Users,
    iconBg: 'bg-purple-50 text-purple-600',
    keywords: ['elena', 'rostova', 'speaker', 'ai', 'keynote', 'user']
  },
  {
    id: 'usr-3',
    title: 'Marcus Sterling',
    category: 'Platform Users',
    subtitle: 'Lead Event Organizer · Apex Global Events',
    badge: 'Organizer',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    path: '/admin/users',
    icon: Users,
    iconBg: 'bg-emerald-50 text-emerald-600',
    keywords: ['marcus', 'sterling', 'organizer', 'apex', 'user']
  },
  {
    id: 'usr-4',
    title: 'Rahul Kumar',
    category: 'Platform Users',
    subtitle: 'Event Organizer · Nexus Tech Summits',
    badge: 'Organizer',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    path: '/admin/users',
    icon: Users,
    iconBg: 'bg-emerald-50 text-emerald-600',
    keywords: ['rahul', 'kumar', 'organizer', 'nexus', 'user']
  },
  {
    id: 'usr-5',
    title: 'David Kim',
    category: 'Platform Users',
    subtitle: 'Operations Staff · On-Site Credential Check-in',
    badge: 'Staff',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
    path: '/admin/users',
    icon: Users,
    iconBg: 'bg-cyan-50 text-cyan-600',
    keywords: ['david', 'kim', 'staff', 'operations', 'checkin', 'user']
  },
  {
    id: 'usr-6',
    title: 'DataFlow Inc.',
    category: 'Platform Users',
    subtitle: 'Corporate Diamond Sponsor Account',
    badge: 'Sponsor',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
    path: '/admin/users',
    icon: Tag,
    iconBg: 'bg-amber-50 text-amber-600',
    keywords: ['dataflow', 'sponsor', 'corporate', 'partner', 'user']
  },

  // 3. Conferences & Events
  {
    id: 'evt-1',
    title: 'Global AI & Cloud Summit 2026',
    category: 'Conferences & Events',
    subtitle: 'Published · Moscone Center, SF · 1,240 Registered',
    badge: 'Published',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    path: '/organizer/events',
    icon: Calendar,
    iconBg: 'bg-emerald-50 text-emerald-600',
    keywords: ['global', 'ai', 'cloud', 'summit', 'conference', 'event', 'san francisco', 'moscone']
  },
  {
    id: 'evt-2',
    title: 'DevOps World & Platform Engineering Expo',
    category: 'Conferences & Events',
    subtitle: 'Published · Austin Convention Center · 850 Registered',
    badge: 'Upcoming',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    path: '/organizer/events',
    icon: Calendar,
    iconBg: 'bg-blue-50 text-blue-600',
    keywords: ['devops', 'world', 'platform', 'engineering', 'expo', 'austin', 'event']
  },
  {
    id: 'evt-3',
    title: 'FinTech Horizons Conference 2026',
    category: 'Conferences & Events',
    subtitle: 'Registration Active · New York, NY · 620 Registered',
    badge: 'Active',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    path: '/organizer/events',
    icon: Calendar,
    iconBg: 'bg-blue-50 text-blue-600',
    keywords: ['fintech', 'horizons', 'conference', 'new york', 'finance', 'event']
  },

  // 4. Platform Pages & Governance
  {
    id: 'nav-1',
    title: 'Platform Administration Dashboard',
    category: 'Platform Pages',
    subtitle: 'Executive KPIs, role telemetry, growth analytics & alert log',
    badge: 'Dashboard',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    path: '/admin/dashboard',
    icon: Sparkles,
    iconBg: 'bg-slate-100 text-slate-700',
    keywords: ['platform', 'admin', 'dashboard', 'telemetry', 'kpi', 'home']
  },
  {
    id: 'nav-2',
    title: 'Organization Governance & Verification',
    category: 'Platform Pages',
    subtitle: 'Manage multi-tenant organizations, plans, and compliance',
    badge: 'Admin',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    path: '/admin/organizations',
    icon: Building2,
    iconBg: 'bg-blue-50 text-blue-600',
    keywords: ['organizations', 'governance', 'tenants', 'verify']
  },
  {
    id: 'nav-3',
    title: 'Platform Users Directory',
    category: 'Platform Pages',
    subtitle: 'System roles, access rights, identity verification and accounts',
    badge: 'Admin',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    path: '/admin/users',
    icon: Users,
    iconBg: 'bg-purple-50 text-purple-600',
    keywords: ['users', 'roles', 'accounts', 'directory', 'permissions']
  },
  {
    id: 'nav-4',
    title: 'Platform System Settings',
    category: 'Platform Pages',
    subtitle: 'Multi-tenant configurations, security policies, and integrations',
    badge: 'Settings',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    path: '/admin/settings',
    icon: Settings,
    iconBg: 'bg-slate-100 text-slate-700',
    keywords: ['settings', 'system', 'security', 'configuration', 'api']
  },
  {
    id: 'nav-5',
    title: 'Subscriptions & Plan Governance',
    category: 'Platform Pages',
    subtitle: 'Manage subscription tiers, limits, and organization renewals',
    badge: 'Admin',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    path: '/admin/subscriptions',
    icon: CreditCard,
    iconBg: 'bg-emerald-50 text-emerald-600',
    keywords: ['subscriptions', 'plans', 'pricing', 'billing', 'revenue', 'tiers', 'renewal']
  },
  {
    id: 'nav-6',
    title: 'Audit Logs & Security Ledger',
    category: 'Platform Pages',
    subtitle: 'Immutable record of all platform activities, actors, and state mutations',
    badge: 'Security',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    path: '/admin/audit-logs',
    icon: ShieldCheck,
    iconBg: 'bg-blue-50 text-blue-600',
    keywords: ['audit', 'logs', 'activity', 'security', 'ledger', 'history', 'events', 'compliance']
  },
  {
    id: 'nav-7',
    title: 'Platform Analytics & Telemetry',
    category: 'Platform Pages',
    subtitle: 'Platform performance, role distributions, growth charts and attendance rates',
    badge: 'Insights',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    path: '/admin/analytics',
    icon: BarChart3,
    iconBg: 'bg-indigo-50 text-indigo-600',
    keywords: ['analytics', 'charts', 'growth', 'attendance', 'metrics', 'trends', 'insights', 'telemetry']
  }
];

const SEARCH_CATEGORIES = ['All', 'Organizations', 'Platform Users', 'Conferences & Events', 'Platform Pages'];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { liveAnnouncements } = useSocket();
  const navigate = useNavigate();

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationService.getAll();
      if (res.success && res.data.notifications) {
        setNotifications(res.data.notifications);
        if (res.data.unreadCount !== undefined) setUnreadCount(res.data.unreadCount);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (liveAnnouncements.length > 0) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [liveAnnouncements]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to dismiss search popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtered search results
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filteredResults = SEARCHABLE_ENTITIES.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!trimmedQuery) return true; // Show all / quick picks if no text

    const titleMatch = item.title.toLowerCase().includes(trimmedQuery);
    const subtitleMatch = item.subtitle.toLowerCase().includes(trimmedQuery);
    const categoryMatch = item.category.toLowerCase().includes(trimmedQuery);
    const keywordMatch = item.keywords.some((kw) => kw.toLowerCase().includes(trimmedQuery));

    return titleMatch || subtitleMatch || categoryMatch || keywordMatch;
  });

  // Group results by category
  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleSelectResult = (item) => {
    navigate(item.path);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
  };

  const handleClearSearch = (e) => {
    e.stopPropagation();
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 h-16">
      <div className="w-full px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center space-x-3 shrink-0">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Event<span className="text-blue-600">Forge</span>
            </span>
          </Link>
          {user?.role === 'organizer' ? (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Apex Global Events</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          ) : (
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/80">
              Enterprise
            </span>
          )}
        </div>

        {/* Center: Search Field & Spotlight Palette (Desktop & Tablet) */}
        {user && (
          <div ref={searchContainerRef} className="hidden md:flex items-center max-w-lg w-full relative mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder={user?.role === 'organizer' ? "Search events, sessions, speakers..." : "Search organizations, users, events, settings..."}
                className="w-full pl-9 pr-20 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <kbd className="text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Spotlight Dropdown Palette */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200/90 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 px-3 pb-2 border-b border-slate-100 overflow-x-auto no-scrollbar">
                  {SEARCH_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Results Container */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/80">
                  {filteredResults.length === 0 ? (
                    <div className="p-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        No results found for "{searchQuery}"
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                        Try searching for an organization name, team member, conference, or system page.
                      </p>
                    </div>
                  ) : (
                    Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category} className="py-1.5">
                        <div className="px-3 py-1 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>{category}</span>
                          <span className="font-medium text-slate-400">{items.length}</span>
                        </div>
                        <div className="px-1.5 space-y-0.5">
                          {items.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleSelectResult(item)}
                                className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-blue-50/60 rounded-lg text-left transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                                    <IconComponent className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 truncate">
                                        {item.title}
                                      </span>
                                      {item.badge && (
                                        <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                      {item.subtitle}
                                    </p>
                                  </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 shrink-0 ml-2" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer bar */}
                <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center space-x-3">
                    <span>Press <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">ESC</kbd> to exit</span>
                    <span>Press <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↵</kbd> to select</span>
                  </div>
                  <span className="text-blue-600 font-medium">Spotlight Quick Search</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right: Search Toggle (Mobile), Notifications & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-auto">
          {user ? (
            <>
              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setIsMobileSearchOpen(true);
                  setTimeout(() => mobileInputRef.current?.focus(), 50);
                }}
                className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-lg border border-slate-200/80 py-2.5 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-3.5 pb-2 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900 tracking-tight">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100/80 text-xs">
                      <div className="p-3 hover:bg-slate-50/70 transition-colors bg-blue-50/20">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-semibold text-slate-900">Organization approval required</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        </div>
                        <p className="text-slate-500 text-[11px]">2 tenant organizations require review and activation.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">5 min ago</span>
                      </div>
                      <div className="p-3 hover:bg-slate-50/70 transition-colors bg-blue-50/20">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-semibold text-slate-900">Subscription expiring</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                        <p className="text-slate-500 text-[11px]">Apex Global Events subscription renewal due in 3 days.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">25 min ago</span>
                      </div>
                      <div className="p-3 hover:bg-slate-50/70 transition-colors">
                        <p className="font-semibold text-slate-900 mb-0.5">New organizer registered</p>
                        <p className="text-slate-500 text-[11px]">Rahul Kumar registered under Nexus Tech Summits.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                      </div>
                    </div>
                    <div className="pt-2 px-3 border-t border-slate-100 text-center">
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="w-full py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className={`w-7 h-7 rounded-full ${user.role === 'organizer' ? 'bg-blue-600' : 'bg-slate-900'} text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs`}>
                    {user?.name ? (user.name.toLowerCase().includes('vishnu') ? 'VR' : user.name.slice(0, 2).toUpperCase()) : 'VR'}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-semibold text-slate-900 leading-tight">
                      {user?.name || 'Vishnureddy'}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      {user.role === 'admin' ? 'Platform Admin' : user.role === 'organizer' ? 'EVENT ORGANIZER' : user.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1.5 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user?.name || 'Vishnureddy'}</p>
                      <p className="text-slate-500 truncate text-[11px]">{user?.email || "mvishnuvardhanreddy33@gmail.com"}</p>
                      <span className="mt-1.5 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                        {user.role === 'admin' ? 'Platform Admin' : user.role === 'organizer' ? 'EVENT ORGANIZER' : user.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5">
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Spotlight Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col md:hidden p-3">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-3 border-b border-slate-200 flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search organizations, users, events..."
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 overflow-x-auto">
              {SEARCH_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {filteredResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No matching results found.
                </div>
              ) : (
                filteredResults.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
