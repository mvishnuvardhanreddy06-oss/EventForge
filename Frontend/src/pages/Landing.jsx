import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  Wand2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/api';

const MODULES = [
  {
    title: 'Events',
    desc: 'Create conferences, workshops, exhibitions or private corporate events from a template.'
  },
  {
    title: 'Venues',
    desc: 'Compare capacity, rooms, availability and costs, then attach the venue to your event.'
  },
  {
    title: 'Speakers',
    desc: 'Invite speakers, collect bios and slides, and track who has confirmed.'
  },
  {
    title: 'Sessions',
    desc: 'Drag sessions into rooms and time slots. Conflicts are flagged as you go.'
  },
  {
    title: 'Sponsors',
    desc: 'Manage packages, logos, booths and payments for every sponsor.'
  },
  {
    title: 'Registrations and tickets',
    desc: 'Sell tiered tickets, apply promo codes, scan QR codes at the door.'
  },
  {
    title: 'Staff assignments',
    desc: 'Assign staff and volunteers to rooms and shifts, and share their rota.'
  },
  {
    title: 'Attendee communication',
    desc: 'Send reminders, schedule changes and post-event surveys by email or SMS.'
  }
];

const DEFAULT_EVENTS = [
  {
    id: 'ev-devsummit',
    date: '14 Oct',
    duration: '2 days',
    title: 'DevSummit 2026',
    meta: 'Conference · Hyderabad · 1,200 registered · 48 sessions',
    category: 'Conference'
  },
  {
    id: 'ev-design',
    date: '29 Oct',
    duration: '1 day',
    title: 'Product Design Workshop',
    meta: 'Workshop · Bengaluru · 86 of 100 seats taken',
    category: 'Workshop'
  },
  {
    id: 'ev-greenbuild',
    date: '12 Nov',
    duration: '3 days',
    title: 'Green Build Expo',
    meta: 'Exhibition · Mumbai · 64 exhibitors · 9 sponsors',
    category: 'Exhibition'
  }
];

const TICKET_TIERS = [
  {
    name: 'General',
    price: '₹1,999',
    features: ['All talks', 'Expo access', 'Lunch'],
    featured: false
  },
  {
    name: 'Workshop pass',
    price: '₹4,499',
    features: ['Everything in General', 'Two hands-on workshops', 'Recordings'],
    featured: true
  },
  {
    name: 'Team of 5',
    price: '₹8,999',
    features: ['Five General tickets', 'Reserved seating', 'One invoice'],
    featured: false
  }
];

const SESSION_CATALOG = [
  { title: 'AI for customer support', tags: ['AI', 'Support'] },
  { title: 'Design systems at scale', tags: ['Design'] },
  { title: 'Cutting cloud costs', tags: ['Cloud'] },
  { title: 'Building a growth loop', tags: ['Marketing'] },
  { title: 'Leading remote teams', tags: ['Leadership'] },
  { title: 'Shipping AI features safely', tags: ['AI', 'Cloud'] }
];

const ALL_TOPICS = ['AI', 'Design', 'Cloud', 'Marketing', 'Leadership'];

const DEMO_ROLES = [
  { label: 'Admin', email: 'admin@eventforge.io', path: '/admin/dashboard', desc: 'Platform control & subscriptions' },
  { label: 'Organizer', email: 'organizer@apexevents.com', path: '/organizer/dashboard', desc: 'Manage events, sponsors & staff' },
  { label: 'Staff', email: 'staff1@apexevents.com', path: '/staff/dashboard', desc: 'Attendance & QR scanner' },
  { label: 'Speaker', email: 'speaker1@eventforge.io', path: '/speaker/dashboard', desc: 'Keynotes & session materials' },
  { label: 'Sponsor', email: 'sponsor1@eventforge.io', path: '/sponsor/dashboard', desc: 'Invoices, assets & deliverables' },
  { label: 'Attendee', email: 'attendee1@example.com', path: '/attendee/dashboard', desc: 'Browse, register & QR badge' }
];

const Landing = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Dark/Light mode theme state
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      console.error('Failed to set theme:', e);
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // AI draft state
  const [draftName, setDraftName] = useState('DevSummit 2026');
  const [draftType, setDraftType] = useState('conference');
  const [draftAudience, setDraftAudience] = useState('software engineers and product teams');
  const [draftOutput, setDraftOutput] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Topic filter state for AI recommendations
  const [activeTopics, setActiveTopics] = useState({ AI: true, Cloud: true });

  const toggleTopic = (topic) => {
    setActiveTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  // Compute re-ranked sessions
  const rankedSessions = SESSION_CATALOG.map(session => {
    const matches = session.tags.filter(tag => activeTopics[tag]).length;
    return { ...session, matchCount: matches };
  }).sort((a, b) => b.matchCount - a.matchCount);

  // Draft generator
  const handleDraft = () => {
    setIsDrafting(true);
    setTimeout(() => {
      const name = draftName.trim() || 'Your event';
      const type = draftType;
      const audience = draftAudience.trim() || 'your target audience';
      const generated = `${name} is an enterprise-grade ${type} built for ${audience}.\n\nJoin us for practical sessions, hands-on learning, and direct access to pioneering engineering and product leaders. You will leave with actionable playbooks, verified contacts, and clear next steps.\n\nRegister early to reserve your session tracks and lock in early-bird pass rates.`;
      setDraftOutput(generated);
      setIsDrafting(false);
    }, 250);
  };

  const handleCopyDraft = () => {
    if (!draftOutput) return;
    navigator.clipboard.writeText(draftOutput);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Real events from DB with fallback to template events
  const [dbEvents, setDbEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const res = await eventService.getAll({ limit: 4 });
        const list = res?.data?.events || res?.events || [];
        if (Array.isArray(list) && list.length > 0) {
          setDbEvents(list);
        }
      } catch (err) {
        console.error('Failed to load events from API:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Quick 1-click test login for development/demo
  const [roleLoggingIn, setRoleLoggingIn] = useState(null);
  const handleQuickLogin = async (email, path) => {
    try {
      setRoleLoggingIn(email);
      await login(email, 'Password123!');
      navigate(path);
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setRoleLoggingIn(null);
    }
  };

  return (
    <div className="bg-bg font-sans text-base leading-relaxed text-ink min-h-screen transition-colors duration-200">
      {/* Quick Role Tester Bar (Top Utility Banner) */}
      <div className="bg-surface border-b border-line px-4 py-2 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-muted font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-ink">Role Testing Bar:</span>
            <span>Switch workspace instantly:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {DEMO_ROLES.map(r => (
              <button
                key={r.label}
                onClick={() => handleQuickLogin(r.email, r.path)}
                disabled={roleLoggingIn === r.email}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-line bg-bg hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                title={`${r.desc} (${r.email})`}
              >
                {roleLoggingIn === r.email ? 'Logging in...' : r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-5">
          <a href="#top" className="flex items-center gap-2 font-display text-xl font-bold text-ink">
            <i className="h-[22px] w-[22px] rounded-[7px_7px_7px_2px] bg-accent inline-block"></i>
            <span>EventForge</span>
          </a>

          <nav className="ml-auto hidden gap-6 text-[.95rem] font-medium text-muted md:flex">
            <a className="hover:text-ink transition-colors" href="#features">Features</a>
            <a className="hover:text-ink transition-colors" href="#ai">AI tools</a>
            <a className="hover:text-ink transition-colors" href="#events">Events</a>
            <a className="hover:text-ink transition-colors" href="#tickets">Tickets</a>
          </nav>

          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <button
              onClick={toggleTheme}
              className="btn text-xs font-semibold px-3 py-1.5"
              aria-label="Switch color theme"
            >
              {isDark ? <span>☀ Light</span> : <span>☾ Dark</span>}
            </button>

            {user ? (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : user.role === 'organizer' ? '/organizer/dashboard' : user.role === 'staff' ? '/staff/dashboard' : user.role === 'speaker' ? '/speaker/dashboard' : user.role === 'sponsor' ? '/sponsor/dashboard' : '/attendee/dashboard')}
                className="btn btn-primary"
              >
                Go to Workspace
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary hidden md:inline-flex">
                Create an event
              </Link>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-12 pt-16 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h1 className="font-display text-[clamp(2.3rem,5.5vw,4rem)] font-bold leading-[1.1] tracking-tight text-ink">
              Build the whole program, not just the guest list.
            </h1>
            <p className="mb-7 mt-5 max-w-[46ch] text-lg text-muted">
              EventForge helps companies and event agencies plan conferences, workshops, exhibitions and corporate events. Venues, speakers, sessions, sponsors, tickets and staff live in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary">
                Start planning
              </Link>
              <a href="#ai" className="btn">
                Try the AI tools
              </a>
            </div>
          </div>

          {/* Schedule Board Widget */}
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface p-5 shadow-sm" aria-label="Sample conference schedule">
            <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-ink">DevSummit 2026 · Day 1</h3>
              <span className="text-muted text-xs font-medium">Hyderabad Convention Centre</span>
            </div>

            <div className="grid min-w-[420px] grid-cols-[44px_repeat(3,minmax(96px,1fr))] gap-1.5 text-[13px]">
              <span></span>
              <span className="px-1 pb-1 font-semibold text-muted">Main hall</span>
              <span className="px-1 pb-1 font-semibold text-muted">Room A</span>
              <span className="px-1 pb-1 font-semibold text-muted">Room B</span>

              <span className="pt-1.5 text-muted font-mono text-xs">9:00</span>
              <div className="slot">
                <b>Opening keynote</b>
                <small>Ananya Rao</small>
              </div>
              <div className="slot" style={{ '--c': 'var(--gold)' }}>
                <b>Design systems</b>
                <small>Workshop</small>
              </div>
              <div className="slot" style={{ '--c': 'var(--teal)' }}>
                <b>Cloud costs</b>
                <small>Talk</small>
              </div>

              <span className="pt-1.5 text-muted font-mono text-xs">10:30</span>
              <div className="slot">
                <b>Scaling APIs</b>
                <small>Panel</small>
              </div>
              <div className="slot outline-2 outline-offset-2 outline-dashed outline-gold" style={{ '--c': 'var(--gold)' }}>
                <b>AI for support</b>
                <small>Recommended</small>
              </div>
              <div className="slot" style={{ '--c': 'var(--teal)' }}>
                <b>Sponsor demo</b>
                <small>Northwind</small>
              </div>

              <span className="pt-1.5 text-muted font-mono text-xs">12:00</span>
              <div className="slot" style={{ '--c': 'var(--gold)' }}>
                <b>Lunch and expo</b>
                <small>Hall 2</small>
              </div>
              <div className="slot" style={{ '--c': 'var(--teal)' }}>
                <b>Hiring in tech</b>
                <small>Fireside</small>
              </div>
              <div className="slot">
                <b>Closing talk</b>
                <small>Main hall</small>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted pt-2 border-t border-line">
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-sm bg-accent inline-block"></i>
                Keynotes
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-sm bg-gold inline-block"></i>
                Workshops
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-sm bg-teal inline-block"></i>
                Talks
              </span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-[72px]">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-9 max-w-[60ch]">
              <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-bold leading-[1.1] tracking-tight text-ink">
                Everything an event needs, in one workspace
              </h2>
              <p className="mt-3 text-muted">
                Each part connects to the others, so a speaker change updates the schedule, the tickets and the attendee emails.
              </p>
            </div>

            <div className="grid gap-x-14 md:grid-cols-2">
              {MODULES.map((mod, idx) => (
                <div key={idx} className="border-t border-line py-5">
                  <h3 className="font-display text-lg font-semibold text-ink">{mod.title}</h3>
                  <p className="mt-1.5 text-muted text-sm leading-relaxed">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Tools Section */}
        <section id="ai" className="pb-12 md:pb-[72px]">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-9 max-w-[60ch]">
              <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-bold leading-[1.1] tracking-tight text-ink">
                AI that does the first draft for you
              </h2>
              <p className="mt-3 text-muted">
                Organizers get a starting point for event copy. Attendees get sessions that match what they care about.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Panel 1: Draft event content */}
              <div className="panel flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-lg font-semibold text-ink">Draft event content</h3>
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-muted text-sm">Enter a few details and get a description you can edit.</p>

                  <div className="mt-4 space-y-3.5">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-ink uppercase tracking-wider">
                        Event name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="field"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder="e.g. Global Tech Summit"
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="mb-1.5 block text-xs font-bold text-ink uppercase tracking-wider">
                        Event type
                      </label>
                      <select
                        id="type"
                        className="field bg-surface cursor-pointer"
                        value={draftType}
                        onChange={(e) => setDraftType(e.target.value)}
                      >
                        <option value="conference">conference</option>
                        <option value="workshop">workshop</option>
                        <option value="exhibition">exhibition</option>
                        <option value="corporate offsite">corporate offsite</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="aud" className="mb-1.5 block text-xs font-bold text-ink uppercase tracking-wider">
                        Audience
                      </label>
                      <input
                        id="aud"
                        type="text"
                        className="field"
                        value={draftAudience}
                        onChange={(e) => setDraftAudience(e.target.value)}
                        placeholder="e.g. software engineers and product teams"
                      />
                    </div>
                  </div>

                  <div className="my-4 flex items-center justify-between">
                    <button
                      id="draft"
                      onClick={handleDraft}
                      disabled={isDrafting}
                      className="btn btn-primary"
                    >
                      {isDrafting ? 'Drafting copy...' : 'Draft description'}
                    </button>

                    {draftOutput && (
                      <button
                        onClick={handleCopyDraft}
                        className="btn text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5"
                      >
                        {copiedDraft ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy draft</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    id="out"
                    className="field min-h-[150px] resize-y font-sans text-sm leading-relaxed"
                    aria-label="Drafted description"
                    placeholder="Your drafted description will appear here..."
                    value={draftOutput}
                    onChange={(e) => setDraftOutput(e.target.value)}
                  />
                </div>
              </div>

              {/* Panel 2: Recommended sessions */}
              <div className="panel flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-lg font-semibold text-ink">Recommended sessions</h3>
                    <span className="text-[11px] font-bold text-teal px-2 py-0.5 rounded-full bg-teal/10">Dynamic Ranker</span>
                  </div>
                  <p className="text-muted text-sm">Pick the topics an attendee likes and the list re-ranks automatically.</p>

                  <div id="chips" className="my-4 flex flex-wrap gap-2">
                    {ALL_TOPICS.map(topic => {
                      const isPressed = Boolean(activeTopics[topic]);
                      return (
                        <button
                          key={topic}
                          type="button"
                          className="chip"
                          aria-pressed={isPressed}
                          onClick={() => toggleTopic(topic)}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <ul id="recs" className="space-y-0.5 divide-y divide-line">
                  {rankedSessions.map((session, sIdx) => (
                    <li key={sIdx} className="flex items-center justify-between gap-3 py-3">
                      <span className="text-sm font-medium text-ink">{session.title}</span>
                      <span className="whitespace-nowrap text-xs font-semibold text-teal font-mono">
                        {session.matchCount > 0 ? `${session.matchCount} topic match${session.matchCount > 1 ? 'es' : ''}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="pb-12 md:pb-[72px]">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-9 max-w-[60ch]">
              <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-bold leading-[1.1] tracking-tight text-ink">
                Upcoming events
              </h2>
              <p className="mt-3 text-muted">
                A sample of how organizers see their events at a glance.
              </p>
            </div>

            <div className="border-t border-line">
              {/* If we have database events, show them; otherwise fallback to template sample events */}
              {dbEvents.length > 0 ? (
                dbEvents.map((ev) => {
                  const evDate = ev.startDate ? new Date(ev.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Upcoming';
                  const daysDuration = ev.startDate && ev.endDate ? Math.max(1, Math.round((new Date(ev.endDate) - new Date(ev.startDate)) / (1000 * 60 * 60 * 24))) : 1;
                  return (
                    <div
                      key={ev._id}
                      className="grid items-center gap-5 border-b border-line py-5 md:grid-cols-[120px_1fr_auto]"
                    >
                      <div className="font-display text-2xl font-bold leading-none text-ink">
                        {evDate}
                        <small className="mt-1 block font-sans text-xs font-medium text-muted">
                          {daysDuration} day{daysDuration > 1 ? 's' : ''}
                        </small>
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-ink">{ev.title}</h3>
                        <p className="text-muted text-sm mt-0.5">
                          {ev.eventType || 'Conference'} · {ev.venueId?.name || ev.venueId?.city || 'Bengaluru'} · {ev.capacity || 500} capacity · {ev.category || 'Tech'}
                        </p>
                      </div>
                      <Link
                        to={`/attendee/events/${ev._id}`}
                        className="btn text-xs font-semibold px-4 py-2 hover:border-accent"
                      >
                        Register
                      </Link>
                    </div>
                  );
                })
              ) : (
                DEFAULT_EVENTS.map((e) => (
                  <div
                    key={e.id}
                    className="grid items-center gap-5 border-b border-line py-5 md:grid-cols-[120px_1fr_auto]"
                  >
                    <div className="font-display text-2xl font-bold leading-none text-ink">
                      {e.date}
                      <small className="mt-1 block font-sans text-xs font-medium text-muted">
                        {e.duration}
                      </small>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">{e.title}</h3>
                      <p className="text-muted text-sm mt-0.5">{e.meta}</p>
                    </div>
                    <a href="#tickets" className="btn text-xs font-semibold px-4 py-2 hover:border-accent">
                      Manage
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Tickets Section */}
        <section id="tickets" className="pb-12 md:pb-[72px]">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-9 max-w-[60ch]">
              <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-bold leading-[1.1] tracking-tight text-ink">
                Ticket tiers your attendees can choose from
              </h2>
              <p className="mt-3 text-muted">
                Set prices, limits and early-bird dates for each tier.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3" id="tiers">
              {TICKET_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl bg-surface p-6 flex flex-col justify-between ${
                    tier.featured ? 'border-2 border-accent shadow-md relative' : 'border border-line shadow-sm'
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-accent text-onaccent text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{tier.name}</h3>
                    <div className="my-3 font-display text-4xl font-bold text-ink">{tier.price}</div>
                    <ul className="mb-6 list-disc pl-5 text-muted text-sm space-y-1.5">
                      {tier.features.map((item, fIdx) => (
                        <li key={fIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/register"
                    className={`btn w-full text-center ${tier.featured ? 'btn-primary' : ''}`}
                  >
                    Select
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-8 text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between items-center gap-4 px-5">
          <div className="flex items-center gap-2">
            <i className="h-4 w-4 rounded-sm bg-accent inline-block"></i>
            <span className="font-semibold text-ink">EventForge</span>
            <span>· © 2026 EventForge — Corporate Event &amp; Conference Management.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Switch between light and dark with the button at the top.</span>
            <a href="#top" className="hover:text-ink transition-colors font-medium">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
