import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Check,
  AlertTriangle,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Download
} from 'lucide-react';
import MaterialStatusBadge from './MaterialStatusBadge';

const SpeakerMaterials = ({
  materials = {},
  speakerName = '',
  onUploadMaterial,
  onReviewMaterial
}) => {
  const [activeMaterials, setActiveMaterials] = useState([
    {
      id: 'mat-1',
      name: 'Presentation Slides.pdf',
      type: 'Presentation',
      status: materials.presentationStatus || 'approved',
      uploadDate: 'Sep 18, 2026',
      fileSize: '14.2 MB'
    },
    {
      id: 'mat-2',
      name: 'Executive Speaker Bio.pdf',
      type: 'Speaker Bio',
      status: materials.bioStatus || 'approved',
      uploadDate: 'Sep 16, 2026',
      fileSize: '1.8 MB'
    },
    {
      id: 'mat-3',
      name: 'High-Res Headshot.png',
      type: 'Profile Photo',
      status: 'approved',
      uploadDate: 'Sep 15, 2026',
      fileSize: '4.5 MB'
    }
  ]);

  const fileInputRef = useRef(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [reviewFeedback, setReviewFeedback] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: `mat-${Date.now()}`,
      name: file.name,
      type: 'Presentation',
      status: 'pending review',
      uploadDate: 'Just now',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    setActiveMaterials((prev) => [newDoc, ...prev]);
    onUploadMaterial?.(newDoc);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApprove = (id) => {
    setActiveMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'approved' } : m))
    );
    onReviewMaterial?.(id, 'approved');
  };

  const handleRequestChanges = (id) => {
    if (!reviewFeedback.trim()) return;
    setActiveMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'needs changes', feedback: reviewFeedback } : m))
    );
    onReviewMaterial?.(id, 'needs changes', reviewFeedback);
    setSelectedReviewItem(null);
    setReviewFeedback('');
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Presentation Materials ({activeMaterials.length})</span>
        </h4>

        {/* Upload Trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Material</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.png"
          className="hidden"
        />
      </div>

      {/* Materials List */}
      <div className="space-y-2">
        {activeMaterials.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-xs truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.type} • {item.fileSize} • Uploaded {item.uploadDate}
                  </p>
                </div>
              </div>

              <MaterialStatusBadge status={item.status} size="xs" />
            </div>

            {/* Review feedback note if changes requested */}
            {item.feedback && (
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-200/70 text-[11px] text-orange-800">
                ⚠ Feedback: {item.feedback}
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => alert(`Viewing material: ${item.name}`)}
                className="font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>View</span>
              </button>

              <div className="flex items-center space-x-1.5">
                {item.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(item.id)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    ✓ Approve
                  </button>
                )}

                {item.status !== 'needs changes' && (
                  <button
                    type="button"
                    onClick={() => setSelectedReviewItem(item)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    Request Changes
                  </button>
                )}
              </div>
            </div>

            {/* Inline Feedback Prompt when requesting changes */}
            {selectedReviewItem?.id === item.id && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-2">
                <label className="block text-[11px] font-bold text-slate-700">
                  Specify Requested Revisions:
                </label>
                <input
                  type="text"
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="e.g. Please upload the final 16:9 presentation slides before September 22."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReviewItem(null)}
                    className="px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-200/60 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestChanges(item.id)}
                    className="px-2.5 py-1 text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-md"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakerMaterials;
