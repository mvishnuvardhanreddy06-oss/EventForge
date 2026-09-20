import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, ArrowRight } from 'lucide-react';
import { validateIndianPhone, normalizeIndianPhone, formatIndianPhone } from '../../../utils/phoneUtils';

const SAMPLE_CSV_TEMPLATE = `First Name,Last Name,Email,Phone,Ticket Type,Company,Designation
Arjun,Mehta,arjun.mehta@techcorp.in,9876543210,VIP,TechCorp India,Director of Engineering
Pooja,Rao,pooja.rao@innovate.org,9812345678,Standard,Innovate Labs,Lead Cloud Architect
Vikram,Deshmukh,vikram@cloudscale.io,9898765432,Corporate,CloudScale,VP Infrastructure
Kavita,Sen,kavita.sen@startup.co,9845012345,Early Bird,FinCore Labs,Senior Data Scientist`;

const MOCK_PREVIEW_RECORDS = [
  {
    id: 1,
    firstName: 'Arjun',
    lastName: 'Mehta',
    email: 'arjun.mehta@techcorp.in',
    phone: '+919876543210',
    ticketType: 'VIP',
    company: 'TechCorp India',
    status: 'valid',
    note: 'Valid format'
  },
  {
    id: 2,
    firstName: 'Pooja',
    lastName: 'Rao',
    email: 'pooja.rao@innovate.org',
    phone: '+919812345678',
    ticketType: 'Standard',
    company: 'Innovate Labs',
    status: 'valid',
    note: 'Valid format'
  },
  {
    id: 3,
    firstName: 'Vikram',
    lastName: 'Deshmukh',
    email: 'vikram.d@cloudscale.io',
    phone: '+14155552671', // Invalid foreign country code!
    ticketType: 'Corporate',
    company: 'CloudScale',
    status: 'invalid',
    note: 'Invalid phone number (must be 10-digit Indian number +91)'
  },
  {
    id: 4,
    firstName: 'Kavita',
    lastName: 'Sen',
    email: 'sarah@example.com', // Duplicate email!
    phone: '+919845012345',
    ticketType: 'Early Bird',
    company: 'FinCore Labs',
    status: 'warning',
    note: 'Duplicate email: Already registered in this event'
  }
];

const ImportAttendeesModal = ({
  isOpen,
  onClose,
  onImportValid,
  existingEmails = []
}) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [records, setRecords] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'eventforge_attendees_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    // Simulate parsing and validation
    setTimeout(() => {
      setRecords(MOCK_PREVIEW_RECORDS);
      setFileUploaded(true);
      setIsProcessing(false);
    }, 400);
  };

  const validRecords = records.filter((r) => r.status === 'valid');

  const handleConfirmImport = () => {
    const importedAttendees = validRecords.map((r) => ({
      _id: `att-import-${Date.now()}-${r.id}`,
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      phone: normalizeIndianPhone(r.phone),
      company: r.company || 'Enterprise Partner',
      designation: 'Attendee',
      city: 'Bengaluru',
      country: 'India',
      ticketType: r.ticketType,
      ticketId: `EVF-${r.ticketType.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      registrationId: `REG-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      registrationStatus: 'confirmed',
      paymentStatus: 'paid',
      amountPaid: r.ticketType === 'VIP' ? 4999 : 2999,
      eventTitle: 'Global Tech Leadership Summit 2026',
      registeredAt: new Date().toISOString(),
      registeredAtFormatted: 'Today',
      checkedIn: false,
      checkInTime: null,
      checkInDate: null,
      checkedInBy: null
    }));

    onImportValid(importedAttendees);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-2xl w-full overflow-hidden flex flex-col my-6 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Import Attendees
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Upload CSV or Excel spreadsheets to batch register attendees
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Instructions & Template Download */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">Required File Columns:</span>
              <p className="text-[11px] text-slate-500 font-medium">
                First Name, Last Name, Email, Phone (10-digit Indian mobile), Ticket Type
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          {!fileUploaded ? (
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20 group">
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 transition-colors mb-3 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-900">
                Click to browse or drag and drop spreadsheet
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports CSV or XLSX up to 10MB
              </p>
            </label>
          ) : (
            /* Uploaded Preview Table */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{fileName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                    {validRecords.length} of {records.length} Records Valid
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFileUploaded(false)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Upload different file
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Row</th>
                      <th className="py-2.5 px-3">Attendee</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Validation Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((r) => (
                      <tr key={r.id} className={r.status === 'invalid' ? 'bg-rose-50/40' : r.status === 'warning' ? 'bg-amber-50/40' : ''}>
                        <td className="py-2.5 px-3 font-mono text-slate-400">#{r.id}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900">{r.firstName} {r.lastName}</span>
                          <span className="text-[10px] text-slate-400 block">{r.email}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          {formatIndianPhone(r.phone) || r.phone}
                        </td>
                        <td className="py-2.5 px-3">
                          {r.status === 'valid' && (
                            <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Valid</span>
                            </span>
                          )}
                          {r.status === 'invalid' && (
                            <span className="inline-flex items-center space-x-1 text-rose-700 font-bold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Invalid</span>
                            </span>
                          )}
                          {r.status === 'warning' && (
                            <span className="inline-flex items-center space-x-1 text-amber-700 font-bold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Warning</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          {r.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          {fileUploaded && (
            <button
              type="button"
              disabled={validRecords.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>Import {validRecords.length} Valid Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportAttendeesModal;
