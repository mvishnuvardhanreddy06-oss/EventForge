import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Table, ChevronDown } from 'lucide-react';

const ExportScheduleMenu = ({ onExportPDF, onExportCSV }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs transition-all"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Export Schedule</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-1.5 w-48 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 border border-slate-100 focus:outline-none text-xs animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportPDF();
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold text-left transition-colors"
          >
            <FileText className="w-4 h-4 text-rose-500" />
            <div>
              <p className="font-bold">Export as PDF</p>
              <p className="text-[10px] text-slate-400 font-normal">Printable attendee agenda</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportCSV();
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold text-left transition-colors"
          >
            <Table className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="font-bold">Export as CSV</p>
              <p className="text-[10px] text-slate-400 font-normal">Spreadsheet timetable manifest</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportScheduleMenu;
