import React from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import SettingCard from './SettingCard';
import SelectSetting from './SelectSetting';

const EmailSettings = ({ settings, onChange, onSave, onTestEmail }) => {
  return (
    <div className="space-y-6">
      <SettingCard
        title="Email Configuration"
        subtitle="Outbound transactional email routing, sender identities and transport protocols"
        badge={
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Connected</span>
          </span>
        }
        actionButton={
          <button
            type="button"
            onClick={onTestEmail}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Test Email</span>
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Sender Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-900 block">Sender Name</label>
            <input
              type="text"
              value={settings.emailSenderName}
              onChange={(e) => onChange('emailSenderName', e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Email */}
            <div className="space-y-1">
              <label className="font-bold text-slate-900 block">Sender Email</label>
              <input
                type="email"
                value={settings.emailSenderAddress}
                onChange={(e) => onChange('emailSenderAddress', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono"
              />
            </div>

            {/* Reply-To Email */}
            <div className="space-y-1">
              <label className="font-bold text-slate-900 block">Reply-To Email</label>
              <input
                type="email"
                value={settings.emailReplyTo}
                onChange={(e) => onChange('emailReplyTo', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <SelectSetting
              id="emailProvider"
              label="Email Provider"
              description="Transport protocol for queuing and relaying outbound event notices."
              value={settings.emailProvider}
              onChange={(val) => onChange('emailProvider', val)}
              options={['SMTP', 'SendGrid', 'AWS SES', 'Resend']}
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Transport Security: TLS 1.3 Strict Encrypted Tunnel</span>
            <span className="font-mono text-slate-400">Port 587 (STARTTLS)</span>
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

export default EmailSettings;
