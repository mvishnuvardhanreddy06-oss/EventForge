import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import PlanBadge from './PlanBadge';

const AVAILABLE_PLANS = [
  { id: 'Free', name: 'FREE', price: '₹0', cycle: 'forever', features: ['Up to 2 events', '100 attendees per event', 'Standard support'] },
  { id: 'Pro', name: 'PRO', price: '₹4,999', cycle: 'per month', features: ['Up to 20 events', '5,000 attendees', 'AI Studio included', 'Priority support'] },
  { id: 'Enterprise', name: 'ENTERPRISE', price: '₹14,999', cycle: 'per month', features: ['Unlimited events', 'Unlimited attendees', 'Custom AI fine-tuning', 'Dedicated 24/7 SLA'] }
];

const ChangePlanModal = ({
  subscription,
  isOpen,
  onClose,
  onConfirmChange
}) => {
  const [selectedPlan, setSelectedPlan] = useState(subscription?.plan || 'Pro');

  if (!isOpen || !subscription) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmChange(subscription.id, selectedPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Change Subscription Plan
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {subscription.orgName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Current Plan:</span>
            <PlanBadge plan={subscription.plan} />
          </div>

          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select New Plan
            </label>
            <div className="space-y-2">
              {AVAILABLE_PLANS.map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="plan"
                          checked={isSelected}
                          onChange={() => setSelectedPlan(p.id)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-bold text-xs text-slate-900">{p.name}</span>
                      </div>
                      <span className="font-extrabold text-xs text-slate-900 font-mono">
                        {p.price}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">
                          {p.cycle}
                        </span>
                      </span>
                    </div>
                    <ul className="mt-2 text-[11px] text-slate-500 space-y-0.5 pl-6 list-disc">
                      {p.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Confirm Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePlanModal;
