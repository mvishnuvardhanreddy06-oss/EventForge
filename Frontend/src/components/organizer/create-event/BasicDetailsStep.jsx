import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import AIEventAssistant from './AIEventAssistant';

const EVENT_TYPES = [
  'Conference',
  'Workshop',
  'Seminar',
  'Exhibition',
  'Corporate Meeting',
  'Networking Event',
  'Webinar'
];

const CATEGORIES = [
  'Technology',
  'Business',
  'Finance',
  'Healthcare',
  'Education',
  'AI & Machine Learning',
  'Cloud',
  'Other'
];

const AUDIENCE_SIZES = [
  '50–100',
  '100–500',
  '500–1,000',
  '1,000–5,000',
  '5,000+'
];

const BasicDetailsStep = ({ formData, onChange, errors = {} }) => {
  const fileInputRef = useRef(null);

  const handleSimulateBanner = () => {
    // Curated high-res event conference banner
    onChange('bannerImage', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form Fields (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Basic Event Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter primary identifying details for your conference or event.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Event Name */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Event Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.eventName || ''}
                onChange={(e) => onChange('eventName', e.target.value)}
                placeholder="Enter your event name (e.g. Global Tech Leadership Summit 2026)"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 font-medium transition-all ${
                  errors.eventName
                    ? 'border-rose-300 ring-2 ring-rose-500/10 focus:border-rose-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {errors.eventName && (
                <p className="text-rose-600 text-[11px] font-semibold mt-1">
                  {errors.eventName}
                </p>
              )}
            </div>

            {/* Event Type & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Event Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.eventType || 'Conference'}
                  onChange={(e) => onChange('eventType', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold bg-white cursor-pointer"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Event Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category || 'Technology'}
                  onChange={(e) => onChange('category', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold bg-white cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expected Audience */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Expected Audience
              </label>
              <select
                value={formData.expectedAudience || '1,000–5,000'}
                onChange={(e) => onChange('expectedAudience', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold bg-white cursor-pointer"
              >
                {AUDIENCE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} attendees
                  </option>
                ))}
              </select>
            </div>

            {/* Short Description */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Short Description / Tagline <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription || ''}
                onChange={(e) => onChange('shortDescription', e.target.value)}
                placeholder="Describe your event in a few sentences..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 font-medium transition-all ${
                  errors.shortDescription
                    ? 'border-rose-300 ring-2 ring-rose-500/10 focus:border-rose-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {errors.shortDescription && (
                <p className="text-rose-600 text-[11px] font-semibold mt-1">
                  {errors.shortDescription}
                </p>
              )}
            </div>

            {/* Full Event Description */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Event Description
              </label>
              <textarea
                rows={5}
                value={formData.fullDescription || ''}
                onChange={(e) => onChange('fullDescription', e.target.value)}
                placeholder="Provide comprehensive details, themes, track highlights, and schedule context..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
            </div>

            {/* Event Banner Upload Dropzone */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Event Banner
              </label>
              {formData.bannerImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 group bg-slate-900">
                  <img
                    src={formData.bannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onChange('bannerImage', '')}
                      className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white shadow-xs backdrop-blur-xs transition-colors"
                      title="Remove banner"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2.5 left-3 text-[11px] text-white/90 font-semibold bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-xs">
                    Banner uploaded (1600 × 900)
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleSimulateBanner}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Upload event banner</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Recommended: 1600 × 900 px (JPG, PNG, WebP)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <AIEventAssistant
            eventName={formData.eventName}
            category={formData.category}
            onApplyDescription={(desc) => onChange('fullDescription', desc)}
            onApplyTagline={(tag) => onChange('shortDescription', tag)}
          />

          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-4 text-xs space-y-2 text-slate-600">
            <h5 className="font-bold text-slate-800">Event Creation Tips</h5>
            <p className="text-[11px] leading-relaxed">
              Clear titles and crisp short descriptions increase attendee conversion by over 30% in corporate summits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsStep;
