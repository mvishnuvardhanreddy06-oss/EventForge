import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const PlanFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const isEditing = Boolean(initialData);

  const [form, setForm] = useState({
    name: '',
    price: '',
    billingPeriod: 'month',
    maxEvents: '20',
    maxAttendees: '5000',
    storageLimit: '50 GB',
    analyticsLevel: 'Advanced',
    aiFeatures: 'Enabled',
    supportLevel: 'Priority',
    description: '',
    status: 'active'
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        price: initialData.price !== undefined ? initialData.price : '',
        billingPeriod: initialData.billingPeriod || 'month',
        maxEvents: initialData.maxEvents || '20',
        maxAttendees: initialData.maxAttendees || '5000',
        storageLimit: initialData.storageLimit || '50 GB',
        analyticsLevel: initialData.analyticsLevel || 'Advanced',
        aiFeatures: initialData.aiFeatures || 'Enabled',
        supportLevel: initialData.supportLevel || 'Priority',
        description: initialData.description || '',
        status: initialData.status || 'active'
      });
      setError('');
    } else {
      setForm({
        name: '',
        price: '',
        billingPeriod: 'month',
        maxEvents: '20',
        maxAttendees: '5000',
        storageLimit: '50 GB',
        analyticsLevel: 'Advanced',
        aiFeatures: 'Enabled',
        supportLevel: 'Priority',
        description: '',
        status: 'active'
      });
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Plan Name is required.');
      return;
    }
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) {
      setError('Please enter a valid non-negative price.');
      return;
    }

    const features = [
      `${form.maxEvents} Events`,
      `${Number(form.maxAttendees) ? Number(form.maxAttendees).toLocaleString() : form.maxAttendees} Attendees / Event`,
      `${form.analyticsLevel} Analytics`,
      form.aiFeatures === 'Disabled' ? 'No AI Features' : `${form.aiFeatures} AI Features`,
      `${form.supportLevel} Support`
    ];

    if (form.storageLimit) {
      features.push(`${form.storageLimit} Cloud Storage`);
    }

    onSubmit({
      ...initialData,
      ...form,
      name: form.name.toUpperCase(),
      price: Number(form.price),
      features: initialData?.features?.length ? initialData.features : features
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200/90 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update plan limits, pricing, and features available to organizations.'
                : 'Define a new subscription tier for multi-tenant organizations.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning if editing */}
        {isEditing && (
          <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-200/60 flex items-start space-x-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> Changing limits or pricing could affect existing organizations currently subscribed to this tier upon renewal.
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plan Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. BUSINESS"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price (USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="99"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Billing Period
              </label>
              <select
                value={form.billingPeriod}
                onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="month">Monthly</option>
                <option value="year">Annual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Events
              </label>
              <input
                type="text"
                value={form.maxEvents}
                onChange={(e) => setForm({ ...form, maxEvents: e.target.value })}
                placeholder="e.g. 50 or Unlimited"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Attendees per Event
              </label>
              <input
                type="text"
                value={form.maxAttendees}
                onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })}
                placeholder="e.g. 10000"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Analytics Level
              </label>
              <select
                value={form.analyticsLevel}
                onChange={(e) => setForm({ ...form, analyticsLevel: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Basic">Basic</option>
                <option value="Advanced">Advanced</option>
                <option value="Custom Enterprise">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                AI Features
              </label>
              <select
                value={form.aiFeatures}
                onChange={(e) => setForm({ ...form, aiFeatures: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Limited">Limited</option>
                <option value="Enabled">Enabled</option>
                <option value="Advanced Studio">Advanced Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Level
              </label>
              <select
                value={form.supportLevel}
                onChange={(e) => setForm({ ...form, supportLevel: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Basic">Basic</option>
                <option value="Priority">Priority</option>
                <option value="Dedicated 24/7">Dedicated 24/7</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plan Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the ideal organization audience for this tier..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanFormModal;
