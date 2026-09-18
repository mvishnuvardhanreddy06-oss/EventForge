import React from 'react';
import { Calendar, MapPin, Users, Ticket, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import PublishChecklist from './PublishChecklist';

const ReviewStep = ({ formData, onPublish, onSaveDraft }) => {
  const sessions = formData.sessions || [];
  const speakers = formData.speakers || [];
  const sponsors = formData.sponsors || [];
  const tickets = formData.tickets || [];

  // Verification checks
  const missing = [];
  if (!formData.eventName) missing.push('Add event name');
  if (!formData.venueName && formData.venueType !== 'Online') missing.push('Add venue details');
  if (sessions.length === 0) missing.push('Add at least one agenda session');

  const isReady = missing.length === 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Review Your Event Summary
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Double-check all conference specifications before finalizing and opening registration.
          </p>
        </div>

        {/* 6 Core Summary Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Area 1: Basic Info */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              01 Basic Information
            </span>
            <h4 className="font-bold text-slate-900 text-sm leading-snug">
              {formData.eventName || 'Untitled Event'}
            </h4>
            <p className="text-slate-500 text-[11px]">
              {formData.eventType || 'Conference'} · {formData.category || 'Technology'}
            </p>
            <p className="text-slate-600 text-[11px] line-clamp-2">
              {formData.shortDescription || 'No description provided.'}
            </p>
          </div>

          {/* Area 2: Venue & Schedule */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              02 Venue & Schedule
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{formData.startDate || 'Sep 24, 2026'} – {formData.endDate || 'Sep 24, 2026'}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-600">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{formData.startTime || '09:00 AM'} – {formData.endTime || '06:00 PM'}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-600">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{formData.venueName || 'Hyderabad Convention Centre'}</span>
              </div>
              <p className="text-slate-500 pt-1">
                Max Capacity: <strong>{Number(formData.capacity || 1500).toLocaleString()}</strong>
              </p>
            </div>
          </div>

          {/* Area 3: Registration */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              03 Registration & Tickets
            </span>
            <div className="space-y-1 text-[11px]">
              <p className="text-slate-700">Status: <strong className="text-emerald-700">{formData.registrationStatus || 'Open'}</strong></p>
              <p className="text-slate-700">Ticket Tiers: <strong>{tickets.length} tiers</strong> configured</p>
              <p className="text-slate-700">Waitlist: <strong>{formData.enableWaitlist !== false ? 'Enabled' : 'Disabled'}</strong></p>
            </div>
          </div>

          {/* Area 4: Sessions */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              04 Agenda Sessions
            </span>
            <p className="text-xl font-black text-slate-900">{sessions.length} Sessions</p>
            <p className="text-[11px] text-slate-500">Scheduled across assigned tracks and rooms.</p>
          </div>

          {/* Area 5: Speakers */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              05 Confirmed Speakers
            </span>
            <p className="text-xl font-black text-slate-900">{speakers.length} Speakers</p>
            <p className="text-[11px] text-slate-500">Keynote presenters and panelists confirmed.</p>
          </div>

          {/* Area 6: Sponsors */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              06 Sponsors
            </span>
            <p className="text-xl font-black text-slate-900">{sponsors.length} Sponsors</p>
            <p className="text-[11px] text-slate-500">Corporate partnerships & package deliverables.</p>
          </div>
        </div>
      </div>

      {/* Verification Checklist */}
      <PublishChecklist
        isReady={isReady}
        missingItems={missing}
        onPublish={onPublish}
        onSaveDraft={onSaveDraft}
      />
    </div>
  );
};

export default ReviewStep;
