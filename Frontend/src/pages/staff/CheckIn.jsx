import React, { useState, useEffect } from 'react';
import { eventService, attendanceService } from '../../services/api';
import QRScanner from '../../components/QRScanner';
import Loader from '../../components/Loader';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const CheckIn = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getAll();
        if (res.success && res.data.events.length > 0) {
          setEvents(res.data.events);
          setSelectedEventId(res.data.events[0]._id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleScan = async (qrToken) => {
    if (!selectedEventId) {
      alert('Please select an active event first.');
      return;
    }

    setScanning(true);
    setResult(null);
    setError(null);
    try {
      const res = await attendanceService.scanQR({
        qrToken,
        eventId: selectedEventId
      });
      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  if (loading) return <Loader text="Loading check-in station..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rapid QR Check-In Terminal</h1>
        <p className="text-xs text-slate-500 mt-0.5">Scan attendee QR code for instant entry verification.</p>
      </div>

      {/* Event Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <label className="block text-xs font-bold text-slate-700 mb-1">Active Check-in Event</label>
        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
        >
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title} ({ev.category})</option>
          ))}
        </select>
      </div>

      {/* Result feedback */} 
      {result && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-black">Check-in Verified Successfully!</p>
            <p className="text-xs">Attendee: <strong>{result.registration?.attendeeId?.name}</strong> (Reg: {result.registration?.registrationNumber})</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-800">
          <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <p className="text-xs font-black">Check-in Verification Failed</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      <QRScanner onScan={handleScan} scanning={scanning} />
    </div>
  );
};

export default CheckIn;
