import React from 'react';
import { Sparkles, BrainCircuit, Cpu } from 'lucide-react';
import SettingCard from './SettingCard';
import ToggleSetting from './ToggleSetting';

const AISettings = ({ settings, onChange, onSave }) => {
  return (
    <div className="space-y-6">
      <SettingCard
        title="AI & Intelligence"
        subtitle="Google Gemini generative assistant, intelligent scheduling and attendee matching"
      >
        <div className="space-y-4 text-xs">
          {/* Informational Card */}
          <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-200/60 space-y-1.5 text-indigo-950">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>EventForge Neural Studio Engine</span>
            </div>
            <p className="text-[11px] leading-relaxed text-indigo-900/80">
              AI features are used to assist organizers and attendees with content generation, recommendations and event insights. Powered by Google Gemini 1.5 with automated fallback caching.
            </p>
          </div>

          {/* Master AI Toggle */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <ToggleSetting
              id="masterAIFeatures"
              label="Master AI Features Switch"
              description="Global kill-switch for all neural API queries across all organizations."
              checked={settings.masterAIFeatures}
              onChange={(val) => onChange('masterAIFeatures', val)}
            />
          </div>

          {/* Granular AI Toggles */}
          <div className="divide-y divide-slate-100 pt-1">
            <ToggleSetting
              id="aiContentGeneration"
              label="AI Content Generation"
              description="Draft session descriptions, speaker bios and marketing emails in AI Studio."
              checked={settings.aiContentGeneration}
              disabled={!settings.masterAIFeatures}
              onChange={(val) => onChange('aiContentGeneration', val)}
            />

            <ToggleSetting
              id="sessionRecommendations"
              label="Session Recommendations"
              description="Match attendee interests to conference tracks with percentage relevance scores."
              checked={settings.sessionRecommendations}
              disabled={!settings.masterAIFeatures}
              onChange={(val) => onChange('sessionRecommendations', val)}
            />

            <ToggleSetting
              id="aiEventInsights"
              label="AI Event Insights"
              description="Automated telemetry observations analyzing registrations, attendance and drop-offs."
              checked={settings.aiEventInsights}
              disabled={!settings.masterAIFeatures}
              onChange={(val) => onChange('aiEventInsights', val)}
            />

            <ToggleSetting
              id="aiSummaries"
              label="AI Summaries"
              description="Post-event executive summaries generated from session notes and attendee ratings."
              checked={settings.aiSummaries}
              disabled={!settings.masterAIFeatures}
              onChange={(val) => onChange('aiSummaries', val)}
            />

            <ToggleSetting
              id="aiUsageTracking"
              label="AI Usage Tracking"
              description="Log prompt token counts, latency metrics and API volume in Platform Analytics."
              checked={settings.aiUsageTracking}
              disabled={!settings.masterAIFeatures}
              onChange={(val) => onChange('aiUsageTracking', val)}
            />

            <ToggleSetting
              id="enforceAIUsageLimits"
              label="Enforce Organization AI Usage Limits"
              description="Restrict generative queries according to tenant tier (Free: 10/mo, Pro: 500/mo, Enterprise: Unlimited)."
              checked={settings.enforceAIUsageLimits}
              disabled={!settings.masterAIFeatures}
              onChange={(val) => onChange('enforceAIUsageLimits', val)}
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

export default AISettings;
