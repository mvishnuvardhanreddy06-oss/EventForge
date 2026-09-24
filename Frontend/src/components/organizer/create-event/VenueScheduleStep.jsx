import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Globe, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { venueService } from '../../../services/api';

const TIMEZONES = [
  'IST — India Standard Time (UTC+5:30)',
  'UTC — Coordinated Universal Time',
  'EST — Eastern Standard Time (UTC-5:00)',
  'PST — Pacific Standard Time (UTC-8:00)',
  'GMT — Greenwich Mean Time (UTC+0:00)',
  'SGT — Singapore Time (UTC+8:00)'
];

const VenueScheduleStep = ({ formData, onChange, errors = {} }) => {
  const [dbVenues, setDbVenues] = useState([]);
  const [conflictWarning, setConflictWarning] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await venueService.getAll();
        const list = res?.data?.venues || res?.venues || (Array.isArray(res?.data) ? res.data : []);
        setDbVenues(list);
      } catch (err) {
        console.error('Error loading venues:', err);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    let active = true;
    const checkConflict = async () => {
      if (!formData.venueId || !formData.startDate || !formData.endDate) {
        setConflictWarning(null);
        setIsAvailable(null);
        return;
      }
      setCheckingAvailability(true);
      try {
        const res = await venueService.checkAvailability(formData.venueId, {
          startDate: formData.startDate,
          endDate: formData.endDate
        });
        if (!active) return;
        if (res.available === false || res.data?.available === false) {
          const msg = res.message || res.data?.message || 'Venue is already booked for another event during these dates.';
          setConflictWarning(msg);
          setIsAvailable(false);
        } else {
          setConflictWarning(null);
          setIsAvailable(true);
        }
      } catch (err) {
        if (!active) return;
        if (err.response?.status === 409) {
          setConflictWarning(err.response?.data?.message || 'Venue conflict detected.');
          setIsAvailable(false);
        }
      } finally {
        if (active) setCheckingAvailability(false);
      }
    };

    const timer = setTimeout(() => {
      checkConflict();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.venueId, formData.startDate, formData.endDate]);

  const venueType = formData.venueType || 'Physical';
  const capacity = Number(formData.capacity) || 1500;
  const expectedAttendees = Number(formData.expectedAttendees) || 1200;
  const capacityUtilization = Math.round((expectedAttendees / capacity) * 100) || 80;
  const isOverCapacity = expectedAttendees > capacity;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Venue & Schedule form */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Venue & Schedule
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify the timeline, timezone, and physical or virtual location of your event.
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Event Dates & Times */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                Date & Schedule
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || '2026-09-24'}
                    onChange={(e) => onChange('startDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || '2026-09-24'}
                    onChange={(e) => onChange('endDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold cursor-pointer"
                  />
                  {errors.endDate && (
                    <p className="text-rose-600 text-[11px] font-semibold mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Start Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime || '09:00'}
                    onChange={(e) => onChange('startTime', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    End Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.endTime || '18:00'}
                    onChange={(e) => onChange('endTime', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Timezone
                </label>
                <select
                  value={formData.timezone || TIMEZONES[0]}
                  onChange={(e) => onChange('timezone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold bg-white cursor-pointer"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Venue Type Selector */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                Venue Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Physical', 'Online', 'Hybrid'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange('venueType', type)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      venueType === type
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Physical Venue Details */}
            {(venueType === 'Physical' || venueType === 'Hybrid') && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs">Physical Venue Details</h4>
                  {dbVenues.length > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400">
                      {dbVenues.length} registered venues found
                    </span>
                  )}
                </div>

                {/* Registered Venue Selector */}
                {dbVenues.length > 0 && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                    <label className="block font-bold text-slate-700 text-xs">
                      Select Registered Organization Venue
                    </label>
                    <select
                      value={formData.venueId || ''}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        onChange('venueId', selectedId);
                        const v = dbVenues.find((x) => (x._id || x.id) === selectedId);
                        if (v) {
                          onChange('venueName', v.name);
                          onChange('address', v.address || '');
                          onChange('city', v.city || '');
                          onChange('state', v.state || '');
                          onChange('country', v.country || 'India');
                          onChange('postalCode', v.postalCode || '');
                          if (v.capacity) onChange('capacity', v.capacity);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold bg-white cursor-pointer"
                    >
                      <option value="">-- Choose from existing venues (or fill custom below) --</option>
                      {dbVenues.map((v) => (
                        <option key={v._id || v.id} value={v._id || v.id}>
                          {v.name} ({v.city}) — Cap: {v.capacity?.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Real-time Conflict Alert Banner */}
                {checkingAvailability && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-2 text-blue-700 text-xs font-medium animate-pulse">
                    <span>Checking venue schedule availability in real-time...</span>
                  </div>
                )}

                {!checkingAvailability && conflictWarning && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-start space-x-3 text-amber-900 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="font-bold text-xs text-amber-900 tracking-tight flex items-center space-x-2">
                        <span>VENUE SCHEDULE COLLISION DETECTED</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] bg-rose-100 text-rose-800 font-bold uppercase">409 Conflict</span>
                      </h5>
                      <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        {conflictWarning}
                      </p>
                      <p className="text-[11px] text-amber-700">
                        Multiple events cannot occupy the same venue at the same time. Please pick another facility or change the event dates before publishing.
                      </p>
                    </div>
                  </div>
                )}

                {!checkingAvailability && isAvailable && formData.venueId && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Venue is verified available. No overlapping events scheduled during this window.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Venue Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.venueName || ''}
                      onChange={(e) => onChange('venueName', e.target.value)}
                      placeholder="e.g. Hyderabad International Convention Centre"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                    {errors.venueName && (
                      <p className="text-rose-600 text-[11px] font-semibold mt-1">
                        {errors.venueName}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => onChange('address', e.target.value)}
                      placeholder="e.g. Novotel & HICC Complex, Kondapur"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => onChange('city', e.target.value)}
                      placeholder="e.g. Hyderabad"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={formData.state || ''}
                      onChange={(e) => onChange('state', e.target.value)}
                      placeholder="e.g. Telangana"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country || 'India'}
                      onChange={(e) => onChange('country', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={formData.postalCode || ''}
                      onChange={(e) => onChange('postalCode', e.target.value)}
                      placeholder="e.g. 500081"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Venue Capacity (Maximum Attendees) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={formData.capacity || 1500}
                      onChange={(e) => onChange('capacity', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Online Details */}
            {(venueType === 'Online' || venueType === 'Hybrid') && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs">Online Stream / Livestream URL</h4>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting / Broadcast Link</label>
                  <input
                    type="url"
                    value={formData.streamingUrl || ''}
                    onChange={(e) => onChange('streamingUrl', e.target.value)}
                    placeholder="https://eventforge.live/stream/apex-summit-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Capacity Utilization Card (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Capacity Analytics
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Venue Capacity
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Maximum:</span>
                <span className="font-bold text-slate-900">{capacity.toLocaleString()} attendees</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Expected:</span>
                <span className="font-bold text-slate-900">{expectedAttendees.toLocaleString()} attendees</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Capacity utilization:</span>
                <span className={`font-bold font-mono ${isOverCapacity ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {capacityUtilization}%
                </span>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="space-y-1 pt-1">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverCapacity ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, capacityUtilization)}%` }}
                />
              </div>
            </div>

            {isOverCapacity && (
              <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-xs text-rose-800 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">
                  ⚠ Expected attendance exceeds venue capacity. Consider selecting an auditorium with greater floorplan volume.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueScheduleStep;
