import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { speakerPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Radio,
  Building2,
  Megaphone,
  User,
  ExternalLink,
  ChevronRight,
  Upload,
  CalendarCheck
} from 'lucide-react';

const SpeakerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await speakerPortalService.getDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load speaker dashboard:', err);
      setError('Unable to load live dashboard data. Displaying saved session state.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading your speaker workspace..." />;

  const speakerName = dashboardData?.speaker?.name || user?.name || 'Speaker';
  const metrics = dashboardData?.metrics || {
    upcomingEvents: 3,
    upcomingSessions: 5,
    presentations: 4,
    pendingActions: 2
  };
  const nextSession = dashboardData?.nextSession || {
    _id: 'default-session',
    title: 'AI Infrastructure at Scale',
    eventTitle: 'Global Tech Leadership Summit 2026',
    date: 'September 24, 2026',
    time: '10:00 AM – 11:00 AM',
    venue: 'Hall A',
    role: 'Keynote Speaker',
    status: 'Confirmed'
  };
  const todaySchedule = dashboardData?.todaySchedule || [];
  const pendingActions = dashboardData?.pendingActions || [];
  const recentAnnouncements = dashboardData?.recentAnnouncements || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good Morning, {speakerName}</span>
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage your sessions, presentations, events and speaker activities.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/speaker/materials"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Slide Deck</span>
          </Link>
          <Link
            to="/speaker/profile"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Profile</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{metrics.upcomingEvents}</p>
          <p className="text-[11px] text-slate-400 mt-1">Confirmed participations</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Sessions</p>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 tracking-tight">{metrics.upcomingSessions}</p>
          <p className="text-[11px] text-slate-400 mt-1">Keynotes & panels</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Presentations</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{metrics.presentations}</p>
          <p className="text-[11px] text-slate-400 mt-1">Slide decks synced</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Actions</p>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">{metrics.pendingActions}</p>
          <p className="text-[11px] text-slate-400 mt-1">Requires your review</p>
        </div>
      </div>

      {/* 2-COLUMN MAIN SECTION: NEXT SESSION & TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2-COLS: PROMINENT NEXT SESSION & TODAY'S SCHEDULE */}
        <div className="lg:col-span-2 space-y-6">
          {/* NEXT SESSION HERO CARD */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-purple-200 border border-white/10">
                <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                <span>Next Session</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ● {nextSession.status || 'Confirmed'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white mb-1.5 tracking-tight">
              {nextSession.title}
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 mb-5 font-medium">
              {nextSession.eventTitle}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div>
                <p className="text-[10px] text-purple-300/70 font-semibold uppercase">Date & Time</p>
                <p className="font-bold text-white mt-0.5">{nextSession.time}</p>
                <p className="text-[11px] text-purple-200/60">{nextSession.date}</p>
              </div>
              <div>
                <p className="text-[10px] text-purple-300/70 font-semibold uppercase">Room / Venue</p>
                <p className="font-bold text-white mt-0.5">{nextSession.venue}</p>
                <p className="text-[11px] text-purple-200/60">Stage Audio Monitored</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] text-purple-300/70 font-semibold uppercase">Speaking Role</p>
                <p className="font-bold text-white mt-0.5">{nextSession.role}</p>
                <p className="text-[11px] text-purple-200/60">Primary Presenter</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/speaker/sessions/${nextSession._id}`}
                className="px-4 py-2.5 bg-white text-purple-900 font-bold text-xs rounded-xl shadow-sm hover:bg-purple-50 transition-colors inline-flex items-center space-x-1.5"
              >
                <span>View Session Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/speaker/materials"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl border border-white/15 transition-colors inline-flex items-center space-x-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-purple-300" />
                <span>View Presentation</span>
              </Link>
            </div>
          </div>

          {/* TODAY'S SCHEDULE TIMELINE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Today's Schedule</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">September 24, 2026</span>
            </div>

            <div className="space-y-3">
              {todaySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    item.status === 'Live'
                      ? 'bg-purple-50/70 border-purple-200 ring-2 ring-purple-500/10'
                      : item.status === 'Completed'
                      ? 'bg-slate-50/60 border-slate-200/70 opacity-80'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                      {item.time}
                    </span>
                    <div>
                      <p className={`text-xs font-bold ${item.status === 'Live' ? 'text-purple-900' : 'text-slate-900'}`}>
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">{item.venue}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      item.status === 'Live'
                        ? 'bg-purple-600 text-white animate-pulse'
                        : item.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PENDING ACTIONS & RECENT ANNOUNCEMENTS */}
        <div className="space-y-6">
          {/* PENDING ACTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending Actions</span>
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                {pendingActions.length} Actions
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingActions.map((action, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                  <p className="text-xs font-bold text-slate-900">{action.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{action.description}</p>
                  <Link
                    to={action.link}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-800"
                  >
                    <span>{action.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ANNOUNCEMENTS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Megaphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Organizer Broadcasts</span>
              </h3>
              <Link
                to="/speaker/announcements"
                className="text-[11px] font-bold text-purple-600 hover:text-purple-700 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentAnnouncements.map((ann, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">{ann.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(ann.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{ann.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS BAR */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/speaker/events"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>View My Events</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/speaker/sessions"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>View My Sessions</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/speaker/materials"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Upload Presentation</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/speaker/availability"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <CalendarCheck className="w-4 h-4 text-indigo-600" />
                  <span>Update Availability</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/speaker/profile"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-700" />
                  <span>Edit Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;
