import React from 'react';
import SubscriptionRow from './SubscriptionRow';
import PlanBadge from './PlanBadge';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';
import { Eye } from 'lucide-react';

const SubscriptionTable = ({
  subscriptions,
  onView,
  onChangePlan,
  onCancel,
  onRenew,
  onConvertToPro,
  onConvertToEnterprise
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Organization</th>
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Billing Cycle</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Start Date</th>
              <th className="py-3.5 px-4">Renewal Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {subscriptions.map((sub) => (
              <SubscriptionRow
                key={sub.id}
                subscription={sub}
                onView={onView}
                onChangePlan={onChangePlan}
                onCancel={onCancel}
                onRenew={onRenew}
                onConvertToPro={onConvertToPro}
                onConvertToEnterprise={onConvertToEnterprise}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/70 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs truncate">
                  {sub.orgName}
                </h4>
                <div className="mt-1 flex items-center space-x-2">
                  <PlanBadge plan={sub.plan} />
                  <SubscriptionStatusBadge status={sub.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Amount
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {sub.amount}
                </span>
                {sub.billingCycle && (
                  <span className="text-[10px] text-slate-500 block">
                    /{sub.billingCycle.toLowerCase()}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Renewal
                </span>
                <span className="font-semibold text-slate-800">
                  {sub.renewalDate || 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => onView(sub)}
                className="w-full py-2 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionTable;
