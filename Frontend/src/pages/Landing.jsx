import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  ShieldCheck,
  Zap,
  Check,
  QrCode,
  BarChart3,
  Bot,
  Building2,
  Ticket,
  Award,
  ChevronRight,
  AlertTriangle,
  Copy,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [events, setEvents] = useState([]);
  const [previewTab, setPreviewTab] = useState('schedule'); // 'schedule' | 'ai' | 'qr' | 'analytics'
  const [copied, setCopied] = useState(false);
  const [roleLoginLoading, setRoleLoginLoading] = useState(null);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const res = await eventService.getAll({ limit: 3 });
        if (res.success && res.data.events) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error('Failed to load featured events', err);
      }
    };
    fetchFeaturedEvents();
  },
  []);

  const handleRoleQuickLogin = async (email, rolePath) => {
    try {
      setRoleLoginLoading(email);
      await login({ email, password: 'Password123!' });
      navigate(rolePath);
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setRoleLoginLoading(null);
    }
  };

  const handleCopyAI = () => {
    navigator.clipboard.writeText(
      "Global AI & Cloud Summit 2026 brings together pioneering researchers, enterprise architects, and engineering leaders shaping generative AI, agentic systems, and hyperscale cloud infrastructure."
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-slate-900 font-sans">
      {/* 1. TOP NAVBAR (Matching Reference Style) */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#0891b2] flex items-center justify-center text-white shadow-md shadow-cyan-900/10 transition-transform group-hover:scale-105">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-950 uppercase">
                EVENT<span className="text-[#0891b2]">FORGE</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#0891b2] uppercase -mt-0.5">
                AI CORPORATE EVENT PLATFORM
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-950 transition-colors">Why EventForge</a>
            <a href="#preview" className="hover:text-slate-950 transition-colors">Platform Copilot</a>
            <a href="#events" className="hover:text-slate-950 transition-colors">Conferences</a>
            <a href="#roles" className="hover:text-slate-950 transition-colors">Workspaces</a>
            <Link to="/login" className="hover:text-slate-950 transition-colors">Log in</Link>
          </nav>

          {/* Right CTA Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'organizer' ? '/organizer/dashboard' : user.role === 'staff' ? '/staff/checkin' : user.role === 'speaker' ? '/speaker/dashboard' : user.role === 'sponsor' ? '/sponsor/dashboard' : '/attendee/dashboard'}
                className="bg-[#0891b2] hover:bg-[#0e7490] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all inline-flex items-center space-x-2"
              >
                <span>Dashboard ({user.name.split(' ')[0]})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-[#0891b2] hover:bg-[#0e7490] text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all inline-flex items-center space-x-2"
              >
                <span>Start Organizing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Identical structure & typography to reference image) */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Top AI Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold shadow-sm mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#0891b2]" />
          <span className="tracking-wider uppercase font-bold text-[11px]">
            YOUR AI-POWERED ENTERPRISE EVENT PLATFORM
          </span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08]">
          Plan smarter.<br />
          <span className="text-[#0891b2] tracking-tight">
            Know what your event actually needs.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          EventForge uses AI to orchestrate multi-track corporate conferences, eliminate schedule conflicts, generate executive copy, automate QR check-ins, and deliver real-time operational clarity.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-[#0891b2] hover:bg-[#0e7490] text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-md shadow-cyan-900/10 transition-all inline-flex items-center justify-center space-x-2.5"
          >
            <span>Start Organizing</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#preview"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base px-7 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all inline-flex items-center justify-center space-x-2.5"
          >
            <span>See How It Works</span>
            <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
          </a>
        </div>

        {/* Trust Badges / Key Capabilities (Identical checklist format) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-600">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Zero-Conflict Schedule Engine</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-600">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Generative AI Studio & Bios</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-600">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Instant QR Badging & Waitlists</span>
          </div>
        </div>

        {/* 3. FLOATING APP PREVIEW CARD (Exact visual representation of the reference screenshot) */}
        <div id="preview" className="mt-14 max-w-4xl mx-auto text-left">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-cyan-950/5 p-6 sm:p-8 relative overflow-hidden transition-all">
            {/* Top Widget Bar inside card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              {/* Left AI Active Copilot Badge */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#0891b2] flex items-center justify-center text-white shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">AI Event Copilot</h4>
                  <p className="text-xs text-cyan-700 font-medium">Analyzing 24 sessions across 3 conference tracks...</p>
                </div>
              </div>

              {/* Right Stats & Mastery Badges (Matching reference pill styles) */}
              <div className="flex items-center space-x-2.5">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>98.4% Check-In Rate</span>
                </div>
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#0891b2]" />
                  <span>100% Conflict-Free</span>
                </div>
              </div>
            </div>

            {/* Feature Tabs Selector */}
            <div className="mt-5 flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold">
              <button
                onClick={() => setPreviewTab('schedule')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  previewTab === 'schedule'
                    ? 'bg-[#0891b2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Schedule Conflict Engine
              </button>
              <button
                onClick={() => setPreviewTab('ai')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  previewTab === 'ai'
                    ? 'bg-[#0891b2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                AI Studio Generator
              </button>
              <button
                onClick={() => setPreviewTab('qr')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  previewTab === 'qr'
                    ? 'bg-[#0891b2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                QR Attendee Pass
              </button>
              <button
                onClick={() => setPreviewTab('analytics')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  previewTab === 'analytics'
                    ? 'bg-[#0891b2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Live Operations Matrix
              </button>
            </div>

            {/* TAB 1: SCHEDULE CONFLICT RESOLVER (Exact Card Style from Reference) */}
            {previewTab === 'schedule' && (
              <div className="mt-4 space-y-4">
                <div className="bg-cyan-50/50 border border-cyan-200/90 rounded-2xl p-5 sm:p-6 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-800">
                      SCHEDULE OVERLAP PREVENTED
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                      High Priority • Resolved
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 mt-2">
                    Keynote: Scalable Enterprise AI & Cloud Governance
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Automated conflict resolver relocated Room B overlap to Silicon Horizon Main Hall at 10:00 AM. 0 speaker conflicts detected across 24 agenda sessions.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                      📍 Silicon Horizon Main Hall
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                      👤 Dr. Elena Rostova
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                      👥 480 / 500 Seats
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-cyan-700 font-bold">
                      ⏱ 10:00 AM – 11:30 AM
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Breakout: Distributed Microservices</div>
                      <div className="text-slate-500">Room 102 • Marcus Sterling • 11:45 AM</div>
                    </div>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Verified
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Workshop: Zero-Trust Kubernetes</div>
                      <div className="text-slate-500">Innovation Lab • Sophia Chen • 01:15 PM</div>
                    </div>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI STUDIO GENERATOR */}
            {previewTab === 'ai' && (
              <div className="mt-4 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-cyan-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>GOOGLE GEMINI GENERATIVE ENGINE</span>
                  </div>
                  <button
                    onClick={handleCopyAI}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Draft'}</span>
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-xs font-mono">
                  <div className="text-cyan-300 font-bold">
                    # Global AI & Cloud Summit 2026
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    The premier worldwide conference uniting pioneering researchers, enterprise architects, and engineering leaders shaping generative AI, agentic systems, and hyperscale cloud infrastructure.
                  </p>
                  <div className="text-slate-400 text-[11px] pt-2">
                    ✦ Generated in 410ms • Executive tone • Audience: Enterprise Architects & CTOs
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: QR ATTENDEE PASS */}
            {previewTab === 'qr' && (
              <div className="mt-4 p-5 rounded-2xl border border-cyan-200 bg-cyan-50/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-900" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-600 text-white">
                      VIP EXECUTIVE PASS
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">Vishnureddy</h4>
                    <p className="text-xs text-slate-500">Global AI & Cloud Summit 2026</p>
                    <p className="text-[11px] text-cyan-700 font-mono mt-1">Token: EF-2026-VIP-9941</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center space-x-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Checked In at 09:42 AM</span>
                  </span>
                </div>
              </div>
            )}

            {/* TAB 4: LIVE OPERATIONS MATRIX */}
            {previewTab === 'analytics' && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xs text-slate-500 font-semibold">Total Registered</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">4,820</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-1">↑ 24% vs target</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xs text-slate-500 font-semibold">Attendance Rate</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">81.7%</div>
                  <div className="text-[11px] text-cyan-600 font-bold mt-1">3,938 badges scanned</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xs text-slate-500 font-semibold">Gross Ticketing</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">$142.5K</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-1">Sold Out in 4 days</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xs text-slate-500 font-semibold">Waitlist Queue</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">142</div>
                  <div className="text-[11px] text-amber-600 font-bold mt-1">Auto FIFO enabled</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. SIX-ROLE ENTERPRISE WORKSPACES & 1-CLICK TEST LOGIN */}
      <section id="roles" className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0891b2]">
              ENTERPRISE MULTI-ROLE GOVERNANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-1 tracking-tight">
              Built for every conference stakeholder
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Experience the platform from any viewpoint. Click any role below to launch its tailored operational workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {/* Role 1: Platform Admin */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0891b2]/50 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Platform Admin</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Tenant organization provisioning, platform health analytics, user permission controls, and global subscription tiers.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin('mvishnuvardhanreddy33@gmail.com', '/admin/dashboard')}
                disabled={roleLoginLoading === 'mvishnuvardhanreddy33@gmail.com'}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>{roleLoginLoading === 'mvishnuvardhanreddy33@gmail.com' ? 'Connecting...' : 'Launch Admin Console'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role 2: Event Organizer */}
            <div className="p-6 rounded-2xl border-2 border-[#0891b2]/30 bg-cyan-50/30 hover:bg-white hover:border-[#0891b2] hover:shadow-lg transition-all flex flex-col justify-between relative">
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#0891b2] text-white text-[10px] font-black uppercase">
                Primary Workspace
              </span>
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0891b2] text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Event Organizer</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Complete conference lifecycle, AI Studio generative copy, room conflict detector, ticket tier builder, and financial analytics.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin('organizer@nexus.io', '/organizer/dashboard')}
                disabled={roleLoginLoading === 'organizer@nexus.io'}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{roleLoginLoading === 'organizer@nexus.io' ? 'Connecting...' : 'Launch Organizer Studio'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role 3: Event Staff */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0891b2]/50 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Event Operations Staff</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ultra-fast QR camera scanner, instant badge verification, real-time check-in ledger, and session headcount counter.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin('staff1@eventforge.io', '/staff/checkin')}
                disabled={roleLoginLoading === 'staff1@eventforge.io'}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>{roleLoginLoading === 'staff1@eventforge.io' ? 'Connecting...' : 'Launch QR Check-In'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role 4: Speaker */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0891b2]/50 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Keynote Speaker</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Session schedule, talk description, slide deck material uploads, and co-speaker agenda coordination.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin('speaker1@eventforge.io', '/speaker/dashboard')}
                disabled={roleLoginLoading === 'speaker1@eventforge.io'}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>{roleLoginLoading === 'speaker1@eventforge.io' ? 'Connecting...' : 'Launch Speaker Hub'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role 5: Attendee */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0891b2]/50 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-4">
                  <Ticket className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Conference Attendee</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Personalized AI session matching, coupon-enabled ticket checkout, interactive calendar, and digital QR badge pass.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin('attendee1@example.com', '/attendee/dashboard')}
                disabled={roleLoginLoading === 'attendee1@example.com'}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>{roleLoginLoading === 'attendee1@example.com' ? 'Connecting...' : 'Launch Attendee Experience'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role 6: Corporate Sponsor */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0891b2]/50 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Corporate Sponsor</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Sponsorship tier benefits, brand asset upload center, booth deliverable tracker with live progress bar.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin('sponsor1@eventforge.io', '/sponsor/dashboard')}
                disabled={roleLoginLoading === 'sponsor1@eventforge.io'}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>{roleLoginLoading === 'sponsor1@eventforge.io' ? 'Connecting...' : 'Launch Sponsor Portal'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEEDED CONFERENCES SHOWCASE */}
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0891b2]">
              FEATURED CONFERENCES
            </span>
            <h2 className="text-3xl font-black text-slate-950 mt-1 tracking-tight">
              Live corporate summits on EventForge
            </h2>
          </div>
          <Link
            to="/login"
            className="mt-4 sm:mt-0 text-sm font-bold text-[#0891b2] hover:text-[#0e7490] flex items-center gap-1"
          >
            <span>Browse all conferences</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((ev) => (
              <div
                key={ev._id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-[#0891b2]/60 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-1 rounded-full font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                      {ev.eventType || 'Conference'}
                    </span>
                    <span className="text-slate-500 font-medium">
                      Capacity: {ev.capacity || 500}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-snug line-clamp-2">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-[#0891b2]" />
                      <span>{new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[#0891b2]" />
                      <span>{ev.venueId?.name || 'Convention Center'}, {ev.venueId?.city || 'San Francisco'}</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">
                    {ev.tags?.slice(0, 2).map(t => `#${t}`).join(' ')}
                  </span>
                  <Link
                    to={`/attendee/events/${ev._id}`}
                    className="text-xs font-bold text-[#0891b2] hover:text-[#0e7490] inline-flex items-center gap-1"
                  >
                    <span>View Agenda</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-slate-500 text-sm">
              Loading live conferences from MongoDB...
            </div>
          )}
        </div>
      </section>

      {/* 6. CALL TO ACTION & FOOTER */}
      <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            Ready to orchestrate world-class corporate conferences?
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Join leading event producers using EventForge to automate conflict-free schedules, AI copywriting, and instant QR badges.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all inline-flex items-center justify-center space-x-2"
            >
              <span>Get Started with EventForge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#0891b2] flex items-center justify-center text-white font-bold text-xs">
              EF
            </div>
            <span className="font-extrabold text-white text-sm tracking-tight">EVENTFORGE</span>
            <span className="text-slate-500 font-medium">— Plan. Connect. Deliver.</span>
          </div>
          <div>
            © 2026 EventForge Technologies. MERN + Google Gemini AI Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
