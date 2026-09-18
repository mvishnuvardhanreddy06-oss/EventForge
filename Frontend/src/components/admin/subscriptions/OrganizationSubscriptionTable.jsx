import React from 'react';
import { Building2, Eye } from 'lucide-react';

const OrganizationSubscriptionTable = ({ organizations, onViewDetails }) => {
  if (organizations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-10 text-center">
        <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-800">No organizations match the filter criteria</p>
        <p className="text-[11px] text-slate-400 mt-1">Try resetting your search query or dropdown filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Organization</th>
              <th className="py-3 px-4">Current Plan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Started</th>
              <th className="py-3 px-4">Renewal</th>
              <th className="py-3 px-4">Usage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/90 text-xs text-slate-700">
            {organizations.map((org) => {
              const isEnt = org.plan.toLowerCase() === 'enterprise';
              const isPro = org.plan.toLowerCase() === 'pro';
              const isActive = org.status.toLowerCase() === 'active';
              const isSuspended = org.status.toLowerCase() === 'suspended';

              return (
                <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Organization */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/80">
                        {org.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{org.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{org.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Current Plan */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isEnt
                          ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                          : isPro
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {org.plan}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                      ${org.price} / mo
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                          : isSuspended
                          ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                          : 'bg-rose-50 text-rose-700 border-rose-200/80'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-600'
                            : isSuspended
                            ? 'bg-amber-500'
                            : 'bg-rose-600'
                        }`}
                      />
                      <span>{org.status}</span>
                    </span>
                  </td>

                  {/* Started */}
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {org.started}
                  </td>

                  {/* Renewal */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 text-[11px] block">
                      {org.renewal}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {org.renewalBadge || 'Scheduled'}
                    </span>
                  </td>

                  {/* Usage */}
                  <td className="py-3 px-4 min-w-[140px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-medium text-slate-700">
                        {org.usageEvents}
                      </span>
                      {org.usageEventsPercentage !== null && (
                        <span className="text-slate-400 font-mono text-[10px]">
                          {org.usageEventsPercentage}%
                        </span>
                      )}
                    </div>
                    {org.usageEventsPercentage !== null ? (
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            org.usageEventsPercentage > 85
                              ? 'bg-rose-500'
                              : org.usageEventsPercentage > 60
                              ? 'bg-blue-600'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(org.usageEventsPercentage, 100)}%` }}
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-medium">
                        Unlimited Events
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onViewDetails(org)}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationSubscriptionTable;
