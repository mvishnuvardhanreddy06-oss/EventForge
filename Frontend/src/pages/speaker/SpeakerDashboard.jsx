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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            <span>Good Morning, {speakerName}</span>
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 font-medium">
            Manage your sessions, presentations, events and speaker activities.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/speaker/materials"
            className="btn-primary inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Slide Deck</span>
          </Link>
          <Link
            to="/speaker/profile"
            className="btn inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold"
          >
            <User className="w-3.5 h-3.5 text-muted" />
            <span>Profile</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-gold/10 border border-gold/30 rounded-xl text-ink text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-gold shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="panel p-4 sm:p-5 hover:border-accent/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider">Upcoming Events</p>
            <div className="p-2 bg-accent/10 text-accent rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">{metrics.upcomingEvents}</p>
          <p className="text-[11px] text-muted mt-1">Confirmed participations</p>
        </div>

        <div className="panel p-4 sm:p-5 hover:border-accent/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider">Upcoming Sessions</p>
            <div className="p-2 bg-teal/10 text-teal rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-teal tracking-tight">{metrics.upcomingSessions}</p>
          <p className="text-[11px] text-muted mt-1">Keynotes & panels</p>
        </div>

        <div className="panel p-4 sm:p-5 hover:border-accent/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider">Presentations</p>
            <div className="p-2 bg-gold/10 text-gold rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">{metrics.presentations}</p>
          <p className="text-[11px] text-muted mt-1">Slide decks synced</p>
        </div>

        <div className="panel p-4 sm:p-5 hover:border-accent/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider">Pending Actions</p>
            <div className="p-2 bg-accent/10 text-accent rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-accent tracking-tight">{metrics.pendingActions}</p>
          <p className="text-[11px] text-muted mt-1">Requires your review</p>
        </div>
      </div>

      {/* 2-COLUMN MAIN SECTION: NEXT SESSION & TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2-COLS: PROMINENT NEXT SESSION & TODAY'S SCHEDULE */}
        <div className="lg:col-span-2 space-y-6">
          {/* NEXT SESSION HERO CARD */}
          <div className="panel bg-gradient-to-br from-accent/15 via-surface to-surface p-6 sm:p-7 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="chip !bg-accent/10 !text-accent !border-accent/20">
                <Radio className="w-3 h-3 text-accent animate-pulse" />
                <span>Next Session</span>
              </span>
              <span className="chip !bg-teal/10 !text-teal !border-teal/20">
                ● {nextSession.status || 'Confirmed'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold leading-tight text-ink mb-1.5 tracking-tight">
              {nextSession.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted mb-5 font-medium">
              {nextSession.eventTitle}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-bg/50 border border-line text-xs">
              <div>
                <p className="text-[10px] text-muted font-semibold uppercase">Date & Time</p>
                <p className="font-display font-bold text-ink mt-0.5">{nextSession.time}</p>
                <p className="text-[11px] text-muted">{nextSession.date}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted font-semibold uppercase">Room / Venue</p>
                <p className="font-display font-bold text-ink mt-0.5">{nextSession.venue}</p>
                <p className="text-[11px] text-muted">Stage Audio Monitored</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] text-muted font-semibold uppercase">Speaking Role</p>
                <p className="font-display font-bold text-ink mt-0.5">{nextSession.role}</p>
                <p className="text-[11px] text-muted">Primary Presenter</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/speaker/sessions/${nextSession._id}`}
                className="btn-primary inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold"
              >
                <span>View Session Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/speaker/materials"
                className="btn inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold"
              >
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span>View Presentation</span>
              </Link>
            </div>
          </div>

          {/* TODAY'S SCHEDULE TIMELINE */}
          <div className="panel space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-display font-bold text-ink tracking-tight">Today's Schedule</h3>
              </div>
              <span className="text-xs text-muted font-medium">September 24, 2026</span>
            </div>

            <div className="space-y-3">
              {todaySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="slot !p-3.5 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="font-mono text-xs font-bold text-accent bg-bg px-2.5 py-1 rounded-lg border border-line">
                      {item.time}
                    </span>
                    <div>
                      <p className="text-xs font-display font-bold text-ink">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-muted font-medium">{item.venue}</p>
                    </div>
                  </div>
                  <span
                    className={`chip !py-0.5 !px-2.5 text-[10px] ${
                      item.status === 'Live'
                        ? '!bg-accent text-white font-bold animate-pulse'
                        : item.status === 'Completed'
                        ? '!bg-teal/10 !text-teal !border-teal/20'
                        : ''
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
          <div className="panel space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <h3 className="text-xs font-display font-bold text-ink uppercase tracking-wider flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-gold" />
                <span>Pending Actions</span>
              </h3>
              <span className="chip !py-0.5 !px-2 text-[10px] font-bold !bg-gold/10 !text-gold !border-gold/30">
                {pendingActions.length} Actions
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingActions.map((action, i) => (
                <div key={i} className="p-3 rounded-xl bg-gold/10 border border-gold/30 space-y-2">
                  <p className="text-xs font-bold text-ink">{action.title}</p>
                  <p className="text-[11px] text-muted leading-relaxed">{action.description}</p>
                  <Link
                    to={action.link}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-accent hover:underline"
                  >
                    <span>{action.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ANNOUNCEMENTS */}
          <div className="panel space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <h3 className="text-xs font-display font-bold text-ink uppercase tracking-wider flex items-center space-x-1.5">
                <Megaphone className="w-3.5 h-3.5 text-accent" />
                <span>Organizer Broadcasts</span>
              </h3>
              <Link
                to="/speaker/announcements"
                className="text-[11px] font-bold text-accent hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentAnnouncements.map((ann, i) => (
                <div key={i} className="slot !p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-display font-bold text-ink">{ann.title}</p>
                    <span className="text-[10px] text-muted font-mono">
                      {new Date(ann.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-snug line-clamp-2">{ann.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS BAR */}
          <div className="panel space-y-2.5">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/speaker/events"
                className="slot !p-2.5 flex items-center justify-between text-xs font-semibold text-ink"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>View My Events</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted" />
              </Link>

              <Link
                to="/speaker/sessions"
                className="slot !p-2.5 flex items-center justify-between text-xs font-semibold text-ink"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-teal" />
                  <span>View My Sessions</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted" />
              </Link>

              <Link
                to="/speaker/materials"
                className="slot !p-2.5 flex items-center justify-between text-xs font-semibold text-ink"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gold" />
                  <span>Upload Presentation</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted" />
              </Link>

              <Link
                to="/speaker/availability"
                className="slot !p-2.5 flex items-center justify-between text-xs font-semibold text-ink"
              >
                <div className="flex items-center space-x-2">
                  <CalendarCheck className="w-4 h-4 text-accent" />
                  <span>Update Availability</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted" />
              </Link>

              <Link
                to="/speaker/profile"
                className="slot !p-2.5 flex items-center justify-between text-xs font-semibold text-ink"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-ink" />
                  <span>Edit Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;
