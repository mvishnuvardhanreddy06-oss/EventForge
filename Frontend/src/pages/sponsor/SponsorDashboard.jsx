import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sponsorService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import DeliverableTracker from '../../components/DeliverableTracker';
import { Award, PackageCheck, FileText, ArrowRight, DollarSign, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const SponsorDashboard = () => {
  const { user } = useAuth();
  const [sponsorData, setSponsorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        const res = await sponsorService.getAll();
        if (res.success && res.data.sponsors.length > 0) {
          const mySponsor = res.data.sponsors[0];
          const detailRes = await sponsorService.getById(mySponsor._id);
          if (detailRes.success) setSponsorData(detailRes.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsor();
  }, []);

  if (loading) return <Loader text="Loading sponsor dashboard..." />;

  const { sponsor, sponsorship } = sponsorData || {};
  const pkg = sponsor?.packageId || sponsorship?.packageId;
  const deliverables = sponsorship?.deliverables || [];
  const completed = deliverables.filter(d => d.status === 'completed').length;
  const progressPct = deliverables.length > 0 ? Math.round((completed / deliverables.length) * 100) : 100;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2 inline-block">
            Official Corporate Partner
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
            {sponsor?.companyName || 'Corporate Partner Portal'}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Event: {sponsor?.eventId?.title || 'Global Conference 2026'} • Package: <strong>{pkg?.name || 'Platinum Partner'}</strong>
          </p>
        </div>

        <Link
          to="/sponsor/brand-assets"
          className="inline-flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Upload Brand Assets</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Partner Tier</p>
          <p className="text-xl font-black text-slate-900 mt-1">{pkg?.name || 'Platinum'}</p>
          <span className="text-[11px] text-blue-600 font-semibold">Status: Active</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Committed Investment</p>
          <p className="text-xl font-black text-blue-600 mt-1">{formatCurrency(pkg?.price || 25000)}</p>
          <span className="text-[11px] text-emerald-600 font-bold">Payment Settled</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Deliverables Progress</p>
          <p className="text-xl font-black text-emerald-600 mt-1">{progressPct}%</p>
          <span className="text-[11px] text-slate-500 font-medium">{completed} of {deliverables.length} Milestones</span>
        </div>
      </div>

      {/* Deliverable Milestones */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Contractual Deliverables & Deadlines</h3>
          <Link to="/sponsor/deliverables" className="text-xs font-bold text-blue-600 hover:underline">
            Manage checklist
          </Link>
        </div>
        <DeliverableTracker deliverables={deliverables} />
      </div>
    </div>
  );
};

export default SponsorDashboard;
