import React from 'react';
import { Check, Edit2, Power, Sparkles, Building2 } from 'lucide-react';

const PlanCard = ({ plan, onEdit, onToggleStatus }) => {
  const isActive = plan.status === 'active';
  const isEnterprise = plan.id === 'enterprise';

  return (
    <div
      className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all relative ${
        isEnterprise
          ? 'border-blue-300 shadow-[0_4px_16px_rgba(37,99,235,0.06)] ring-1 ring-blue-500/20'
          : 'border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-slate-300'
      }`}
    >
      {/* Enterprise Highlight Badge */}
      {isEnterprise && (
        <div className="absolute -top-2.5 left-5">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-2xs tracking-wide uppercase">
            <Sparkles className="w-3 h-3 mr-1" />
            Flagship Tier
          </span>
        </div>
      )}

      <div>
        {/* Header: Name & Status */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
            {plan.name}
          </h3>
          <span
            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-emerald-600' : 'bg-slate-400'
              }`}
            />
            <span>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline my-2.5">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            ${plan.price}
          </span>
          <span className="text-xs text-slate-500 font-medium ml-1.5">
            / {plan.billingPeriod || 'month'}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-500 min-h-[32px] leading-relaxed mb-4">
          {plan.description}
        </p>

        {/* Features List */}
        <div className="border-t border-slate-100 pt-3.5 space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Included Features & Limits
          </p>
          <ul className="space-y-2">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer / Meta & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 space-y-3">
        {/* Active Organizations on this tier */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Active Organizations</span>
          </span>
          <span className="font-semibold text-slate-800">
            {plan.organizationsCount || 0} subscribed
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(plan)}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onToggleStatus(plan)}
            className={`flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
              isActive
                ? 'border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isActive ? 'Deactivate' : 'Activate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
