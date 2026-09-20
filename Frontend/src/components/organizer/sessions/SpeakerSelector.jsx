import React from 'react';
import { User, AlertCircle, CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react';

const SpeakerSelector = ({
  speakers = [],
  selectedSpeakerId,
  onChange,
  speakerConflict = null,
  onResolveConflict
}) => {
  const selectedSpeaker = speakers.find(
    (s) => s.id === selectedSpeakerId || s._id === selectedSpeakerId || s.name === selectedSpeakerId
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          Session Speaker *
        </label>
        {selectedSpeaker && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ● Confirmed Speaker
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={selectedSpeakerId || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
        >
          <option value="">-- Select Keynote or Track Speaker --</option>
          {speakers.map((sp) => {
            const spId = sp.id || sp._id || sp.name;
            return (
              <option key={spId} value={spId}>
                {sp.name} — {sp.designation || 'Speaker'} ({sp.company || 'Enterprise'})
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      {/* Selected Speaker Card */}
      {selectedSpeaker && (
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
              {selectedSpeaker.avatar || selectedSpeaker.profileImage ? (
                <img
                  src={selectedSpeaker.avatar || selectedSpeaker.profileImage}
                  alt={selectedSpeaker.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs">
                  {selectedSpeaker.name ? selectedSpeaker.name.slice(0, 2).toUpperCase() : 'SP'}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {selectedSpeaker.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {selectedSpeaker.designation || 'Guest Speaker'}
                {selectedSpeaker.company ? ` • ${selectedSpeaker.company}` : ''}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Available</span>
          </span>
        </div>
      )}

      {/* Speaker Collision Alert */}
      {speakerConflict && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
            <span>⚠ Speaker Conflict</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            <span className="font-bold">{speakerConflict.speakerName || 'Selected Speaker'}</span> is already assigned to:{' '}
            <span className="font-semibold text-slate-900">"{speakerConflict.conflictingSession}"</span> ({speakerConflict.timeSlot}).
          </p>
          <button
            type="button"
            onClick={onResolveConflict}
            className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200/80 rounded-lg transition-colors"
          >
            Choose Another Speaker
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeakerSelector;
