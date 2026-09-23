import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { speakerPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  X,
  RefreshCw,
  FolderArchive,
  FileSpreadsheet
} from 'lucide-react';

const ALLOWED_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'zip'];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

const Materials = () => {
  const [searchParams] = useSearchParams();
  const preselectedSessionId = searchParams.get('sessionId') || '';

  const [materials, setMaterials] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(Boolean(preselectedSessionId));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form State
  const [formSessionId, setFormSessionId] = useState(preselectedSessionId);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matRes, sessRes] = await Promise.all([
        speakerPortalService.getMaterials(),
        speakerPortalService.getSessions()
      ]);
      if (matRes.success && matRes.data) {
        setMaterials(matRes.data.materials || []);
      }
      if (sessRes.success && sessRes.data) {
        setSessions(sessRes.data.sessions || []);
        if (!formSessionId && sessRes.data.sessions.length > 0) {
          setFormSessionId(sessRes.data.sessions[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load materials data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds 20 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB selected).`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Invalid file format .${ext}. Only PDF, PPT, PPTX, DOC, DOCX, ZIP files are allowed.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    if (!formTitle) {
      setFormTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formSessionId) {
      setError('Please select a session for this presentation material.');
      return;
    }
    if (!formTitle.trim()) {
      setError('Please provide a title for the presentation deck.');
      return;
    }
    if (!selectedFile) {
      setError('Please select a presentation file to upload.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('sessionId', formSessionId);
      formData.append('title', formTitle);
      formData.append('description', formDescription);
      formData.append('file', selectedFile);

      const res = await speakerPortalService.uploadMaterial(formData);
      if (res.success) {
        setSuccessToast('Presentation material uploaded successfully!');
        setUploadModalOpen(false);
        setFormTitle('');
        setFormDescription('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await loadData();
        setTimeout(() => setSuccessToast(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload presentation.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (sessionId, materialId) => {
    if (!window.confirm('Are you sure you want to delete this presentation file?')) {
      return;
    }

    try {
      const res = await speakerPortalService.deleteMaterial(sessionId, materialId);
      if (res.success) {
        setSuccessToast('Material deleted successfully.');
        setMaterials(prev => prev.filter(m => m._id !== materialId));
        setTimeout(() => setSuccessToast(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete presentation material.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Approved</span>;
      case 'Under Review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Under Review</span>;
      case 'Changes Requested':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Changes Requested</span>;
      case 'Uploaded':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Uploaded</span>;
    }
  };

  const getFileIcon = (fileType) => {
    const t = (fileType || '').toLowerCase();
    if (t.includes('zip')) return <FolderArchive className="w-5 h-5 text-amber-600" />;
    if (t.includes('ppt')) return <FileSpreadsheet className="w-5 h-5 text-orange-600" />;
    return <FileText className="w-5 h-5 text-purple-600" />;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Presentation Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Upload presentations and supporting materials for your sessions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError('');
            setUploadModalOpen(true);
          }}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Material</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* DRAG-AND-DROP CALLOUT */}
      <div
        onClick={() => {
          setError('');
          setUploadModalOpen(true);
        }}
        className="border-2 border-dashed border-purple-200 rounded-3xl p-6 sm:p-8 bg-purple-50/40 text-center hover:bg-purple-50/70 transition-colors cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-2xl bg-white text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-2xs group-hover:scale-105 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Upload Presentation Slide Deck</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Supported formats: PDF, PPT, PPTX, DOC, DOCX, ZIP (Maximum file size: 20 MB). AV technicians inspect slides for aspect ratio and embedded fonts.
        </p>
        <span className="inline-block mt-3 px-3.5 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-2xs">
          Select Session & Choose File
        </span>
      </div>

      {/* MATERIALS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Uploaded Presentation Files ({materials.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Securely stored and encrypted</span>
        </div>

        {loading ? (
          <div className="p-8">
            <Loader text="Loading your materials..." />
          </div>
        ) : materials.length === 0 ? (
          <div className="p-12 text-center max-w-sm mx-auto space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No Materials Uploaded</p>
            <p className="text-[11px] text-slate-400">
              You haven't uploaded any presentations yet. Click "Upload Material" to attach slides to your speaking session.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Material Title</th>
                  <th className="px-4 py-3">Target Session</th>
                  <th className="px-4 py-3">Format / Size</th>
                  <th className="px-4 py-3">Uploaded Date</th>
                  <th className="px-4 py-3">Review Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {materials.map((mat) => (
                  <tr key={mat._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                          {getFileIcon(mat.fileType)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-xs">{mat.title}</p>
                          {mat.description && (
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{mat.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900 truncate max-w-xs">{mat.sessionTitle}</p>
                      <p className="text-[10px] text-purple-700">{mat.eventTitle}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-800 uppercase">{mat.fileType}</span>
                      <span className="text-slate-400 ml-1.5">• {mat.fileSize}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(mat.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      {getStatusBadge(mat.status)}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => alert(`Opening preview for ${mat.title}`)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 rounded-lg hover:bg-slate-100"
                          title="View Slide Deck"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading ${mat.title}`)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
                          title="Download Copy"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormSessionId(mat.sessionId);
                            setFormTitle(mat.title);
                            setUploadModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          title="Replace Material"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMaterial(mat.sessionId, mat._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="Delete Material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPLOAD MATERIAL MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Upload Presentation Material</span>
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Speaking Session *
                </label>
                <select
                  value={formSessionId}
                  onChange={(e) => setFormSessionId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                >
                  <option value="">Select an assigned session...</option>
                  {sessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title} ({s.eventTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Material Name *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. AI-Infrastructure-Keynote-Deck-v2"
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Slide Notes (Optional)
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Add notes for the AV team (e.g. 16:9 widescreen, video clip on slide 14)..."
                  rows={2}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select File (PDF, PPT, PPTX, DOC, DOCX, ZIP • Max 20MB) *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  required
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Ready: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 inline-flex items-center space-x-1.5"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Deck</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
