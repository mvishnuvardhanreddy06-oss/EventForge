import React, { useState } from 'react';
import { QrCode, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const QRScanner = ({ onScan, scanning = false }) => {
  const [manualToken, setManualToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (manualToken.trim()) {
      onScan(manualToken.trim());
      setManualToken('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Scan Attendee Badge</h3>
        <p className="text-xs text-slate-500 mt-1">
          Scan digital QR code or enter ticket token manually.
        </p>
      </div>

      {/* Optical Scanner Viewfinder Simulation */}
      <div className="relative w-full h-56 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center mb-6 shadow-inner">
        <div className="w-40 h-40 border-2 border-blue-500/80 rounded-xl relative flex items-center justify-center">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
        </div>
        <span className="absolute bottom-3 text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
          Optical QR Sensor Active
        </span>
      </div>

      {/* Manual Input Fallback */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Manual QR Token or Reg #</label>
          <div className="flex space-x-2">
            <input
              type="text"
              required
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="e.g. EFQR-8a7f9b..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={scanning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors"
            >
              {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QRScanner;
