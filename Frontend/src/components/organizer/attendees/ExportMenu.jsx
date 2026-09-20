import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Sheet, ChevronDown } from 'lucide-react';

const ExportMenu = ({ onExport, selectedCount = 0, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all disabled:opacity-50"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>{selectedCount > 0 ? `Export Selected (${selectedCount})` : 'Export'}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {selectedCount > 0 ? `Exporting ${selectedCount} Rows` : 'Export All Filtered Data'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSelect('csv')}
            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center space-x-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="block font-bold">CSV (.csv)</span>
              <span className="text-[10px] text-slate-400 font-normal">Standard comma-separated format</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('excel')}
            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center space-x-2 transition-colors"
          >
            <Sheet className="w-4 h-4 text-emerald-700" />
            <div>
              <span className="block font-bold">Excel Spreadsheet (.xlsx)</span>
              <span className="text-[10px] text-slate-400 font-normal">Formatted workbook report</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
