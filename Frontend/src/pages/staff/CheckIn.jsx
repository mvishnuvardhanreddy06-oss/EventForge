import React, { useState, useEffect } from 'react';
import { eventService, attendanceService } from '../../services/api';
import QRScanner from '../../components/QRScanner';
import Loader from '../../components/Loader';
import { CheckCircle2, AlertCircle, Calendar, Ticket, User, Clock, QrCode } from 'lucide-react';

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
        if (res.success && res.data.events && res.data.events.length > 0) {
          setEvents(res.data.events);
          setSelectedEventId(res.data.events[0]._id);
        } else {
          setEvents([]);
        }
      } catch (e) {
        console.error('Failed to load check-in events:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleScan = async (qrToken) => {
    if (!selectedEventId) {
      setError('Please select an active event before scanning tickets.');
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
      const msg = err.response?.data?.message || err.message || 'Ticket verification failed.';
      setError(msg);
    } finally {
      setScanning(false);
    }
  };

  if (loading) return <Loader text="Loading check-in station..." />;

  const selectedEvent = events.find(e => e._id === selectedEventId);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rapid QR Check-In Terminal</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Scan attendee QR badge with device camera or enter ticket token for instant entry verification.
        </p>
      </div>

      {/* Event Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
        <label className="block text-xs font-bold text-slate-700 flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
          Active Check-in Event
        </label>
        {events.length === 0 ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-1.5 text-amber-600 shrink-0" />
            <span>No events assigned to your account for check-in.</span>
          </div>
        ) : (
          <select
            value={selectedEventId}
            onChange={e => {
              setSelectedEventId(e.target.value);
              setResult(null);
              setError(null);
            }}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 hover:bg-white transition-colors"
          >
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>
                {ev.title} {ev.category ? `(${ev.category})` : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Structured Check-in Success Result */} 
      {result && (
        <div className="p-5 bg-emerald-50/95 border border-emerald-300 rounded-2xl text-emerald-950 shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-emerald-800 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>✓ Check-in Successful</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-emerald-200/80 text-xs">
            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block flex items-center mb-0.5">
                <User className="w-3 h-3 mr-1 text-emerald-600" /> Attendee
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {result.attendeeName || result.registration?.attendeeId?.name || 'Attendee'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block flex items-center mb-0.5">
                <Calendar className="w-3 h-3 mr-1 text-emerald-600" /> Event
              </span>
              <span className="font-semibold text-slate-800 line-clamp-1">
                {result.eventTitle || result.registration?.eventId?.title || selectedEvent?.title || 'Event'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block flex items-center mb-0.5">
                <Ticket className="w-3 h-3 mr-1 text-emerald-600" /> Ticket
              </span>
              <span className="font-semibold text-slate-800">
                {result.ticketTier || result.registration?.ticketId?.name || 'General Pass'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block flex items-center mb-0.5">
                <Clock className="w-3 h-3 mr-1 text-emerald-600" /> Time
              </span>
              <span className="font-mono text-slate-800 font-bold">
                {new Date(result.checkInTime || result.checkedInAt || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Structured Failure Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-start space-x-3 text-rose-900 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-black text-rose-950 uppercase tracking-wide">
              Check-in Verification Failed
            </p>
            <p className="text-xs font-semibold text-rose-800">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Scanner & Manual Fallback Component */}
      <QRScanner onScan={handleScan} scanning={scanning} />
    </div>
  );
};

export default CheckIn;
