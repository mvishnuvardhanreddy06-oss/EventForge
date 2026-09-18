import React, { useState } from 'react';
import { Building2, Mail, Globe, Clock, Bell, Shield, Save, Check } from 'lucide-react';

const OrganizerSettings = () => {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    orgName: 'Apex Global Events',
    contactEmail: 'contact@apexevents.io',
    timezone: 'Asia/Kolkata (IST +5:30)',
    currency: 'INR (₹)',
    autoApproveRegistrations: true,
    emailNotifications: true,
    aiAssistEnabled: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="pb-1 border-b border-slate-200/80">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Manage event preferences, default configurations, and communications for Apex Global Events.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Organization Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Organization Name</label>
              <input
                type="text"
                value={formData.orgName}
                disabled
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Assigned by Platform Admin.</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Default Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option>Asia/Kolkata (IST +5:30)</option>
                <option>America/New_York (EST -5:00)</option>
                <option>Europe/London (GMT +0:00)</option>
                <option>Asia/Singapore (SGT +8:00)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Billing Currency</label>
              <input
                type="text"
                value={formData.currency}
                disabled
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Operational Automation */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Event Automation & Registration</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Auto-Approve Free Registrations</p>
                <p className="text-[11px] text-slate-500">Automatically issue confirmation QR passes upon attendee form submission.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.autoApproveRegistrations}
                onChange={(e) => setFormData({ ...formData, autoApproveRegistrations: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">AI Event Copilot Recommendations</p>
                <p className="text-[11px] text-slate-500">Enable real-time Gemini telemetry alerts for room capacity and attendee interest.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.aiAssistEnabled}
                onChange={(e) => setFormData({ ...formData, aiAssistEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Operational Email Digests</p>
                <p className="text-[11px] text-slate-500">Send daily registration summaries and check-in count reports to organizer team.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          {saved && (
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600">
              <Check className="w-3.5 h-3.5" />
              <span>Settings saved successfully!</span>
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizerSettings;
