import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sponsorPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Award,
  Calendar,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Sponsorships = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        const res = await sponsorPortalService.getSponsorships();
        const list = res?.data?.sponsorships || res?.sponsorships || [];
        setSponsorships(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to fetch sponsorships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsorships();
  }, []);

  const filtered = sponsorships.filter(s => {
    if (statusFilter === 'all') return true;
    return (s.status || '').toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) return <Loader text="Loading sponsorship contracts..." />;

  const totalValue = sponsorships.reduce((sum, s) => sum + (s.contractAmount || s.investment || s.packageId?.price || 0), 0);
  const totalDeliverables = sponsorships.reduce((sum, s) => sum + (s.deliverablesTotal ?? s.deliverables?.length ?? 0), 0);
  const completedDeliverables = sponsorships.reduce(
    (sum, s) => sum + (s.deliverablesCompleted ?? s.deliverables?.filter(d => d.status === 'completed' || d.status === 'approved').length ?? 0),
    0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sponsorship Contracts</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review all confirmed packages, contractual benefits, deliverables fulfillment, and payment statuses.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Contracts</span>
          <p className="text-xl font-black text-slate-900 mt-1">{sponsorships.length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Value</span>
          <p className="text-xl font-black text-blue-600 mt-1">{formatCurrency(totalValue)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deliverables</span>
          <p className="text-xl font-black text-purple-600 mt-1">{completedDeliverables} / {totalDeliverables}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fulfillment Rate</span>
          <p className="text-xl font-black text-emerald-600 mt-1">
            {totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 100}%
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['all', 'active', 'completed', 'pending'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              statusFilter === tab
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sponsorship List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No sponsorship contracts found</p>
          <p className="text-xs text-slate-400">There are no contracts matching the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => {
            const ev = typeof s.eventId === 'object' && s.eventId !== null ? s.eventId : { title: s.event };
            const pkg = typeof s.packageId === 'object' && s.packageId !== null ? s.packageId : { name: s.package };
            const delivs = s.deliverables || [];
            const doneCount = s.deliverablesCompleted ?? delivs.filter(d => d.status === 'completed' || d.status === 'approved').length;
            const totalCount = s.deliverablesTotal ?? delivs.length;
            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 100;

            return (
              <div
                key={s._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-200 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-base font-bold text-slate-900">{ev.title || s.event || 'Conference Summit'}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        {pkg.name || s.package || 'Custom Package'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        s.status?.toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Contract Period: {formatDate(ev.startDate || s.startDate)} — {formatDate(ev.endDate || s.endDate)} • Venue: {ev.venue?.name || ev.venue || 'Main Hall'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Investment</span>
                      <p className="text-lg font-black text-slate-900">{formatCurrency(s.contractAmount || s.investment || pkg.price || 0)}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                      (s.paymentStatus || '').toLowerCase() === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {s.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Benefits & Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-2">Package Entitlements</h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {(pkg.benefits || []).slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-700">Deliverables Fulfillment</span>
                      <span className="font-bold text-purple-600">{doneCount} / {delivs.length} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {delivs.filter(d => d.status === 'changes_requested').length > 0 && (
                        <span className="text-rose-600 font-semibold">Action required: Revisions requested</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <Link
                    to="/sponsor/deliverables"
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all flex items-center space-x-1"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Upload Deliverables</span>
                  </Link>

                  <Link
                    to={`/sponsor/sponsorships/${s._id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1 shadow-2xs"
                  >
                    <span>Contract Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sponsorships;
