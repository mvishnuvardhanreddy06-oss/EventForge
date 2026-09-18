import React, { useState } from 'react';
import { UploadCloud, FileText, Check, X } from 'lucide-react';

const ImportEventModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSimulateSelect = () => {
    setFileName('corporate_events_q4_batch.json');
    setFileSelected(true);
  };

  const handleExecuteImport = () => {
    onImportSuccess();
    setFileSelected(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Import Event Batch
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-600">
          <p className="leading-relaxed">
            Upload an EventForge conference manifest (JSON or CSV) to batch-import event agendas, venue details, and ticketing tiers.
          </p>

          <div
            onClick={handleSimulateSelect}
            className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors bg-slate-50/50"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            {fileSelected ? (
              <div>
                <p className="font-bold text-slate-900">{fileName}</p>
                <span className="text-[11px] text-emerald-600 font-semibold">Ready for processing</span>
              </div>
            ) : (
              <div>
                <p className="font-bold text-slate-800">Click to select file or drag here</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports .JSON, .CSV formats (max 10MB)</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!fileSelected}
            onClick={handleExecuteImport}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs transition-colors"
          >
            Import Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportEventModal;
