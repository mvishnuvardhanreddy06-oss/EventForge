import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';
import MaterialStatusBadge from './MaterialStatusBadge';

const MaterialReviewModal = ({
  isOpen,
  onClose,
  material = null,
  speakerName = 'Speaker',
  onApprove,
  onRequestChanges
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  if (!isOpen || !material) return null;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onApprove(material.id || 'mat-1');
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleRequestChanges = () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onRequestChanges(material.id || 'mat-1', feedback);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Review Presentation Material
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Uploaded by <strong className="text-slate-800">{speakerName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* File Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-blue-600 shadow-2xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate" title={material.name}>
                    {material.name || 'Presentation_Deck_2026.pdf'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {material.fileSize || '14.2 MB'} • {material.type || 'Slide Deck'} • Uploaded {material.uploadDate || 'Sep 18, 2026'}
                  </p>
                </div>
              </div>

              <MaterialStatusBadge status={material.status || 'pending review'} size="xs" />
            </div>

            {/* Slide Preview Simulated Canvas */}
            <div className="h-40 rounded-xl bg-slate-900 text-white p-4 flex flex-col justify-between relative overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Slide 1 / 28</span>
                <span>16:9 HD Presentation</span>
              </div>
              <div className="space-y-1 my-auto text-center">
                <p className="text-base font-black text-white tracking-tight">
                  Autonomous AI in the Enterprise
                </p>
                <p className="text-xs text-blue-400 font-medium">
                  {speakerName} • Global Tech Leadership Summit 2026
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Confidential — Apex Global Events</span>
                <span className="text-emerald-400 font-bold">✓ Formatted & Checked</span>
              </div>
            </div>
          </div>

          {/* Request Changes Feedback Box */}
          {showFeedbackInput ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-amber-900">
                Specify Requested Adjustments for {speakerName}:
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. Please replace slide 4 with updated Q3 metrics and ensure font sizes comply with 16:9 projection standards."
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowFeedbackInput(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-black/5 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleRequestChanges}
                  disabled={!feedback.trim() || isSubmitting}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl flex items-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Revision Request</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
              <span>Need updates from speaker?</span>
              <button
                type="button"
                onClick={() => setShowFeedbackInput(true)}
                className="font-bold text-amber-700 hover:underline"
              >
                Request Revisions
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => alert(`Downloading ${material.name}...`)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleApprove}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Material</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialReviewModal;
