import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import SettingCard from './SettingCard';
import ToggleSetting from './ToggleSetting';
import SelectSetting from './SelectSetting';

const SecuritySettings = ({ settings, onChange, onSave }) => {
  return (
    <div className="space-y-6">
      <SettingCard
        title="Security Settings"
        subtitle="Global authentication policies, token lifespans and brute-force defenses"
      >
        <div className="space-y-4 text-xs">
          {/* Security Banner */}
          <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-200/60 flex items-center space-x-2.5 text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-[11px] font-medium leading-relaxed">
              Security settings affect the entire EventForge platform and enforce compliance policies across all tenant organizations.
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Session Timeout */}
            <SelectSetting
              id="sessionTimeout"
              label="Session Timeout"
              description="Automatic idle sign-out duration for inactive user sessions."
              value={settings.sessionTimeout}
              onChange={(val) => onChange('sessionTimeout', val)}
              options={['15 minutes', '30 minutes', '1 hour', '2 hours', 'Never']}
            />

            {/* Minimum Password Length */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3">
              <div className="space-y-0.5 max-w-md">
                <label className="text-xs font-bold text-slate-900 block">
                  Minimum Password Length
                </label>
                <p className="text-[11px] text-slate-500">
                  Minimum required character length for newly set corporate passwords.
                </p>
              </div>
              <input
                type="number"
                min={8}
                max={32}
                value={settings.minPasswordLength}
                onChange={(e) => onChange('minPasswordLength', parseInt(e.target.value, 10) || 8)}
                className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Password Policy Toggles */}
            <ToggleSetting
              id="requireUppercase"
              label="Require Uppercase Character"
              description="Password must contain at least one uppercase alphabetic character [A-Z]."
              checked={settings.requireUppercase}
              onChange={(val) => onChange('requireUppercase', val)}
            />

            <ToggleSetting
              id="requireNumber"
              label="Require Number"
              description="Password must contain at least one numeric digit [0-9]."
              checked={settings.requireNumber}
              onChange={(val) => onChange('requireNumber', val)}
            />

            <ToggleSetting
              id="requireSpecialChar"
              label="Require Special Character"
              description="Password must include at least one symbol character (e.g. !@#$%^&*)."
              checked={settings.requireSpecialChar}
              onChange={(val) => onChange('requireSpecialChar', val)}
            />

            {/* 2FA */}
            <ToggleSetting
              id="allow2FA"
              label="Two-Factor Authentication (2FA)"
              description="Allow users to enable TOTP two-factor authentication on their profiles."
              checked={settings.allow2FA}
              onChange={(val) => onChange('allow2FA', val)}
            />

            {/* Rate-limit Repeated Login */}
            <ToggleSetting
              id="rateLimitLogins"
              label="Rate-Limit Repeated Login Attempts"
              description="Automatically throttle suspicious IP addresses after repeated failed logins."
              checked={settings.rateLimitLogins}
              onChange={(val) => onChange('rateLimitLogins', val)}
            />

            {/* Audit Logging */}
            <ToggleSetting
              id="auditLogging"
              label="Record Platform Activity (Audit Logging)"
              description="Continuously record administrative mutations, session states and security actions in the immutable audit ledger."
              checked={settings.auditLogging}
              onChange={(val) => onChange('auditLogging', val)}
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

export default SecuritySettings;
