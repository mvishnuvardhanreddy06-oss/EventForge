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
        if (res.data?.success) {
          setDashboardData(res.data.data);
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {sponsor?.tier ? `${sponsor.tier.toUpperCase()} PARTNER` : 'OFFICIAL PARTNER'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Sponsor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {sponsor?.companyName || 'Corporate Partner Portal'}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-2 leading-relaxed">
            Welcome to your EventForge Sponsor Hub. Track your contract entitlements, coordinate brand deliverables, manage invoices, and monitor event engagement.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            to="/sponsor/deliverables"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Submit Assets</span>
          </Link>
          <Link
            to="/sponsor/invoices"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/20"
          >
            <CreditCard className="w-4 h-4" />
            <span>Invoices</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sponsored Events</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.totalSponsoredEvents || currentSponsorships.length || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            <span className="text-emerald-600 font-bold">{summary.activeSponsorships || currentSponsorships.length || 0} active</span> sponsorships
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Investment</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(summary.totalInvestment || 0)}</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            Confirmed Commitments
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Deliverables</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{progressPct}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
            {summary.completedDeliverables || 0} of {summary.totalDeliverables || 0} completed
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Actions</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.pendingDeliverables || pendingDeliverables.length || 0}</p>
          <p className="text-[11px] text-amber-600 font-bold mt-1">
            Items Requiring Attention
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Sponsorships & Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sponsorships */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Current Sponsorship Contracts</span>
              </h3>
              <Link to="/sponsor/sponsorships" className="text-xs font-bold text-blue-600 hover:underline">
                View all ({currentSponsorships.length})
              </Link>
            </div>

            {currentSponsorships.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No active sponsorships contracted at this time.
              </div>
            ) : (
              <div className="space-y-3">
                {currentSponsorships.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{item.event?.title || 'Conference Event'}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
                          {item.package?.name || 'Partner Package'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Investment: <strong className="text-slate-800">{formatCurrency(item.contractAmount || item.package?.price || 0)}</strong> •
                        Status: <span className="capitalize font-semibold text-emerald-600">{item.status || 'Active'}</span>
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                        <span>Deliverables: {item.deliverables?.filter(d => d.status === 'completed' || d.status === 'approved').length || 0} / {item.deliverables?.length || 0}</span>
                        <span>•</span>
                        <span className="capitalize text-slate-600">Payment: {item.paymentStatus}</span>
                      </div>
                    </div>

                    <Link
                      to={`/sponsor/sponsorships/${item._id}`}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center space-x-1 shrink-0"
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <PackageCheck className="w-4 h-4 text-purple-600" />
                <span>Deliverables Needing Attention</span>
              </h3>
              <Link to="/sponsor/deliverables" className="text-xs font-bold text-blue-600 hover:underline">
                Open tracker
              </Link>
            </div>

            {pendingDeliverables.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <p className="font-semibold text-slate-700">All deliverables up to date!</p>
                <p className="text-[11px] text-slate-400">No pending uploads or requested revisions.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDeliverables.slice(0, 4).map((d) => (
                  <div
                    key={d._id || d.name}
                    className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{d.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          d.status === 'changes_requested'
                            ? 'bg-rose-100 text-rose-700'
                            : d.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {d.status?.replace('_', ' ') || 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {d.dueDate ? `Deadline: ${formatDate(d.dueDate)}` : 'Required before event launch'}
                      </p>
                      {d.feedback && (
                        <p className="text-[11px] text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded mt-1">
                          Organizer note: "{d.feedback}"
                        </p>
                      )}
                    </div>

                    <Link
                      to="/sponsor/deliverables"
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-all shrink-0"
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Next Sponsored Event</span>
            </h3>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl border border-blue-100">
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                    {upcomingEvents[0].status || 'Upcoming'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{upcomingEvents[0].title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{upcomingEvents[0].description}</p>
                  <div className="mt-3 pt-3 border-t border-blue-100/60 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(upcomingEvents[0].startDate)}</span>
                    <span className="font-semibold text-slate-700">{upcomingEvents[0].venue?.city || 'Virtual'}</span>
                  </div>
                </div>
                <Link
                  to="/sponsor/events"
                  className="block text-center text-xs font-bold text-blue-600 hover:underline py-1"
                >
                  View all participating events →
                </Link>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No upcoming events scheduled.
              </div>
            )}
          </div>

          {/* Recent Organizer Announcements */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>Organizer Bulletins</span>
              </h3>
              <Link to="/sponsor/announcements" className="text-xs font-bold text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            {recentAnnouncements.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No recent announcements.
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.slice(0, 3).map((ann) => (
                  <div key={ann._id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <p className="text-xs font-bold text-slate-900">{ann.title}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ann.message}</p>
                    <p className="text-[10px] text-slate-400 pt-1">{formatDate(ann.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-5 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Quick Links</p>
            <Link
              to="/sponsor/profile"
              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-200 transition-all shadow-2xs"
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Edit Corporate Profile</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/sponsor/invoices"
              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-200 transition-all shadow-2xs"
            >
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Invoices & Billing</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
