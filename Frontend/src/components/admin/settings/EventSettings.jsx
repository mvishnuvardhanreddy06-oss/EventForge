import React from 'react';
import SettingCard from './SettingCard';
import ToggleSetting from './ToggleSetting';
import SelectSetting from './SelectSetting';

const EventSettings = ({ settings, onChange, onSave }) => {
  return (
    <div className="space-y-6">
      <SettingCard
        title="Event Settings"
        subtitle="Default conference policies, participant capacity limits and scheduling rules"
      >
        <div className="space-y-4 text-xs">
          <div className="divide-y divide-slate-100">
            <SelectSetting
              id="defaultEventVisibility"
              label="Default Event Visibility"
              description="Baseline privacy scope applied when an organizer creates a conference."
              value={settings.defaultEventVisibility}
              onChange={(val) => onChange('defaultEventVisibility', val)}
              options={['Private', 'Public', 'Organization Only']}
            />

            <ToggleSetting
              id="allowEventRegistration"
              label="Allow Event Registration"
              description="Permit attendees to claim passes and tickets across published events."
              checked={settings.allowEventRegistration}
              onChange={(val) => onChange('allowEventRegistration', val)}
            />

            <ToggleSetting
              id="allowWaitlist"
              label="Allow Automated Waitlist"
              description="Automatically queue registrations in FIFO order when tier capacity is depleted."
              checked={settings.allowWaitlist}
              onChange={(val) => onChange('allowWaitlist', val)}
            />

            <ToggleSetting
              id="allowEventCancellation"
              label="Allow Event Cancellation"
              description="Permit organizers to cancel events with automated notifications to registered attendees."
              checked={settings.allowEventCancellation}
              onChange={(val) => onChange('allowEventCancellation', val)}
            />

            <ToggleSetting
              id="requireOrganizerApproval"
              label="Require Organizer Approval for Attendees"
              description="Force registrations into a pending state until an organizer explicitly approves."
              checked={settings.requireOrganizerApproval}
              onChange={(val) => onChange('requireOrganizerApproval', val)}
            />

            {/* Maximum Event Capacity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3">
              <div className="space-y-0.5 max-w-md">
                <label className="text-xs font-bold text-slate-900 block">
                  Maximum Event Capacity
                </label>
                <p className="text-[11px] text-slate-500">
                  Global ceiling on total registrations per individual event.
                </p>
              </div>
              <input
                type="number"
                min={50}
                max={50000}
                value={settings.maxEventCapacity}
                onChange={(e) => onChange('maxEventCapacity', parseInt(e.target.value, 10) || 1000)}
                className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <SelectSetting
              id="defaultEventDuration"
              label="Default Event Duration"
              description="Preset timeframe assigned during new session scheduling."
              value={settings.defaultEventDuration}
              onChange={(val) => onChange('defaultEventDuration', val)}
              options={['1 hour', '2 hours', '4 hours', 'Full Day']}
            />

            <SelectSetting
              id="timezoneHandling"
              label="Timezone Handling"
              description="Rule governing how agenda session times are rendered to global participants."
              value={settings.timezoneHandling}
              onChange={(val) => onChange('timezoneHandling', val)}
              options={[
                'Use Organization Timezone',
                'Use Platform Timezone',
                'Use Attendee Local Timezone'
              ]}
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

export default EventSettings;
