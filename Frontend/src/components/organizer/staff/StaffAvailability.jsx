import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const StaffAvailability = ({
  isOpen,
  staff,
  onClose,
  onSave
}) => {
  const [status, setStatus] = useState(staff?.availability || 'Available');
  const [date, setDate] = useState('Sep 24, 2026');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('06:00 PM');
  const [notes, setNotes] = useState('');

  if (!isOpen || !staff) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      staffId: staff._id,
      availability: status,
      date,
      startTime,
      endTime,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Staff Availability</h3>
            <p className="text-xs text-slate-500">
              Configure operational availability for {staff.firstName} {staff.lastName}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Availability Status</label>
            <div className="grid grid-cols-3 gap-2">
              {['Available', 'Partially Available', 'Unavailable'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                    status === opt
                      ? opt === 'Available'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500'
                        : opt === 'Partially Available'
                        ? 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-500'
                        : 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">From</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">To</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {status === 'Unavailable' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
              <p className="font-bold">⚠ Notice</p>
              <p className="mt-0.5 text-amber-700">
                Staff member will be blocked from new shift assignments during this timeframe.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Travel delay, offsite conference prep"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              Save Availability
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAvailability;
