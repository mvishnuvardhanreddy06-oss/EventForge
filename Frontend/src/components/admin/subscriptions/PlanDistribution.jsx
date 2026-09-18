import React from 'react';
import {
  Shield,
  Sparkles,
  Crown,
  CheckCircle2,
  Building2,
  Sliders
} from 'lucide-react';

const PlanDistribution = ({ plans = [], onEditPlan }) => {
  return (
    <div className="space-y-4">
      {/* SECTION HEADER */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Subscription Plans
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Choose the plan that best fits your organization's event management needs.
        </p>
      </div>

      {/* THREE HORIZONTAL RECTANGULAR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {plans.map((plan) => {
          const isPro = plan.id === 'plan-pro' || plan.isPopular;
          const isEnterprise = plan.id === 'plan-enterprise';
          const isFree = plan.id === 'plan-free';

          const formattedPrice =
            plan.price === 0
              ? '₹0'
              : `₹${Number(plan.price).toLocaleString('en-IN')}`;

          const billingLabel =
            plan.billingPeriod === 'Forever'
              ? 'Forever'
              : plan.billingPeriod === 'Yearly'
              ? 'per year'
              : 'per month';

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-7 transition-all flex flex-col justify-between relative ${
                isPro
                  ? 'border-2 border-blue-600 shadow-lg shadow-blue-500/5 ring-4 ring-blue-600/5'
                  : 'border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Most Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 right-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                    <Sparkles className="w-3 h-3 text-blue-200" />
                    <span>MOST POPULAR</span>
                  </span>
                </div>
              )}

              <div className="space-y-5">
                {/* Header: Icon, Name, Tag & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isPro
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : isEnterprise
                          ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isPro ? (
                        <Sparkles className="w-4 h-4" />
                      ) : isEnterprise ? (
                        <Crown className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {plan.name}
                      </h4>
                      <span
                        className={`text-[11px] font-semibold ${
                          isPro
                            ? 'text-blue-600'
                            : isEnterprise
                            ? 'text-indigo-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {plan.tag || (isFree ? 'Starter tier' : isPro ? 'Growing teams' : 'Large organizations')}
                      </span>
                    </div>
                  </div>

                  {/* Plan Status Indicator */}
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      plan.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        plan.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{plan.status || 'Active'}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed min-h-[34px]">
                  {plan.description}
                </p>

                {/* Pricing */}
                <div
                  className={`pt-1 pb-2 border-b ${
                    isPro ? 'border-blue-100' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                      {formattedPrice}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isPro ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {billingLabel}
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 pt-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isPro ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    Included Features
                  </span>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isPro
                              ? 'text-blue-600'
                              : isEnterprise
                              ? 'text-indigo-600'
                              : 'text-slate-400'
                          }`}
                        />
                        <span className={isPro ? 'font-medium text-slate-700' : ''}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Metric & Edit Plan Action */}
              <div
                className={`pt-5 mt-6 border-t ${
                  isPro ? 'border-blue-100' : 'border-slate-100/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-400">
                    Currently subscribed
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1.5 ${
                      isPro
                        ? 'text-blue-700'
                        : isEnterprise
                        ? 'text-slate-800'
                        : 'text-slate-800'
                    }`}
                  >
                    <Building2
                      className={`w-3.5 h-3.5 ${
                        isPro
                          ? 'text-blue-600'
                          : isEnterprise
                          ? 'text-indigo-500'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{plan.usage?.organizations || 0} Organizations</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onEditPlan && onEditPlan(plan)}
                  className={`w-full mt-4 py-2.5 px-4 text-xs font-bold rounded-xl transition-all text-center cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isPro
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow'
                      : isEnterprise
                      ? 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Edit Plan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanDistribution;
