import React, { useState } from 'react';
import { Plus, Tag, Trash2 } from 'lucide-react';

const CouponManager = ({ coupons = [], onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: 'EARLYBIRD20',
    type: 'Percentage',
    value: 20,
    limit: 100,
    expiry: '2026-09-01'
  });

  const handleAdd = (e) => {
    e.preventDefault();
    onChange([...coupons, couponForm]);
    setModalOpen(false);
  };

  const handleRemove = (index) => {
    onChange(coupons.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-slate-400">
            Coupon Codes
          </h4>
          <p className="text-[11px] text-slate-500">Provide promotional discounts for targeted attendees.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {coupons.map((c, i) => (
          <div
            key={i}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-mono font-bold text-slate-900">{c.code}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                  {c.value}{c.type === 'Percentage' ? '%' : '₹'} OFF
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Limit: {c.limit} · Expiry: {c.expiry}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="p-1 text-slate-400 hover:text-rose-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Add Promotional Coupon</h4>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                  >
                    <option>Percentage</option>
                    <option>Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    min={1}
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManager;
