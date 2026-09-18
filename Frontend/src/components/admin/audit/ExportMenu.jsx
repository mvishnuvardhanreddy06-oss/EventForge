import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';

const ExportMenu = ({ onExportCSV, onExportPDF }) => {
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

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export Logs</span>
        <ChevronDown className="w-3 h-3 text-blue-200" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200/90 py-1.5 z-40 text-xs animate-in fade-in duration-100">
          <button
            onClick={() => {
              onExportCSV();
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer text-left font-medium"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              onExportPDF();
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer text-left font-medium"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Export PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
