import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';
import { staffService } from '../../../services/staffService';
import { formatIndianPhone } from '../../../utils/phoneUtils';

const SAMPLE_CSV = `First Name,Last Name,Email,Phone,Role,Company,Designation
Sanjay,Verma,sanjay.v@eventcrew.in,9812345678,Check-in Staff,EventForge Operations,Registrar
Kiran,Bose,kiran.bose@eventcrew.in,9823456789,Session Coordinator,EventForge Operations,Hall Coordinator
Rohit,Patel,rohit.p@eventcrew.in,12345,Technical Staff,EventForge Operations,AV Tech
Priya,Sharma,rahul@example.com,9834567890,Event Coordinator,EventForge Operations,Coordinator`;

const ImportStaffModal = ({
  isOpen,
  existingStaff = [],
  onClose,
  onImportSuccess
}) => {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [previewRows, setPreviewRows] = useState([]);
  const [hasParsed, setHasParsed] = useState(false);

  if (!isOpen) return null;

  const handleParse = () => {
    const existingEmails = new Set(existingStaff.map((s) => s.email.toLowerCase()));
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return;

    const headers = lines[0].split(',').map((h) => h.trim());
    const parsed = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',').map((v) => v.trim());
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      const validation = staffService.validateImportRow(rowObj, existingEmails);
      if (validation.isValid) {
        existingEmails.add(validation.normalizedData.email);
      }
      parsed.push({
        rowNumber: i,
        raw: rowObj,
        ...validation
      });
    }

    setPreviewRows(parsed);
    setHasParsed(true);
  };

  const validCount = previewRows.filter((r) => r.isValid).length;
  const invalidCount = previewRows.length - validCount;

  const handleImport = () => {
    const validRecords = previewRows
      .filter((r) => r.isValid)
      .map((r) => ({
        ...r.normalizedData,
        status: 'Active',
        attendanceStatus: 'Scheduled',
        availability: 'Available',
        eventIds: ['evt-1'],
        eventTitle: 'Global Tech Leadership Summit 2026'
      }));

    onImportSuccess(validRecords);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Import Staff Records</h3>
              <p className="text-xs text-slate-500">Upload or paste CSV/XLSX records with validation.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {!hasParsed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Paste CSV Data or Template (Columns: First Name, Last Name, Email, Phone, Role)
                </label>
                <button
                  type="button"
                  onClick={() => setCsvText(SAMPLE_CSV)}
                  className="text-[11px] text-blue-600 font-semibold hover:underline"
                >
                  Load Sample Data
                </button>
              </div>

              <textarea
                rows={7}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full font-mono text-[11px] p-3 rounded-2xl border border-slate-200 bg-slate-50/60 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/80 text-[11px] text-blue-800 space-y-1">
                <p className="font-bold">✓ Requirements:</p>
                <p>• Phone numbers must be valid 10-digit Indian mobile numbers.</p>
                <p>• Duplicate emails already in the staff roster will be flagged as warnings.</p>
              </div>

              <button
                type="button"
                onClick={handleParse}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Validate & Preview Records
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Validation Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-black text-sm">{validCount} Valid Records</p>
                    <p className="text-[10px] text-emerald-700">Ready to import</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="font-black text-sm">{invalidCount} Invalid Records</p>
                    <p className="text-[10px] text-amber-700">Will be skipped</p>
                  </div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                    <tr className="text-[10px] font-bold text-slate-500 uppercase">
                      <th className="py-2 px-3">Row</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Validation Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRows.map((r) => (
                      <tr key={r.rowNumber} className={r.isValid ? 'bg-white' : 'bg-rose-50/30'}>
                        <td className="py-2 px-3 font-semibold text-slate-500">Row {r.rowNumber}</td>
                        <td className="py-2 px-3">
                          {r.isValid ? (
                            <span className="text-emerald-600 font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Valid</span>
                            </span>
                          ) : (
                            <span className="text-amber-600 font-bold flex items-center space-x-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Invalid</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {r.raw['First Name']} {r.raw['Last Name']}
                        </td>
                        <td className="py-2 px-3 text-slate-600 truncate max-w-[140px]">{r.raw['Email']}</td>
                        <td className="py-2 px-3">
                          {r.isValid ? (
                            <span className="text-emerald-700 text-[11px]">Ready for import</span>
                          ) : (
                            <span className="text-rose-600 text-[11px] font-semibold">
                              {r.errors.join('; ')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setHasParsed(false)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  ← Edit Raw CSV
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={validCount === 0}
                    onClick={handleImport}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Import Valid Records ({validCount})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportStaffModal;
