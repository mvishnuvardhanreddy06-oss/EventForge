import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Check, Download } from 'lucide-react';

const ImportScheduleModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleImport = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onImportSuccess(file.name);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-600">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Import Event Schedule
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Upload CSV or JSON session agenda manifests
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.json"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {file ? file.name : 'Click to upload or drag schedule manifest'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supported formats: CSV, JSON (UTF-8)
                </p>
              </div>
            </div>
          </div>

          {/* Sample template download */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px]">
            <span className="text-slate-600">Need the official schedule format?</span>
            <button
              type="button"
              onClick={() => alert('Downloaded session_template.csv')}
              className="font-bold text-blue-600 hover:underline flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Download Template</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!file || isProcessing}
            onClick={handleImport}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Importing...' : 'Confirm Import'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportScheduleModal;
