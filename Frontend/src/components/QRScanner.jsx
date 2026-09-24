import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Camera, CameraOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const QRScanner = ({ onScan, scanning = false }) => {
  const [manualToken, setManualToken] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [lastScanned, setLastScanned] = useState(null);
  
  const scannerRef = useRef(null);
  const isCooldownRef = useRef(false);

  // Stop camera helper
  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping QR scanner:', err);
      } finally {
        scannerRef.current = null;
        setCameraActive(false);
      }
    }
  };

  // Start camera helper
  const startCamera = async () => {
    setCameraError(null);
    try {
      // First ensure previous scanner instance is cleared
      await stopCamera();

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      const qrCodeSuccessCallback = (decodedText) => {
        if (isCooldownRef.current) return;
        isCooldownRef.current = true;

        // Parse token if full URL was decoded
        let cleanToken = decodedText.trim();
        try {
          if (cleanToken.startsWith('http')) {
            const parsedUrl = new URL(cleanToken);
            cleanToken = parsedUrl.searchParams.get('token') || 
                         parsedUrl.searchParams.get('qrToken') || 
                         parsedUrl.searchParams.get('reg') || 
                         cleanToken;
          }
        } catch (e) {
          // Keep raw string
        }

        setLastScanned(cleanToken);
        onScan(cleanToken);

        // 2-second cooldown to prevent double scans
        setTimeout(() => {
          isCooldownRef.current = false;
        }, 2000);
      };

      const config = {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        () => {
          // Periodic scan failure (no QR in frame) - intentionally silent
        }
      );

      setCameraActive(true);
      setCameraError(null);
    } catch (err) {
      console.error('Camera activation failed:', err);
      setCameraActive(false);

      const errString = String(err).toLowerCase();
      if (
        err?.name === 'NotAllowedError' || 
        errString.includes('permission') || 
        errString.includes('notallowederror') ||
        errString.includes('denied')
      ) {
        setCameraError('Camera access is required for QR scanning. Please allow camera permission in your browser.');
      } else if (
        err?.name === 'NotFoundError' || 
        errString.includes('notfound') || 
        errString.includes('devicesnotfound')
      ) {
        setCameraError('No camera found on this device. Please use manual verification below.');
      } else {
        setCameraError(typeof err === 'string' ? err : (err?.message || 'Unable to start camera scanner.'));
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualToken.trim()) {
      onScan(manualToken.trim());
      setManualToken('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Live Attendee Badge Scanner</h3>
        <p className="text-xs text-slate-500 mt-1">
          Scan QR codes with device camera or enter ticket token manually.
        </p>
      </div>

      {/* Camera Viewport & Controls */}
      <div className="space-y-3">
        <div className="relative w-full min-h-[260px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-inner">
          {/* HTML5 QR Code Mount Element */}
          <div 
            id="qr-reader" 
            className={`w-full ${cameraActive ? 'block' : 'hidden'}`}
            style={{ width: '100%', minHeight: '260px' }}
          />

          {/* Standby State when camera is off */}
          {!cameraActive && !cameraError && (
            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Camera is currently inactive</p>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all inline-flex items-center space-x-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Open Device Camera</span>
              </button>
            </div>
          )}

          {/* Camera Permission / Device Error View */}
          {cameraError && (
            <div className="p-6 text-center space-y-3 max-w-xs">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-xs text-rose-200 font-semibold leading-relaxed">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Try Again
              </button>
            </div>
          )}

          {/* Active Overlay Indicator */}
          {cameraActive && (
            <span className="absolute bottom-2 text-[10px] bg-slate-950/80 px-2.5 py-0.5 rounded-full text-emerald-400 font-bold tracking-wide uppercase flex items-center z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5" />
              Camera Scanning Active
            </span>
          )}
        </div>

        {/* Camera Toggle Button */}
        {cameraActive && (
          <button
            type="button"
            onClick={stopCamera}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
          >
            <CameraOff className="w-3.5 h-3.5" />
            <span>Close Camera</span>
          </button>
        )}
      </div>

      {/* Manual Input Fallback */}
      <form onSubmit={handleManualSubmit} className="space-y-3 pt-3 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Manual QR Token or Reg #
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              required
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="e.g. EFQR-8a7f9b... or EF-2026-1000"
              className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={scanning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors flex items-center space-x-1"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying</span>
                </>
              ) : (
                <span>Verify</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QRScanner;
