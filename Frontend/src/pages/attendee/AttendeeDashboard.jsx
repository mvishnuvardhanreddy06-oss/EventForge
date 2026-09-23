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
        if (res.data?.success) {
          setDashboardData(res.data.data);
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
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2 inline-block">
            Conference Participant Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Welcome back, {user?.name || 'Attendee'}!
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1.5 leading-relaxed">
            Your personal hub for conference badges, registered sessions, personalized agendas, real-time stage updates, and event feedback.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            to="/attendee/browse"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Events</span>
          </Link>
          <Link
            to="/attendee/tickets"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/20"
          >
            <Ticket className="w-4 h-4" />
            <span>My Badges</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Badges</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.activeTickets || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            <span className="text-emerald-600 font-bold">{summary.totalEventsRegistered || 0} total</span> registered events
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Scheduled Sessions</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.upcomingSessionsCount || 0}</p>
          <p className="text-[11px] text-purple-600 font-bold mt-1">
            Personal Agenda Items
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendance</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{summary.attendedSessions || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Sessions Checked-In
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reviews & Feedback</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.pendingFeedbackCount || 0}</p>
          <p className="text-[11px] text-amber-600 font-bold mt-1">
            Pending Session Reviews
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Session Hero & Registered Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Up Session Hero */}
          {nextSession ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                  Next Up on Your Agenda
                </span>
                <span className="text-xs text-purple-700 font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(nextSession.startTime)}</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{nextSession.title}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {nextSession.description}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-4">
                  {nextSession.speakerId && (
                    <div className="flex items-center space-x-1.5 text-slate-700">
                      <Mic className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-semibold">{nextSession.speakerId.name}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{nextSession.roomName || 'Main Keynote Hall'}</span>
                  </div>
                </div>

                <Link
                  to="/attendee/schedule"
                  className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-all"
                >
                  View in My Schedule →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-3xl border border-blue-100 p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-900">Build Your Conference Agenda</h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Explore keynote tracks, technical workshops, and panel sessions to add them directly to your personal schedule.
                </p>
              </div>
              <Link
                to="/attendee/schedule"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs shrink-0"
              >
                Browse Sessions Agenda
              </Link>
            </div>
          )}

          {/* Registered Events */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>My Registered Conferences</span>
              </h3>
              <Link to="/attendee/registrations" className="text-xs font-bold text-blue-600 hover:underline">
                View all ({registeredEvents.length})
              </Link>
            </div>

            {registeredEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                You have not registered for any events yet. Discover upcoming conferences to join!
              </div>
            ) : (
              <div className="space-y-3">
                {registeredEvents.slice(0, 3).map((item) => {
                  const ev = item.eventId || item;
                  return (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">{ev.title || 'Conference Summit'}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
                            {item.ticketId?.name || 'Standard Pass'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formatDate(ev.startDate)} • {ev.venue?.name || 'Convention Center'}, {ev.venue?.city || 'Online'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Registration: <strong className="text-slate-700 font-mono">{item.registrationNumber}</strong>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <Link
                          to={`/attendee/events/${ev._id}`}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
                        >
                          Event Details
                        </Link>
                        <Link
                          to="/attendee/tickets"
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center space-x-1"
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
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-lg border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Confirmed Digital Pass
                </span>
                <span className="text-[10px] font-mono text-slate-400">{activeTicket.registrationNumber}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white line-clamp-1">{activeTicket.eventId?.title || 'Global Tech Summit 2026'}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{activeTicket.ticketId?.name || 'All-Access Pass'}</p>
              </div>

              {/* QR Display */}
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2">
                {activeTicket.qrCodeUrl ? (
                  <img src={activeTicket.qrCodeUrl} alt="Badge QR Code" className="w-36 h-36 object-contain" />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 rounded-xl flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-400" />
                  </div>
                )}
                <span className="text-[10px] font-mono text-slate-500">Scan at entrance for fast check-in</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
                <span>Attendee: {user?.name}</span>
                <button
                  onClick={() => setShowQrModal(true)}
                  className="text-blue-300 hover:text-white font-bold underline"
                >
                  Full Screen Pass
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs text-center space-y-3">
              <QrCode className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No Active Conference Pass</h4>
              <p className="text-xs text-slate-400">
                Register for an upcoming event to receive your rapid QR entrance badge.
              </p>
              <Link
                to="/attendee/browse"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Browse Events
              </Link>
            </div>
          )}

          {/* Announcements Feed */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>Event Announcements</span>
              </h3>
              <Link to="/attendee/notifications" className="text-xs font-bold text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            {recentAnnouncements.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center bg-slate-50 rounded-2xl">
                No recent announcements.
              </p>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.slice(0, 3).map((ann) => (
                  <div key={ann._id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {ann.type || 'Notice'}
                    </span>
                    <p className="text-xs font-bold text-slate-900">{ann.title}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ann.message}</p>
                    <p className="text-[10px] text-slate-400 pt-0.5">{formatDate(ann.createdAt)}</p>
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
            <div className="p-6 bg-white rounded-3xl border-2 border-slate-900 shadow-xl inline-block">
              {activeTicket.qrCodeUrl ? (
                <img src={activeTicket.qrCodeUrl} alt="Badge QR" className="w-56 h-56 mx-auto object-contain" />
              ) : (
                <QrCode className="w-56 h-56 text-slate-400 mx-auto" />
              )}
              <p className="font-mono text-xs font-bold text-slate-900 mt-3">{activeTicket.registrationNumber}</p>
              <p className="text-xs text-slate-500">{activeTicket.eventId?.title}</p>
              <p className="text-xs font-bold text-blue-600 mt-1">{user?.name}</p>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Present this high-contrast digital QR pass at the gate scanner or session coordinator checkpoint for instant access.
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
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
