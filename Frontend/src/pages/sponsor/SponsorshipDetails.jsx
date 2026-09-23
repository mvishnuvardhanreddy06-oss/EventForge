import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sponsorPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Award,
  Calendar,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Building2,
  Mail,
  Phone
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SponsorshipDetails = () => {
  const { sponsorshipId } = useParams();
  const [sponsorship, setSponsorship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await sponsorPortalService.getSponsorshipDetails(sponsorshipId);
        if (res.data?.success) {
          setSponsorship(res.data.data.sponsorship);
        }
      } catch (err) {
        console.error('Failed to fetch sponsorship details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [sponsorshipId]);

  if (loading) return <Loader text="Loading sponsorship contract details..." />;

  if (!sponsorship) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto space-y-4">
        <p className="text-sm font-bold text-slate-700">Sponsorship contract not found</p>
        <Link to="/sponsor/sponsorships" className="text-xs text-blue-600 hover:underline">
          Return to Sponsorships list
        </Link>
      </div>
    );
  }

  const ev = sponsorship.eventId || {};
  const pkg = sponsorship.packageId || {};
  const org = ev.organizationId || {};
  const deliverables = sponsorship.deliverables || [];
  const completedCount = deliverables.filter(d => d.status === 'completed' || d.status === 'approved').length;
  const progressPct = deliverables.length > 0 ? Math.round((completedCount / deliverables.length) * 100) : 100;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/sponsor/sponsorships"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Sponsorships</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              {pkg.name || 'Sponsorship Package'}
            </span>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
              sponsorship.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-300'
            }`}>
              {sponsorship.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">{ev.title || 'Conference Summit'}</h1>
          <p className="text-xs text-slate-300">
            Dates: {formatDate(ev.startDate)} — {formatDate(ev.endDate)} • Venue: {ev.venue?.name || 'Convention Center'}
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Contract Value</span>
          <p className="text-3xl font-black text-amber-400">{formatCurrency(sponsorship.contractAmount || pkg.price || 0)}</p>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-bold capitalize ${
            sponsorship.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            Payment: {sponsorship.paymentStatus || 'Pending'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Package Rights & Deliverables */}
        <div className="md:col-span-2 space-y-6">
          {/* Entitlements Checklist */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Contracted Entitlements & Brand Rights</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {pkg.description || 'Full branding rights, executive conference passes, prominent exhibition presence, and digital program inclusion.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {(pkg.benefits || [
                'Logo on Main Stage Screens',
                'Dedicated 10x10 Exhibition Booth Space',
                '5 VIP All-Access Executive Passes',
                'Full-page Ad in Official Digital Event Guide',
                'Pre-event Email Blurb to Confirmed Attendees'
              ]).map((benefit, i) => (
                <div key={i} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Fulfillment Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <PackageCheck className="w-4 h-4 text-purple-600" />
                  <span>Deliverables & Material Milestones</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Progress: {progressPct}% ({completedCount} of {deliverables.length} approved)</p>
              </div>

              <Link
                to="/sponsor/deliverables"
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all"
              >
                Upload Assets
              </Link>
            </div>

            <div className="space-y-3">
              {deliverables.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 text-center">No specific deliverables registered for this contract.</p>
              ) : (
                deliverables.map((d) => (
                  <div
                    key={d._id || d.name}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{d.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          d.status === 'completed' || d.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : d.status === 'changes_requested'
                            ? 'bg-rose-100 text-rose-700'
                            : d.status === 'submitted'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {d.status?.replace('_', ' ') || 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {d.dueDate ? `Due by ${formatDate(d.dueDate)}` : 'Required before event staging'}
                      </p>
                      {d.feedback && (
                        <p className="text-[11px] text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded">
                          Review feedback: "{d.feedback}"
                        </p>
                      )}
                      {d.assetUrl && (
                        <a
                          href={d.assetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-blue-600 hover:underline pt-0.5"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Uploaded File</span>
                        </a>
                      )}
                    </div>

                    <Link
                      to="/sponsor/deliverables"
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all shrink-0 self-start sm:self-auto"
                    >
                      {d.status === 'changes_requested' ? 'Submit Revision' : 'Manage'}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Billing & Organizer */}
        <div className="space-y-6">
          {/* Payment & Invoicing Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Billing & Settlement</span>
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Contract Total:</span>
                <span className="font-bold text-slate-900">{formatCurrency(sponsorship.contractAmount || pkg.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold capitalize text-emerald-600">{sponsorship.paymentStatus || 'Paid'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Signed Date:</span>
                <span className="font-medium text-slate-700">{formatDate(sponsorship.createdAt)}</span>
              </div>
            </div>

            <Link
              to="/sponsor/invoices"
              className="block w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              View Invoices & Receipts
            </Link>
          </div>

          {/* Organizer Contact Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Host Organization</span>
            </h3>

            <div className="text-xs space-y-2">
              <p className="font-bold text-slate-900">{org.name || 'Summit Production Office'}</p>
              <div className="flex items-center space-x-2 text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{org.email || 'sponsorships@nexussummits.io'}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{org.phone || '+1 (555) 301-4490'}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              For on-site logistics questions, custom stage signage, or booth power drops, reach out directly to your account representative.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipDetails;
