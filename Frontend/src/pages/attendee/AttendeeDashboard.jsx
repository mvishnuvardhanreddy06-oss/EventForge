import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendeePortalService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import {
  Compass,
  Ticket,
  Calendar,
  Clock,
  QrCode,
  ArrowRight,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  MapPin,
  Mic,
  CalendarCheck
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const AttendeeDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await attendeePortalService.getDashboard();
        const data = res?.data || res;
        if (res?.success || res?.data?.success) {
          setDashboardData(data.summary ? data : (data.data || data));
        }
      } catch (err) {
        console.error('Failed to fetch attendee dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader text="Loading your personal attendee dashboard..." />;

  const {
    summary = {},
    nextSession,
    activeTicket,
    registeredEvents = [],
    recentAnnouncements = []
  } = dashboardData || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="panel bg-gradient-to-r from-accent/15 via-surface to-surface !p-6 sm:!p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-line">
        <div>
          <span className="chip !text-accent !border-accent/30 !bg-accent/10 mb-2 inline-block">
            Conference Participant Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight leading-tight">
            Welcome back, {user?.name || 'Attendee'}!
          </h1>
          <p className="text-xs text-muted max-w-xl mt-1.5 leading-relaxed">
            Your personal hub for conference badges, registered sessions, personalized agendas, real-time stage updates, and event feedback.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            to="/attendee/browse"
            className="btn-primary inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-bold"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Events</span>
          </Link>
          <Link
            to="/attendee/tickets"
            className="btn inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-bold"
          >
            <Ticket className="w-4 h-4" />
            <span>My Badges</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel p-5">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Active Badges</span>
            <div className="p-2 bg-accent/10 text-accent rounded-xl">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-ink">{summary.activeTickets || 0}</p>
          <p className="text-[11px] text-muted mt-1 font-medium">
            <span className="text-teal font-bold">{summary.totalEventsRegistered || 0} total</span> registered events
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Scheduled Sessions</span>
            <div className="p-2 bg-teal/10 text-teal rounded-xl">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-ink">{summary.upcomingSessionsCount || 0}</p>
          <p className="text-[11px] text-teal font-bold mt-1">
            Personal Agenda Items
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Attendance</span>
            <div className="p-2 bg-teal/10 text-teal rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-teal">{summary.attendedSessions || 0}</p>
          <p className="text-[11px] text-muted mt-1 font-medium">
            Sessions Checked-In
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Reviews & Feedback</span>
            <div className="p-2 bg-gold/10 text-gold rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-ink">{summary.pendingFeedbackCount || 0}</p>
          <p className="text-[11px] text-gold font-bold mt-1">
            Pending Session Reviews
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Session Hero & Registered Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Up Session Hero */}
          {nextSession ? (
            <div className="panel p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="chip !text-accent !border-accent/20 !bg-accent/10">
                  Next Up on Your Agenda
                </span>
                <span className="text-xs text-accent font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(nextSession.startTime)}</span>
                </span>
              </div>

              <h3 className="text-lg font-display font-bold text-ink">{nextSession.title}</h3>
              <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                {nextSession.description}
              </p>

              <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-4">
                  {nextSession.speakerId && (
                    <div className="flex items-center space-x-1.5 text-ink">
                      <Mic className="w-4 h-4 text-accent shrink-0" />
                      <span className="font-semibold">{nextSession.speakerId.name}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5 text-muted">
                    <MapPin className="w-4 h-4 text-muted shrink-0" />
                    <span>{nextSession.roomName || 'Main Keynote Hall'}</span>
                  </div>
                </div>

                <Link
                  to="/attendee/schedule"
                  className="btn !py-1.5 !px-3.5 text-accent text-xs font-bold"
                >
                  View in My Schedule →
                </Link>
              </div>
            </div>
          ) : (
            <div className="panel !bg-gradient-to-r from-accent/5 to-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-display font-bold text-ink">Build Your Conference Agenda</h3>
                <p className="text-xs text-muted max-w-md">
                  Explore keynote tracks, technical workshops, and panel sessions to add them directly to your personal schedule.
                </p>
              </div>
              <Link
                to="/attendee/schedule"
                className="btn-primary text-xs font-bold shrink-0"
              >
                Browse Sessions Agenda
              </Link>
            </div>
          )}

          {/* Registered Events */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-ink flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>My Registered Conferences</span>
              </h3>
              <Link to="/attendee/registrations" className="text-xs font-bold text-accent hover:underline">
                View all ({registeredEvents.length})
              </Link>
            </div>

            {registeredEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted bg-bg/50 rounded-2xl border border-dashed border-line">
                You have not registered for any events yet. Discover upcoming conferences to join!
              </div>
            ) : (
              <div className="space-y-3">
                {registeredEvents.slice(0, 3).map((item) => {
                  const ev = item.eventId || item;
                  return (
                    <div
                      key={item._id}
                      className="slot !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-display font-bold text-sm text-ink">{ev.title || 'Conference Summit'}</span>
                          <span className="chip !py-0.5 !px-2 text-[10px] uppercase">
                            {item.ticketId?.name || 'Standard Pass'}
                          </span>
                        </div>
                        <p className="text-xs text-muted">
                          {formatDate(ev.startDate)} • {ev.venue?.name || 'Convention Center'}, {ev.venue?.city || 'Online'}
                        </p>
                        <p className="text-[11px] text-muted">
                          Registration: <strong className="text-ink font-mono">{item.registrationNumber}</strong>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <Link
                          to={`/attendee/events/${ev._id}`}
                          className="btn !py-1.5 !px-3 text-xs font-semibold"
                        >
                          Event Details
                        </Link>
                        <Link
                          to="/attendee/tickets"
                          className="btn-primary !py-1.5 !px-3 text-xs font-bold flex items-center space-x-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View QR</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Active Badge QR & Announcements */}
        <div className="space-y-6">
          {/* Active Ticket Card */}
          {activeTicket ? (
            <div className="panel bg-gradient-to-br from-accent/10 via-surface to-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="chip !text-teal !bg-teal/10 !border-teal/20 text-[10px] font-bold uppercase tracking-wider">
                  Confirmed Digital Pass
                </span>
                <span className="text-[10px] font-mono text-muted">{activeTicket.registrationNumber}</span>
              </div>

              <div>
                <h4 className="text-base font-display font-bold text-ink line-clamp-1">{activeTicket.eventId?.title || 'Global Tech Summit 2026'}</h4>
                <p className="text-xs text-muted mt-0.5">{activeTicket.ticketId?.name || 'All-Access Pass'}</p>
              </div>

              {/* QR Display */}
              <div className="bg-surface p-4 rounded-2xl border border-line flex flex-col items-center justify-center space-y-2">
                {activeTicket.qrCodeUrl ? (
                  <img src={activeTicket.qrCodeUrl} alt="Badge QR Code" className="w-36 h-36 object-contain" />
                ) : (
                  <div className="w-36 h-36 bg-bg rounded-xl flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-muted" />
                  </div>
                )}
                <span className="text-[10px] font-mono text-muted">Scan at entrance for fast check-in</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-muted">
                <span>Attendee: <strong className="text-ink">{user?.name}</strong></span>
                <button
                  onClick={() => setShowQrModal(true)}
                  className="text-accent hover:underline font-bold cursor-pointer"
                >
                  Full Screen Pass
                </button>
              </div>
            </div>
          ) : (
            <div className="panel p-6 text-center space-y-3">
              <QrCode className="w-12 h-12 text-muted mx-auto" />
              <h4 className="text-sm font-display font-bold text-ink">No Active Conference Pass</h4>
              <p className="text-xs text-muted">
                Register for an upcoming event to receive your rapid QR entrance badge.
              </p>
              <Link
                to="/attendee/browse"
                className="btn-primary inline-block text-xs font-bold"
              >
                Browse Events
              </Link>
            </div>
          )}

          {/* Announcements Feed */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-ink flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-gold" />
                <span>Event Announcements</span>
              </h3>
              <Link to="/attendee/notifications" className="text-xs font-bold text-accent hover:underline">
                View all
              </Link>
            </div>

            {recentAnnouncements.length === 0 ? (
              <p className="text-xs text-muted p-4 text-center bg-bg/50 rounded-2xl border border-line">
                No recent announcements.
              </p>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.slice(0, 3).map((ann) => (
                  <div key={ann._id} className="slot !p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      {ann.type || 'Notice'}
                    </span>
                    <p className="text-xs font-display font-bold text-ink">{ann.title}</p>
                    <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">{ann.message}</p>
                    <p className="text-[10px] text-muted pt-0.5">{formatDate(ann.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen QR Modal */}
      {showQrModal && activeTicket && (
        <Modal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          title="Digital Entrance Badge"
        >
          <div className="space-y-4 text-center p-4">
            <div className="p-6 bg-surface rounded-2xl border-2 border-line shadow-md inline-block">
              {activeTicket.qrCodeUrl ? (
                <img src={activeTicket.qrCodeUrl} alt="Badge QR" className="w-56 h-56 mx-auto object-contain" />
              ) : (
                <QrCode className="w-56 h-56 text-muted mx-auto" />
              )}
              <p className="font-mono text-xs font-bold text-ink mt-3">{activeTicket.registrationNumber}</p>
              <p className="text-xs text-muted">{activeTicket.eventId?.title}</p>
              <p className="text-xs font-bold text-accent mt-1">{user?.name}</p>
            </div>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Present this high-contrast digital QR pass at the gate scanner or session coordinator checkpoint for instant access.
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="btn px-5 py-2 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AttendeeDashboard;
