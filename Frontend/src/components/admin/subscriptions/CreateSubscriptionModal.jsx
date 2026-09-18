import React, { useState } from 'react';
import { X, PlusCircle, ShieldAlert } from 'lucide-react';

const CreateSubscriptionModal = ({
  isOpen,
  onClose,
  existingSubscriptions = [],
  onCreate
}) => {
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    plan: 'Pro',
    billingCycle: 'Monthly',
    startDate: '2026-09-17',
    status: 'Active'
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.orgName.trim()) {
      setError('Organization name is required.');
      return;
    }

    const orgNameTrimmed = formData.orgName.trim().toLowerCase();
    const isDuplicate = existingSubscriptions.some(
      (s) => s.orgName.toLowerCase() === orgNameTrimmed && s.status !== 'Cancelled'
    );

    if (isDuplicate) {
      setError(`An active subscription for "${formData.orgName.trim()}" already exists. Duplicate subscriptions are not allowed.`);
      return;
    }

    let amount = '₹4,999';
    if (formData.plan === 'Free') {
      amount = '₹0';
    } else if (formData.plan === 'Enterprise') {
      amount = formData.billingCycle === 'Yearly' ? '₹49,999' : '₹14,999';
    } else if (formData.plan === 'Pro' && formData.billingCycle === 'Yearly') {
      amount = '₹49,999';
    }

    const renewalDate = formData.plan === 'Free' ? '-' : formData.billingCycle === 'Yearly' ? 'Sep 17, 2027' : 'Oct 17, 2026';

    onCreate({
      id: `sub-${Date.now()}`,
      orgName: formData.orgName.trim(),
      email: formData.email.trim() || `billing@${formData.orgName.trim().toLowerCase().replace(/\s+/g, '')}.com`,
      plan: formData.plan,
      status: formData.status,
      billingCycle: formData.plan === 'Free' ? '-' : formData.billingCycle,
      amount: amount,
      startDate: 'Sep 17, 2026',
      renewalDate: renewalDate
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Create Subscription
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Provision a new plan for an enterprise tenant
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
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Organization Name *
            </label>
            <input
              type="text"
              required
              value={formData.orgName}
              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              placeholder="e.g. Acme Corporation"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Billing Contact Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="billing@acme.com"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Plan *
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Free">Free</option>
                <option value="Pro">Pro (₹4,999/mo)</option>
                <option value="Enterprise">Enterprise (₹14,999/mo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Billing Cycle *
              </label>
              <select
                disabled={formData.plan === 'Free'}
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Initial Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Trial">Trial (14 Days)</option>
              </select>
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
              Create Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubscriptionModal;
