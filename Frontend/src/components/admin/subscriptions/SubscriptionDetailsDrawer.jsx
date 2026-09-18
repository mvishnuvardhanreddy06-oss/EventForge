import React from 'react';
import PlanBadge from './PlanBadge';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';
import {
  X,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  HardDrive,
  Users,
  CalendarCheck,
  RefreshCw,
  Ban,
  Sparkles,
  Crown
} from 'lucide-react';

const SubscriptionDetailsDrawer = ({
  subscription,
  isOpen,
  onClose,
  onChangePlan,
  onCancel,
  onRenew,
  onConvertToPro,
  onConvertToEnterprise
}) => {
  if (!isOpen || !subscription) return null;

  const isExpired = subscription.status?.toLowerCase() === 'expired';
  const isTrial = subscription.status?.toLowerCase() === 'trial';
  const isCancelled = subscription.status?.toLowerCase() === 'cancelled';

  const usage = subscription.usage || {
    users: { current: 24, max: 50, percent: 48 },
    events: { current: 8, max: 20, percent: 40 },
    storage: { current: '12 GB', max: '50 GB', percent: 24 }
  };

  const history = subscription.history || [
    { date: 'Aug 01, 2026', event: 'Subscription activated' },
    { date: 'Sep 01, 2026', event: 'Payment received (₹4,999)' },
    { date: 'Sep 10, 2026', event: 'Plan usage updated' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-text">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200/80 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Plan Governance
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Subscription Details
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  {subscription.orgName ? subscription.orgName.slice(0, 2).toUpperCase() : 'EF'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {subscription.orgName}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {subscription.email || 'billing@eventforge.io'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/70">
                <PlanBadge plan={subscription.plan} />
                <SubscriptionStatusBadge status={subscription.status} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Billing & Cycle Information
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Subscription Amount
                  </span>
                  <p className="font-extrabold text-slate-900 font-mono text-sm mt-0.5">
                    {subscription.amount} {subscription.billingCycle && `/ ${subscription.billingCycle.toLowerCase()}`}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Billing Cycle
                  </span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">
                    {subscription.billingCycle || 'N/A'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Start Date
                  </span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {subscription.startDate}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Next Renewal
                  </span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {subscription.renewalDate || 'None'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Plan Usage Quotas
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Healthy Allocation
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Users</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {usage.users.current} / {usage.users.max}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${usage.users.percent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Events</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {usage.events.current} / {usage.events.max}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${usage.events.percent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      <span>Storage</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {usage.storage.current} / {usage.storage.max}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full"
                      style={{ width: `${usage.storage.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Subscription History
              </span>
              <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 bg-white">
                {history.map((h, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-800">{h.event}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono shrink-0 ml-2">
                      {h.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2">
              {!isCancelled && (
                <button
                  type="button"
                  onClick={() => onChangePlan(subscription)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-colors text-center cursor-pointer"
                >
                  Change Plan
                </button>
              )}

              {isTrial && (
                <button
                  type="button"
                  onClick={() => onConvertToPro(subscription)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors text-center cursor-pointer"
                >
                  Convert to Pro
                </button>
              )}

              {isExpired && (
                <button
                  type="button"
                  onClick={() => onRenew(subscription)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors text-center cursor-pointer"
                >
                  Renew Plan
                </button>
              )}

              {!isCancelled && !isExpired && (
                <button
                  type="button"
                  onClick={() => onCancel(subscription)}
                  className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors text-center cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsDrawer;
