import React from 'react';
import SettingCard from './SettingCard';
import ToggleSetting from './ToggleSetting';
import SelectSetting from './SelectSetting';

const GeneralSettings = ({ settings, onChange, onSave }) => {
  return (
    <div className="space-y-6">
      <SettingCard
        title="General Settings"
        subtitle="Global platform branding, time formats and regional locale"
        badge={
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span>Operational</span>
          </span>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Platform Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-900 block">Platform Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => onChange('platformName', e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          {/* Platform Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-900 block">Platform Description</label>
            <textarea
              rows={2}
              value={settings.platformDescription}
              onChange={(e) => onChange('platformDescription', e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all leading-relaxed"
            />
          </div>

          <div className="border-t border-slate-100 divide-y divide-slate-100">
            <SelectSetting
              id="defaultLanguage"
              label="Default Language"
              description="Primary language used across platform admin and workspace interfaces."
              value={settings.defaultLanguage}
              onChange={(val) => onChange('defaultLanguage', val)}
              options={['English', 'Spanish', 'French', 'German', 'Japanese']}
            />

            <SelectSetting
              id="timezone"
              label="Timezone"
              description="Platform baseline timezone for scheduling, analytics and audit stamps."
              value={settings.timezone}
              onChange={(val) => onChange('timezone', val)}
              options={[
                'Asia/Kolkata (IST)',
                'UTC',
                'America/New_York (EST)',
                'Europe/London (GMT)',
                'Asia/Singapore (SGT)'
              ]}
            />

            <SelectSetting
              id="dateFormat"
              label="Date Format"
              description="Display standard for timestamps, tickets and badges."
              value={settings.dateFormat}
              onChange={(val) => onChange('dateFormat', val)}
              options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
            />

            <SelectSetting
              id="defaultCurrency"
              label="Default Currency"
              description="Currency symbol used for subscriptions, ticketing and sponsorship invoices."
              value={settings.defaultCurrency}
              onChange={(val) => onChange('defaultCurrency', val)}
              options={[
                { value: 'INR', label: 'Indian Rupee (₹)' },
                { value: 'USD', label: 'US Dollar ($)' },
                { value: 'EUR', label: 'Euro (€)' },
                { value: 'GBP', label: 'British Pound (£)' }
              ]}
            />
          </div>

          {/* Maintenance Mode Toggle */}
          <div className="border-t border-slate-100 pt-3">
            <ToggleSetting
              id="maintenanceMode"
              label="Maintenance Mode"
              description="Temporarily restrict platform access while maintenance is in progress. Only Platform Admins can sign in when active."
              checked={settings.maintenanceMode}
              onChange={(val) => onChange('maintenanceMode', val)}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </SettingCard>
    </div>
  );
};

export default GeneralSettings;
