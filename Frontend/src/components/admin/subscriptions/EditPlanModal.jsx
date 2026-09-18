import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Shield,
  Crown,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  Save
} from 'lucide-react';

const EditPlanModal = ({
  isOpen,
  onClose,
  plan,
  allPlans = [],
  onSavePlan
}) => {
  if (!isOpen || !plan) return null;

  const [formData, setFormData] = useState({ ...plan });
  const [newFeatureText, setNewFeatureText] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        limits: { ...plan.limits },
        features: [...plan.features],
        settings: { ...plan.settings }
      });
      setNewFeatureText('');
      setConfirmDialog(null);
    }
  }, [plan]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLimitChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      limits: {
        ...prev.limits,
        [field]: value
      }
    }));
  };

  const handleSettingToggle = (settingKey, currentVal) => {
    const newVal = !currentVal;

    // Guard: Deactivate Plan
    if (settingKey === 'status' && currentVal === 'Active') {
      setConfirmDialog({
        title: 'Deactivate Plan?',
        message:
          'Existing organizations subscribed to this plan will not be automatically deleted. However, new organizations will not be able to subscribe to this plan.',
        confirmText: 'Deactivate Plan',
        isDanger: true,
        onConfirm: () => {
          setFormData((prev) => ({ ...prev, status: 'Inactive' }));
          setConfirmDialog(null);
        }
      });
      return;
    }

    // Guard: Most Popular Exclusivity
    if (settingKey === 'isPopular' && newVal === true) {
      const currentPopular = allPlans.find((p) => p.isPopular && p.id !== plan.id);
      if (currentPopular) {
        setConfirmDialog({
          title: 'Set as Most Popular?',
          message: `${currentPopular.name} is currently marked as the most popular plan. Do you want to move the badge to ${formData.name}?`,
          confirmText: 'Confirm',
          isDanger: false,
          onConfirm: () => {
            setFormData((prev) => ({ ...prev, isPopular: true }));
            setConfirmDialog(null);
          }
        });
        return;
      }
    }

    if (settingKey === 'status') {
      setFormData((prev) => ({ ...prev, status: 'Active' }));
    } else if (settingKey === 'isPopular') {
      setFormData((prev) => ({ ...prev, isPopular: newVal }));
    } else {
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingKey]: newVal
        }
      }));
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureText.trim()]
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleFeatureChange = (idx, value) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[idx] = value;
      return { ...prev, features: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Guard: Free plan converted to Paid
    if (plan.id === 'plan-free' && Number(formData.price) > 0 && plan.price === 0) {
      setConfirmDialog({
        title: 'Convert Free Plan to Paid Plan?',
        message:
          'Organizations currently on the Free tier may be affected. Are you sure you want to assign a monetary price to the Free starter tier?',
        confirmText: 'Confirm Conversion',
        isDanger: true,
        onConfirm: () => {
          setConfirmDialog(null);
          onSavePlan(formData);
        }
      });
      return;
    }

    onSavePlan(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                plan.id === 'plan-pro'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                  : plan.id === 'plan-enterprise'
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/60'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {plan.id === 'plan-pro' ? (
                <Sparkles className="w-5 h-5" />
              ) : plan.id === 'plan-enterprise' ? (
                <Crown className="w-5 h-5" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Edit Subscription Plan
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    plan.id === 'plan-pro'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : plan.id === 'plan-enterprise'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {formData.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure pricing, feature quotas, and organizational usage policies.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form id="edit-plan-form" onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* 1. Plan Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 block">Plan Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 block">Subtitle / Tier Tag</label>
              <input
                type="text"
                value={formData.tag || ''}
                onChange={(e) => handleFieldChange('tag', e.target.value)}
                placeholder="e.g. Growing teams"
                className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-900 block">Plan Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all leading-relaxed"
              />
            </div>
          </div>

          {/* 2. Pricing & Billing */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pricing & Billing Cycle
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={formData.price}
                  onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Currency</label>
                <select
                  value={formData.currency || 'INR'}
                  onChange={(e) => handleFieldChange('currency', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Billing Period</label>
                <select
                  value={formData.billingPeriod}
                  onChange={(e) => handleFieldChange('billingPeriod', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Forever">Forever</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Plan Limits */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Plan Resource Limits
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Max Events */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Max Events</label>
                  <label className="flex items-center space-x-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.limits?.unlimitedEvents)}
                      onChange={(e) => handleLimitChange('unlimitedEvents', e.target.checked)}
                      className="w-3 h-3 rounded text-blue-600"
                    />
                    <span>Unlimited</span>
                  </label>
                </div>
                <input
                  type="number"
                  min={0}
                  disabled={formData.limits?.unlimitedEvents}
                  value={formData.limits?.unlimitedEvents ? 0 : formData.limits?.events || 0}
                  onChange={(e) => handleLimitChange('events', parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-50 disabled:opacity-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Max Users */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Max Users</label>
                  <label className="flex items-center space-x-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.limits?.unlimitedUsers)}
                      onChange={(e) => handleLimitChange('unlimitedUsers', e.target.checked)}
                      className="w-3 h-3 rounded text-blue-600"
                    />
                    <span>Unlimited</span>
                  </label>
                </div>
                <input
                  type="number"
                  min={0}
                  disabled={formData.limits?.unlimitedUsers}
                  value={formData.limits?.unlimitedUsers ? 0 : formData.limits?.users || 0}
                  onChange={(e) => handleLimitChange('users', parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-50 disabled:opacity-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Max Organizations */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">Max Organizations</label>
                <input
                  type="number"
                  min={1}
                  value={formData.limits?.organizations || 10}
                  onChange={(e) => handleLimitChange('organizations', parseInt(e.target.value, 10) || 10)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* 4. Editable Feature List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Included Features
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {formData.features.length} features
              </span>
            </div>

            <div className="space-y-2">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete feature"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Feature input */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="Enter new feature description..."
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          {/* 5. Plan Settings & Toggles */}
          <div className="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Plan Configuration & Badges
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Active Plan */}
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                <div>
                  <span className="font-bold text-slate-900 block">Active Plan</span>
                  <span className="text-[10px] text-slate-500">Available for subscriptions</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingToggle('status', formData.status)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    formData.status === 'Active' ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Most Popular */}
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                <div>
                  <span className="font-bold text-slate-900 block">Most Popular Badge</span>
                  <span className="text-[10px] text-slate-500">Visual focal highlight</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingToggle('isPopular', formData.isPopular)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    formData.isPopular ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* AI Features */}
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                <div>
                  <span className="font-bold text-slate-900 block">AI Studio Features</span>
                  <span className="text-[10px] text-slate-500">Gemini generative tools</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingToggle('aiFeatures', formData.settings?.aiFeatures)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    formData.settings?.aiFeatures ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Custom Branding */}
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                <div>
                  <span className="font-bold text-slate-900 block">Custom Branding</span>
                  <span className="text-[10px] text-slate-500">White-label portal</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingToggle('customBranding', formData.settings?.customBranding)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    formData.settings?.customBranding ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Priority Support */}
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60 sm:col-span-2">
                <div>
                  <span className="font-bold text-slate-900 block">Priority Support</span>
                  <span className="text-[10px] text-slate-500">24/7 SLA & dedicated account manager</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingToggle('prioritySupport', formData.settings?.prioritySupport)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    formData.settings?.prioritySupport ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* 6. Current Usage (Read-Only) */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Current Platform Usage (Read-Only)
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-xl p-2.5 border border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 block">Subscribers</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {formData.usage?.organizations || 0} Organizations
                </span>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 block">Current Users</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {formData.usage?.users || 0}
                </span>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 block">Current Events</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {formData.usage?.events || 0}
                </span>
              </div>
            </div>
          </div>

          {/* 7. Delete Plan Protection */}
          <div className="flex items-center justify-between p-3.5 bg-rose-50/30 rounded-xl border border-rose-200/50">
            <div className="space-y-0.5 max-w-sm">
              <span className="font-bold text-rose-900 block text-xs">Delete Plan</span>
              <p className="text-[10px] text-rose-700 leading-snug">
                This plan cannot be deleted because organizations are currently subscribed to it.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-200 shrink-0"
              title="This plan cannot be deleted because organizations are currently subscribed to it."
            >
              Delete Plan
            </button>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-plan-form"
            className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Embedded Safety Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmDialog.isDanger
                    ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                    : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {confirmDialog.title}
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              {confirmDialog.message}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer shadow-xs ${
                  confirmDialog.isDanger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPlanModal;
