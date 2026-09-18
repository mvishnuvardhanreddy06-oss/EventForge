import React from 'react';
import TicketManager from './TicketManager';
import CouponManager from './CouponManager';

const REG_STATUSES = ['Open', 'Approval Required', 'Invite Only', 'Closed'];

const RegistrationStep = ({ formData, onChange, errors = {} }) => {
  const tickets = formData.tickets || [
    {
      name: 'Standard Delegate Pass',
      price: 2999,
      quantity: 1000,
      description: 'Standard access to keynotes, track sessions, and general exhibits.',
      salesStart: '2026-08-01',
      salesEnd: '2026-09-24',
      type: 'Standard'
    }
  ];

  const coupons = formData.coupons || [
    { code: 'APEX2026', type: 'Percentage', value: 15, limit: 150, expiry: '2026-09-20' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-6">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Registration & Tickets
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure attendee onboarding policies, pass tiers, capacity limits, and waitlists.
        </p>
      </div>

      <div className="space-y-5 text-xs">
        {/* Registration State selector */}
        <div className="space-y-2">
          <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
            Registration Policy
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {REG_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChange('registrationStatus', status)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  (formData.registrationStatus || 'Open') === status
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Registration Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Registration Start Date</label>
            <input
              type="date"
              value={formData.registrationStart || '2026-08-01'}
              onChange={(e) => onChange('registrationStart', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Registration End Date</label>
            <input
              type="date"
              value={formData.registrationEnd || '2026-09-24'}
              onChange={(e) => onChange('registrationEnd', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Enable Waitlist</p>
              <p className="text-[11px] text-slate-500">Allow registration overflow when tickets sell out.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.enableWaitlist !== false}
              onChange={(e) => onChange('enableWaitlist', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Enable Coupon Codes</p>
              <p className="text-[11px] text-slate-500">Permit promotional codes at checkout.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.enableCoupons || false}
              onChange={(e) => onChange('enableCoupons', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>

        {/* Ticket Manager Component */}
        <div className="pt-2 border-t border-slate-100">
          <TicketManager
            tickets={tickets}
            onChange={(newTickets) => onChange('tickets', newTickets)}
          />
        </div>

        {/* Coupon Manager Component */}
        {formData.enableCoupons && (
          <CouponManager
            coupons={coupons}
            onChange={(newCoupons) => onChange('coupons', newCoupons)}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationStep;
