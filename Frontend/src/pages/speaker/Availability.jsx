import React, { useState, useEffect } from 'react';
import { speakerPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  CalendarCheck,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldAlert,
  Info,
  Building2
} from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultWeekly = [
  { day: 'Monday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
  { day: 'Tuesday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
  { day: 'Wednesday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
  { day: 'Thursday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
  { day: 'Friday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
  { day: 'Saturday', available: false, startTime: '10:00 AM', endTime: '02:00 PM' },
  { day: 'Sunday', available: false, startTime: '10:00 AM', endTime: '02:00 PM' }
];

const Availability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weekly, setWeekly] = useState(defaultWeekly);
  const [eventAvailability, setEventAvailability] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await speakerPortalService.getAvailability();
      if (res.success && res.data) {
        if (res.data.weeklyAvailability && res.data.weeklyAvailability.length > 0) {
          setWeekly(res.data.weeklyAvailability);
        }
        setEventAvailability(res.data.eventAvailability || []);
        setConflicts(res.data.conflicts || []);
      }
    } catch (err) {
      console.error('Failed to load availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDayAvailable = (dayName) => {
    setWeekly(prev =>
      prev.map(d => (d.day === dayName ? { ...d, available: !d.available } : d))
    );
  };

  const updateDayTime = (dayName, field, value) => {
    setWeekly(prev =>
      prev.map(d => (d.day === dayName ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await speakerPortalService.updateAvailability({
        weeklyAvailability: weekly
      });
      if (res.success) {
        setToastMessage('Weekly availability schedule saved! Confirmed sessions remain locked pending organizer review.');
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to save availability schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setWeekly(defaultWeekly);
  };

  if (loading) return <Loader text="Loading availability calendar..." />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Availability
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage your availability for EventForge events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Availability'}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SCHEDULE CONFLICT DETECTION BANNER */}
      {conflicts.length > 0 ? (
        <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center space-x-2 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
              Schedule Conflict Detected
            </h3>
          </div>
          <p className="text-xs text-rose-700">
            You have overlapping session time commitments across your assigned events. Please coordinate with the organizer concierge to resolve this conflict.
          </p>
          <div className="space-y-2">
            {conflicts.map((c, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900">{c.sessionA.title}</span> ({c.sessionA.time})
                  <span className="text-rose-600 font-bold mx-2">conflicts with</span>
                  <span className="font-bold text-slate-900">{c.sessionB.title}</span> ({c.sessionB.time})
                </div>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md shrink-0">
                  {c.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Zero Schedule Conflicts: All your speaking sessions have distinct, conflict-free time slots.</span>
        </div>
      )}

      {/* WEEKLY AVAILABILITY MATRIX */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Weekly Availability Hours</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">General working hours for conferences</span>
        </div>

        <div className="space-y-3">
          {weekly.map((dayItem) => (
            <div
              key={dayItem.day}
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                dayItem.available
                  ? 'bg-white border-slate-200/80 hover:bg-slate-50/50'
                  : 'bg-slate-50/80 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3 w-40">
                <span className={`w-2.5 h-2.5 rounded-full ${dayItem.available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-900">{dayItem.day}</span>
              </div>

              {dayItem.available ? (
                <div className="flex items-center space-x-2 text-xs">
                  <input
                    type="text"
                    value={dayItem.startTime}
                    onChange={(e) => updateDayTime(dayItem.day, 'startTime', e.target.value)}
                    className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-lg text-center font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="09:00 AM"
                  />
                  <span className="text-slate-400 font-semibold">–</span>
                  <input
                    type="text"
                    value={dayItem.endTime}
                    onChange={(e) => updateDayTime(dayItem.day, 'endTime', e.target.value)}
                    className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-lg text-center font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="06:00 PM"
                  />
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-400 italic">Unavailable throughout the day</span>
              )}

              <button
                type="button"
                onClick={() => toggleDayAvailable(dayItem.day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  dayItem.available
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {dayItem.available ? 'Available' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* EVENT AVAILABILITY & NOTICE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Assigned Event Commitments</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Conference dates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventAvailability.map((ev, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                  {ev.availability}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{ev.status}</span>
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">{ev.title}</p>
              <p className="text-[11px] text-slate-500">{ev.date} • {ev.venue}</p>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/60 text-xs text-purple-900 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Policy:</strong> Modifying your weekly availability indicates your scheduling preference to event producers. It does <em>not</em> automatically cancel or modify already confirmed and published speaking sessions. Any changes to confirmed sessions require explicit organizer coordination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Availability;
