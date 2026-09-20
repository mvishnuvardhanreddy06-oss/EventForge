import React from 'react';
import { XCircle, Download, Calendar, X, CheckSquare } from 'lucide-react';

const BulkActionsBar = ({
  selectedCount = 0,
  onCancelSelected,
  onExportSelected,
  onMoveDateSelected,
  onClearSelection
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center space-x-3 px-4.5 py-2.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md text-xs">
        <div className="flex items-center space-x-2 font-bold pr-2 border-r border-slate-700">
          <CheckSquare className="w-4 h-4 text-blue-400" />
          <span>{selectedCount} selected</span>
        </div>

        <button
          type="button"
          onClick={onCancelSelected}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold bg-rose-600/90 hover:bg-rose-600 text-white transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancel Selected</span>
        </button>

        <button
          type="button"
          onClick={onExportSelected}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-300" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={onMoveDateSelected}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-300" />
          <span>Move Date</span>
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1"
          title="Deselect all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
