import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';

const ExportMenu = ({ onExport }) => {
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
    setIsOpen(false);
    if (onExport) {
      onExport(format);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Export</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden animate-fade-in">
          <button
            type="button"
            onClick={() => handleSelect('csv')}
            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-bold">Export to CSV</p>
              <p className="text-[10px] text-slate-400">Comma-separated values</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleSelect('excel')}
            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2 transition-colors border-t border-slate-100"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <div>
              <p className="font-bold">Export to Excel</p>
              <p className="text-[10px] text-slate-400">Formatted spreadsheet</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
