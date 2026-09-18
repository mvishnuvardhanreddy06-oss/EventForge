import React from 'react';
import SettingCard from './SettingCard';
import ToggleSetting from './ToggleSetting';

const NotificationSettings = ({ settings, onChange, onSave }) => {
  return (
    <div className="space-y-6">
      <SettingCard
        title="Notification Settings"
        subtitle="Global transactional email triggers and automated alert dispatches"
      >
        <div className="space-y-4 text-xs">
          {/* Master Toggle */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <ToggleSetting
              id="enableEmailNotifications"
              label="Enable Email Notifications (Master Switch)"
              description="Primary platform toggle for all outbound transactional email events."
              checked={settings.enableEmailNotifications}
              onChange={(val) => onChange('enableEmailNotifications', val)}
            />
          </div>

          {/* Granular Notification Triggers */}
          <div className="divide-y divide-slate-100 pt-1">
            <ToggleSetting
              id="notifyNewUserRegistration"
              label="New User Registration"
              description="Send verification notice to new users and summary alerts to administrators."
              checked={settings.notifyNewUserRegistration}
              disabled={!settings.enableEmailNotifications}
              onChange={(val) => onChange('notifyNewUserRegistration', val)}
            />

            <ToggleSetting
              id="notifyOrganizationCreated"
              label="Organization Created"
              description="Dispatch welcome packets and workspace credentials upon tenant provisioning."
              checked={settings.notifyOrganizationCreated}
              disabled={!settings.enableEmailNotifications}
              onChange={(val) => onChange('notifyOrganizationCreated', val)}
            />

            <ToggleSetting
              id="notifySubscriptionChanges"
              label="Subscription Changes"
              description="Invoices, plan upgrades, renewal confirmations and payment failure notifications."
              checked={settings.notifySubscriptionChanges}
              disabled={!settings.enableEmailNotifications}
              onChange={(val) => onChange('notifySubscriptionChanges', val)}
            />

            <ToggleSetting
              id="notifySecurityAlerts"
              label="Security Alerts"
              description="Immediate dispatch on suspicious logins, password resets and privilege alterations."
              checked={settings.notifySecurityAlerts}
              disabled={!settings.enableEmailNotifications}
              onChange={(val) => onChange('notifySecurityAlerts', val)}
            />

            <ToggleSetting
              id="notifyEventActivity"
              label="Event Activity"
              description="Attendee confirmations, waitlist promotions and session schedule changes."
              checked={settings.notifyEventActivity}
              disabled={!settings.enableEmailNotifications}
              onChange={(val) => onChange('notifyEventActivity', val)}
            />

            <ToggleSetting
              id="notifySystemAnnouncements"
              label="System Announcements"
              description="Platform-wide maintenance windows and compliance updates."
              checked={settings.notifySystemAnnouncements}
              disabled={!settings.enableEmailNotifications}
              onChange={(val) => onChange('notifySystemAnnouncements', val)}
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

export default NotificationSettings;
