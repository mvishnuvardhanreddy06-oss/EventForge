import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import SettingCard from './SettingCard';
import ToggleSetting from './ToggleSetting';
import SelectSetting from './SelectSetting';

const AVAILABLE_ROLES = [
  { key: 'organizer', label: 'Organizer', description: 'Can create conferences, venues, agendas and ticketing' },
  { key: 'staff', label: 'Staff', description: 'Can scan QR badges, record check-ins and support attendees' },
  { key: 'speaker', label: 'Speaker', description: 'Can manage sessions, upload materials and set availability' },
  { key: 'sponsor', label: 'Sponsor', description: 'Can manage sponsor packages, deliverables and brand assets' },
  { key: 'attendee', label: 'Attendee', description: 'Can register, receive QR passes and submit ratings' }
];

const UserRoleSettings = ({ settings, onChange, onSave }) => {
  const toggleRole = (roleKey) => {
    const current = settings.availableRoles || [];
    if (current.includes(roleKey)) {
      if (current.length > 1) {
        onChange('availableRoles', current.filter((r) => r !== roleKey));
      }
    } else {
      onChange('availableRoles', [...current, roleKey]);
    }
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="Users & Roles"
        subtitle="Public registration controls, verification requirements and role availability"
      >
        <div className="space-y-4 text-xs">
          {/* Protected Sole Admin Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-start space-x-3 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              VR
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm">Vishnureddy</span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold rounded">
                  SOLE PLATFORM ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                mvishnuvardhanreddy33@gmail.com · The Platform Admin role is strictly protected and cannot be assigned to public registrations.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <ToggleSetting
              id="allowRegistration"
              label="Allow User Registration"
              description="Enable public sign-up on the registration route (/register)."
              checked={settings.allowRegistration}
              onChange={(val) => onChange('allowRegistration', val)}
            />

            <ToggleSetting
              id="requireEmailVerification"
              label="Email Verification Required"
              description="Users must verify their corporate email before gaining dashboard access."
              checked={settings.requireEmailVerification}
              onChange={(val) => onChange('requireEmailVerification', val)}
            />

            <SelectSetting
              id="defaultUserStatus"
              label="Default New User Status"
              description="Initial state applied to newly registered accounts pending review."
              value={settings.defaultUserStatus}
              onChange={(val) => onChange('defaultUserStatus', val)}
              options={['Pending', 'Active', 'Inactive']}
            />
          </div>

          {/* Available Roles Checklist */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Available Self-Registration Roles
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Roles permissible during onboarding. Platform Admin is permanently excluded.
              </p>
            </div>

            <div className="space-y-2">
              {AVAILABLE_ROLES.map((role) => {
                const isChecked = (settings.availableRoles || []).includes(role.key);
                return (
                  <label
                    key={role.key}
                    className={`flex items-start space-x-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-blue-50/50 border-blue-200/80'
                        : 'bg-white border-slate-200/70 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleRole(role.key)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 text-xs block">
                        {role.label}
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug mt-0.5 block">
                        {role.description}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
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

export default UserRoleSettings;
