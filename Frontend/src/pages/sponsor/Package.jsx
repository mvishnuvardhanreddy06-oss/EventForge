import React, { useState, useEffect } from 'react';
import { sponsorService } from '../../services/api';
import Loader from '../../components/Loader';
import { Check, Award, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const Package = () => {
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await sponsorService.getAll();
        if (res.success && res.data.sponsors.length > 0) {
          const sp = res.data.sponsors[0];
          const detail = await sponsorService.getById(sp._id);
          if (detail.success) setPackageData(detail.data?.sponsor?.packageId || detail.data?.sponsorship?.packageId);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, []);

  if (loading) return <Loader text="Loading package benefits..." />;
  if (!packageData) return <div className="p-8 text-center text-xs text-slate-400">No contracted package found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Contracted Sponsorship Package</h1>
        <p className="text-xs text-slate-500 mt-0.5">Overview of rights, executive passes, and brand exposure entitlements.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-2">
              Confirmed Tier
            </span>
            <h2 className="text-2xl font-black text-slate-900">{packageData.name}</h2>
          </div>
          <div className="text-3xl font-black text-blue-600">
            {formatCurrency(packageData.price)}
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed my-6">
          {packageData.description}
        </p>

        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Included Entitlements & Rights</h4>
        <ul className="space-y-3">
          {(packageData.benefits || []).map((b, i) => (
            <li key={i} className="flex items-center space-x-3 text-xs text-slate-700 font-medium">
              <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><Check className="w-4 h-4" /></div>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Package;
