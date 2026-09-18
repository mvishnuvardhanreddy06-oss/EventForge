import React, { useState } from 'react';
import { Sparkles, Wand2, Lightbulb, RefreshCw, Check } from 'lucide-react';

const AIEventAssistant = ({ eventName, category, onApplyDescription, onApplyTagline }) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const [appliedAction, setAppliedAction] = useState(null);

  const handleGenerateDesc = () => {
    setLoadingAction('desc');
    setTimeout(() => {
      const generated = `Join top enterprise leaders, innovators, and subject matter specialists at ${eventName || 'this annual summit'}. Designed for high-impact decision makers, this multi-track conference delivers keynotes on architecture resilience, interactive workshops on bleeding-edge technologies, and executive networking sessions with peers worldwide.`;
      onApplyDescription(generated);
      setLoadingAction(null);
      setAppliedAction('desc');
      setTimeout(() => setAppliedAction(null), 2500);
    }, 600);
  };

  const handleImproveDesc = () => {
    setLoadingAction('improve');
    setTimeout(() => {
      const improved = `Experience an immersive, forward-looking conference tailored for professionals in ${category || 'technology'}. Engage with visionary keynotes, hands-on masterclasses, and curated networking forums engineered to accelerate corporate transformation.`;
      onApplyDescription(improved);
      setLoadingAction(null);
      setAppliedAction('improve');
      setTimeout(() => setAppliedAction(null), 2500);
    }, 600);
  };

  const handleGenerateTagline = () => {
    setLoadingAction('tagline');
    setTimeout(() => {
      const taglines = [
        'Shaping Tomorrow: The Premier Enterprise Leadership & Innovation Forum',
        'Accelerating Cloud Resilience & Generative Transformation at Scale',
        'Where Industry Visionaries Connect, Collaborate, and Catalyze Growth'
      ];
      const selected = taglines[Math.floor(Math.random() * taglines.length)];
      onApplyTagline(selected);
      setLoadingAction(null);
      setAppliedAction('tagline');
      setTimeout(() => setAppliedAction(null), 2500);
    }, 500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-white rounded-2xl border border-indigo-200/70 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>AI Event Assistant</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
          Google Gemini
        </span>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-900 leading-snug">
          Let AI help you create your event content.
        </h4>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          Generate compelling conference descriptions and taglines based on your event title and category.
        </p>
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleGenerateDesc}
          disabled={loadingAction !== null}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-indigo-100 text-xs font-bold text-slate-800 transition-colors shadow-2xs group"
        >
          <div className="flex items-center space-x-2">
            <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate Description</span>
          </div>
          {loadingAction === 'desc' ? (
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
          ) : appliedAction === 'desc' ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <span className="text-[10px] text-slate-400 group-hover:text-indigo-600">Apply →</span>
          )}
        </button>

        <button
          type="button"
          onClick={handleImproveDesc}
          disabled={loadingAction !== null}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-indigo-100 text-xs font-bold text-slate-800 transition-colors shadow-2xs group"
        >
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Improve Description</span>
          </div>
          {loadingAction === 'improve' ? (
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          ) : appliedAction === 'improve' ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <span className="text-[10px] text-slate-400 group-hover:text-blue-600">Apply →</span>
          )}
        </button>

        <button
          type="button"
          onClick={handleGenerateTagline}
          disabled={loadingAction !== null}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-indigo-100 text-xs font-bold text-slate-800 transition-colors shadow-2xs group"
        >
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Generate Event Tagline</span>
          </div>
          {loadingAction === 'tagline' ? (
            <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          ) : appliedAction === 'tagline' ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <span className="text-[10px] text-slate-400 group-hover:text-amber-600">Apply →</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIEventAssistant;
