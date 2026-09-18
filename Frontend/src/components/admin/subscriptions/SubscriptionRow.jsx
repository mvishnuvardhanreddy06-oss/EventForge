import React, { useState, useRef, useEffect } from 'react';
import PlanBadge from './PlanBadge';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';
import { MoreVertical, Eye, RefreshCw, Ban, Sparkles, Crown } from 'lucide-react';

const SubscriptionRow = ({
  subscription,
  onView,
  onChangePlan,
  onCancel,
  onRenew,
  onConvertToPro,
  onConvertToEnterprise
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isExpired = subscription.status?.toLowerCase() === 'expired';
  const isTrial = subscription.status?.toLowerCase() === 'trial';
  const isCancelled = subscription.status?.toLowerCase() === 'cancelled';

  return (
    <tr className="hover:bg-slate-50/70 transition-colors border-b border-slate-100/90">
      <td className="py-3.5 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
            {subscription.orgName ? subscription.orgName.slice(0, 2).toUpperCase() : 'EF'}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 text-xs block truncate">
              {subscription.orgName}
            </span>
            <span className="text-[11px] text-slate-400 font-mono truncate block">
              {subscription.email || 'billing@eventforge.io'}
            </span>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <PlanBadge plan={subscription.plan} />
      </td>

      <td className="py-3.5 px-4">
        <SubscriptionStatusBadge status={subscription.status} />
      </td>

      <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
        {subscription.billingCycle || '-'}
      </td>

      <td className="py-3.5 px-4 text-xs font-bold text-slate-900 font-mono">
        {subscription.amount}
      </td>

      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
        {subscription.startDate}
      </td>

      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap font-medium">
        {subscription.renewalDate || '-'}
      </td>

      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end space-x-1.5 relative">
          <button
            type="button"
            onClick={() => onView(subscription)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-40 text-left text-xs animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onView(subscription);
                  }}
                  className="w-full px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Details</span>
                </button>

                {!isCancelled && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onChangePlan(subscription);
                    }}
                    className="w-full px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Change Plan</span>
                  </button>
                )}

                {isTrial && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onConvertToPro(subscription);
                      }}
                      className="w-full px-3 py-2 hover:bg-blue-50 flex items-center space-x-2 text-blue-700 font-semibold cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Convert to Pro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onConvertToEnterprise(subscription);
                      }}
                      className="w-full px-3 py-2 hover:bg-indigo-50 flex items-center space-x-2 text-indigo-700 font-semibold cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Convert to Enterprise</span>
                    </button>
                  </>
                )}

                {isExpired && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onRenew(subscription);
                    }}
                    className="w-full px-3 py-2 hover:bg-emerald-50 flex items-center space-x-2 text-emerald-700 font-semibold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Renew Subscription</span>
                  </button>
                )}

                {!isCancelled && (
                  <>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onCancel(subscription);
                      }}
                      className="w-full px-3 py-2 hover:bg-rose-50 flex items-center space-x-2 text-rose-700 font-semibold cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-600" />
                      <span>Cancel Subscription</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default SubscriptionRow;
