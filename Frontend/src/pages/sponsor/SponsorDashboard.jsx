import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sponsorPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Award,
  PackageCheck,
  FileText,
  ArrowRight,
  DollarSign,
  Calendar,
  Megaphone,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SponsorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await sponsorPortalService.getDashboard();
        const data = res?.data || res;
        if (res?.success || res?.data?.success) {
          setDashboardData(data.summary ? data : (data.data || data));
        }
      } catch (err) {
        console.error('Failed to fetch sponsor dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader text="Loading sponsor portal dashboard..." />;

  const {
    sponsor,
    summary = {},
    currentSponsorships = [],
    upcomingEvents = [],
    pendingDeliverables = [],
    recentAnnouncements = []
  } = dashboardData || {};

  const progressPct = summary.totalDeliverables > 0
    ? Math.round((summary.completedDeliverables / summary.totalDeliverables) * 100)
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="panel bg-gradient-to-r from-gold/15 via-surface to-surface !p-6 sm:!p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-line">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="chip !text-gold !border-gold/30 !bg-gold/10">
              {sponsor?.tier ? `${sponsor.tier.toUpperCase()} PARTNER` : 'OFFICIAL PARTNER'}
            </span>
            <span className="chip !text-teal !border-teal/30 !bg-teal/10">
              Verified Sponsor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight leading-tight">
            {sponsor?.companyName || 'Corporate Partner Portal'}
          </h1>
          <p className="text-xs text-muted max-w-xl mt-2 leading-relaxed">
            Welcome to your EventForge Sponsor Hub. Track your contract entitlements, coordinate brand deliverables, manage invoices, and monitor event engagement.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            to="/sponsor/deliverables"
            className="btn-primary inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-bold"
          >
            <Upload className="w-4 h-4" />
            <span>Submit Assets</span>
          </Link>
          <Link
            to="/sponsor/invoices"
            className="btn inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-bold"
          >
            <CreditCard className="w-4 h-4" />
            <span>Invoices</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel p-5">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Sponsored Events</span>
            <div className="p-2 bg-accent/10 text-accent rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-ink">{summary.totalSponsoredEvents || currentSponsorships.length || 0}</p>
          <p className="text-[11px] text-muted mt-1 font-medium">
            <span className="text-teal font-bold">{summary.activeSponsorships || currentSponsorships.length || 0} active</span> sponsorships
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Total Investment</span>
            <div className="p-2 bg-teal/10 text-teal rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-ink">{formatCurrency(summary.totalInvestment || 0)}</p>
          <p className="text-[11px] text-teal font-bold mt-1">
            Confirmed Commitments
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Deliverables</span>
            <div className="p-2 bg-gold/10 text-gold rounded-xl">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-ink">{progressPct}%</p>
          <div className="w-full bg-line rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-accent h-1.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-[11px] text-muted mt-1.5 font-medium">
            {summary.completedDeliverables || 0} of {summary.totalDeliverables || 0} completed
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Pending Actions</span>
            <div className="p-2 bg-accent/10 text-accent rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-accent">{summary.pendingDeliverables || pendingDeliverables.length || 0}</p>
          <p className="text-[11px] text-accent font-bold mt-1">
            Items Requiring Attention
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Sponsorships & Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sponsorships */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-display font-bold text-ink flex items-center space-x-2">
                <Award className="w-4 h-4 text-accent" />
                <span>Current Sponsorship Contracts</span>
              </h3>
              <Link to="/sponsor/sponsorships" className="text-xs font-bold text-accent hover:underline">
                View all ({currentSponsorships.length})
              </Link>
            </div>

            {currentSponsorships.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted bg-bg/50 rounded-2xl border border-dashed border-line">
                No active sponsorships contracted at this time.
              </div>
            ) : (
              <div className="space-y-3">
                {currentSponsorships.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="slot !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-display font-bold text-sm text-ink">{item.event?.title || 'Conference Event'}</span>
                        <span className="chip !py-0.5 !px-2 text-[10px] uppercase">
                          {item.package?.name || 'Partner Package'}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        Investment: <strong className="text-ink">{formatCurrency(item.contractAmount || item.package?.price || 0)}</strong> •
                        Status: <span className="capitalize font-semibold text-teal">{item.status || 'Active'}</span>
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] text-muted">
                        <span>Deliverables: {item.deliverables?.filter(d => d.status === 'completed' || d.status === 'approved').length || 0} / {item.deliverables?.length || 0}</span>
                        <span>•</span>
                        <span className="capitalize text-ink">Payment: {item.paymentStatus}</span>
                      </div>
                    </div>

                    <Link
                      to={`/sponsor/sponsorships/${item._id}`}
                      className="btn !py-2 !px-3.5 text-xs font-bold flex items-center justify-center space-x-1 shrink-0"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Deliverables Tracker */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-display font-bold text-ink flex items-center space-x-2">
                <PackageCheck className="w-4 h-4 text-gold" />
                <span>Deliverables Needing Attention</span>
              </h3>
              <Link to="/sponsor/deliverables" className="text-xs font-bold text-accent hover:underline">
                Open tracker
              </Link>
            </div>

            {pendingDeliverables.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted bg-bg/50 rounded-2xl border border-dashed border-line flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal" />
                <p className="font-semibold text-ink">All deliverables up to date!</p>
                <p className="text-[11px] text-muted">No pending uploads or requested revisions.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDeliverables.slice(0, 4).map((d) => (
                  <div
                    key={d._id || d.name}
                    className="slot !p-3.5 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-display font-bold text-ink">{d.name}</span>
                        <span className="chip !py-0.5 !px-2 text-[10px] capitalize">
                          {d.status?.replace('_', ' ') || 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">
                        {d.dueDate ? `Deadline: ${formatDate(d.dueDate)}` : 'Required before event launch'}
                      </p>
                      {d.feedback && (
                        <p className="text-[11px] text-accent font-medium bg-accent/10 px-2 py-0.5 rounded mt-1">
                          Organizer note: "{d.feedback}"
                        </p>
                      )}
                    </div>

                    <Link
                      to="/sponsor/deliverables"
                      className="btn-primary !py-1.5 !px-3 text-xs font-bold shrink-0"
                    >
                      {d.status === 'changes_requested' ? 'Re-upload' : 'Upload'}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Events & Announcements */}
        <div className="space-y-6">
          {/* Upcoming Event Hero */}
          <div className="panel p-6 space-y-4">
            <h3 className="text-sm font-display font-bold text-ink mb-2 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span>Next Sponsored Event</span>
            </h3>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                <div className="slot !p-4 bg-gradient-to-br from-accent/5 to-surface border border-line">
                  <span className="chip !bg-accent/10 !text-accent !border-accent/20 text-[10px] font-bold uppercase tracking-wider">
                    {upcomingEvents[0].status || 'Upcoming'}
                  </span>
                  <h4 className="text-sm font-display font-bold text-ink mt-2">{upcomingEvents[0].title}</h4>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{upcomingEvents[0].description}</p>
                  <div className="mt-3 pt-3 border-t border-line flex items-center justify-between text-xs text-muted">
                    <span>{formatDate(upcomingEvents[0].startDate)}</span>
                    <span className="font-semibold text-ink">{upcomingEvents[0].venue?.city || 'Virtual'}</span>
                  </div>
                </div>
                <Link
                  to="/sponsor/events"
                  className="block text-center text-xs font-bold text-accent hover:underline py-1"
                >
                  View all participating events →
                </Link>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-muted bg-bg/50 rounded-2xl border border-dashed border-line">
                No upcoming events scheduled.
              </div>
            )}
          </div>

          {/* Recent Organizer Announcements */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-display font-bold text-ink flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-gold" />
                <span>Organizer Bulletins</span>
              </h3>
              <Link to="/sponsor/announcements" className="text-xs font-bold text-accent hover:underline">
                View all
              </Link>
            </div>

            {recentAnnouncements.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted bg-bg/50 rounded-2xl border border-dashed border-line">
                No recent announcements.
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.slice(0, 3).map((ann) => (
                  <div key={ann._id} className="slot !p-3 space-y-1">
                    <p className="text-xs font-display font-bold text-ink">{ann.title}</p>
                    <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">{ann.message}</p>
                    <p className="text-[10px] text-muted pt-1">{formatDate(ann.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="panel p-5 space-y-2">
            <p className="text-[11px] font-bold text-muted uppercase tracking-wider px-1">Quick Links</p>
            <Link
              to="/sponsor/profile"
              className="slot !p-2.5 flex items-center justify-between text-xs font-semibold text-ink group"
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                <span>Edit Corporate Profile</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors" />
            </Link>
            <Link
              to="/sponsor/invoices"
              className="slot !p-2.5 flex items-center justify-between text-xs font-semibold text-ink group"
            >
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                <span>Invoices & Billing</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
