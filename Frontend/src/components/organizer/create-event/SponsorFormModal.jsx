import React, { useState } from 'react';
import { X } from 'lucide-react';

const PACKAGES = ['Title Sponsor', 'Platinum Sponsor', 'Gold Sponsor', 'Silver Sponsor', 'Bronze Sponsor'];

const SponsorFormModal = ({ isOpen, sponsor, onClose, onSave }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState(
    sponsor || {
      companyName: '',
      package: 'Gold Sponsor',
      amount: '₹2,50,000',
      deliverables: 5,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop',
      status: 'Confirmed'
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900">
            {sponsor ? 'Edit Sponsor' : 'Add Corporate Sponsor'}
          </h4>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="e.g. TechNova Solutions"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sponsorship Tier</label>
              <select
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
              >
                {PACKAGES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Commitment Amount</label>
              <input
                type="text"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="₹2,50,000"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Agreed Deliverables Count</label>
            <input
              type="number"
              min={1}
              value={form.deliverables}
              onChange={(e) => setForm({ ...form, deliverables: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
            >
              Save Sponsor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SponsorFormModal;
