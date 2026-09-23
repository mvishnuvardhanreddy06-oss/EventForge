import React, { useState, useEffect } from 'react';
import { sponsorPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import {
  PackageCheck,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  FileCheck,
  ExternalLink,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const Deliverables = () => {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Upload modal state
  const [uploadModalItem, setUploadModalItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchDeliverables = async () => {
    try {
      const res = await sponsorPortalService.getDeliverables();
      if (res.data?.success) {
        setDeliverables(res.data.data.deliverables || []);
      }
    } catch (err) {
      console.error('Failed to fetch deliverables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverables();
  }, []);

  const handleOpenUpload = (item) => {
    setUploadModalItem(item);
    setSelectedFile(null);
    setNotes('');
    setUploadError('');
    setUploadSuccess('');
  };

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload (up to 20MB).');
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setUploadError('File size exceeds the 20MB limit.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (notes) formData.append('notes', notes);

      const res = await sponsorPortalService.uploadDeliverable(
        uploadModalItem.sponsorshipId,
        uploadModalItem._id,
        formData
      );

      if (res.data?.success) {
        setUploadSuccess('Asset uploaded successfully! The organizer will review it.');
        setTimeout(() => {
          setUploadModalItem(null);
          fetchDeliverables();
        }, 1200);
      } else {
        setUploadError(res.data?.message || 'Failed to upload asset.');
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader text="Loading your contract deliverables..." />;

  const filtered = deliverables.filter(d => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  const totalCount = deliverables.length;
  const approvedCount = deliverables.filter(d => d.status === 'completed' || d.status === 'approved').length;
  const actionCount = deliverables.filter(d => d.status === 'changes_requested' || d.status === 'pending').length;
  const progressPct = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 100;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Deliverables & Materials Tracker</h1>
        <p className="text-xs text-slate-500 mt-1">
          Fulfill contractual obligations: upload high-res vector logos, executive speaker bios, swag specs, and exhibition booth requirements.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Deliverables</span>
          <p className="text-xl font-black text-slate-900 mt-1">{totalCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved / Completed</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{approvedCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Action Needed</span>
          <p className="text-xl font-black text-amber-600 mt-1">{actionCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
          <p className="text-xl font-black text-purple-600 mt-1">{progressPct}%</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Items' },
          { key: 'pending', label: 'Pending' },
          { key: 'submitted', label: 'Under Review' },
          { key: 'changes_requested', label: 'Changes Requested' },
          { key: 'approved', label: 'Approved' },
          { key: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              statusFilter === tab.key
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deliverables List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No deliverables found</p>
          <p className="text-xs text-slate-400">All deliverables in this filter view have been cleared or are up to date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const isApproved = item.status === 'completed' || item.status === 'approved';
            const isChangesRequested = item.status === 'changes_requested';
            const isSubmitted = item.status === 'submitted';

            return (
              <div
                key={item._id}
                className={`bg-white rounded-3xl border p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                  isChangesRequested ? 'border-rose-200 ring-2 ring-rose-500/10' : 'border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.eventTitle || 'Conference Deliverable'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold capitalize ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-700'
                        : isChangesRequested
                        ? 'bg-rose-100 text-rose-700'
                        : isSubmitted
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status?.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.description || 'Deliverable required by sponsorship agreement.'}
                    </p>
                  </div>

                  {item.dueDate && (
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due: {formatDate(item.dueDate)}</span>
                    </div>
                  )}

                  {/* Feedback Callout */}
                  {isChangesRequested && item.feedback && (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/80 text-xs text-rose-800 space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Action Required: Organizer Feedback</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-rose-700">{item.feedback}</p>
                    </div>
                  )}

                  {/* Uploaded File Link */}
                  {item.assetUrl && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">Asset on file</span>
                      </div>
                      <a
                        href={item.assetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center space-x-1 text-xs font-semibold shrink-0"
                      >
                        <span>Download</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Max size: 20MB (PDF, PNG, SVG, MP4, ZIP)
                  </span>

                  <button
                    onClick={() => handleOpenUpload(item)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                      isChangesRequested
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
                        : isApproved
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isChangesRequested ? 'Submit Revision' : item.assetUrl ? 'Replace File' : 'Upload Asset'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalItem && (
        <Modal
          isOpen={!!uploadModalItem}
          onClose={() => !uploading && setUploadModalItem(null)}
          title={`Upload Asset: ${uploadModalItem.name}`}
        >
          <form onSubmit={handleSubmitUpload} className="space-y-4">
            <p className="text-xs text-slate-600">
              Provide your official asset for <strong>{uploadModalItem.name}</strong>. Supported formats include high-resolution vector logos (SVG, PNG, EPS), presentation decks (PDF, PPTX), marketing video reels (MP4), or archive bundles (ZIP).
            </p>

            {uploadError && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {/* File Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select File (Max 20MB) *</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && (
                <p className="text-[11px] text-slate-500">
                  Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Submission Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Add any instructions, aspect ratio requirements, or color palette guidelines for the organizer team..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setUploadModalItem(null)}
                disabled={uploading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-2xs disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit for Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Deliverables;
