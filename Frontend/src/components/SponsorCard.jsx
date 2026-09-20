import React from 'react';
import { ExternalLink, CheckCircle, Phone, Eye, Edit2 } from 'lucide-react';
import Badge from './Badge';
import { formatIndianPhone } from '../utils/phoneUtils';

const SponsorCard = ({
  sponsor,
  sponsorship = null,
  onViewDetails,
  onEdit
}) => {
  const deliverables = sponsorship?.deliverables || [];
  const completed = deliverables.filter(d => d.status === 'completed').length;
  const total = deliverables.length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 100;

  const formattedPhone = formatIndianPhone(sponsor.phone);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
            {sponsor.logo ? (
              <img src={sponsor.logo} alt={sponsor.companyName} className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="font-black text-sm text-blue-600">{sponsor.companyName?.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <Badge status={sponsor.status || 'active'} />
        </div>

        <h4 className="text-sm font-bold text-slate-900 mb-1">{sponsor.companyName}</h4>
        <p className="text-xs text-blue-600 font-semibold mb-3">
          {sponsor.packageId?.name || sponsorship?.packageId?.name || 'Corporate Partner'}
        </p>

        <div className="space-y-1 mb-3 text-xs text-slate-500">
          <p>
            Contact: <span className="font-medium text-slate-700">{sponsor.contactPerson || 'Partnership Lead'}</span>
          </p>

          {/* Formatted Indian Mobile Number Display */}
          {formattedPhone && (
            <p className="flex items-center space-x-1 text-slate-700 font-medium">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-mono text-xs font-semibold">{formattedPhone}</span>
            </p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 space-y-3">
        {total > 0 && (
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>Deliverables</span>
              <span>{completed} / {total} ({progressPct}%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          {sponsor.website ? (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 truncate"
            >
              <span>Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : <div />}

          <div className="flex items-center space-x-1.5 ml-auto">
            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(sponsor)}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>Details</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(sponsor)}
                className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorCard;
