import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { STAFF_ROLES, MOCK_VENUES } from '../../../services/staffService';

const ShiftForm = ({
  isOpen,
  initialShift = null,
  staffList = [],
  venues = MOCK_VENUES,
  onClose,
  onSubmit
}) => {
  const isEditing = Boolean(initialShift?._id);

  const [formData, setFormData] = useState({
    staffId: '',
    date: 'Sep 24, 2026',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    venue: 'Hyderabad International Convention Centre',
    room: 'Hall A',
    role: 'Session Coordinator',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialShift) {
      setFormData({
        staffId: initialShift.staffId || '',
        date: initialShift.date || 'Sep 24, 2026',
        startTime: initialShift.startTime || '08:00 AM',
        endTime: initialShift.endTime || '06:00 PM',
        venue: initialShift.venue || 'Hyderabad International Convention Centre',
        room: initialShift.room || 'Hall A',
        role: initialShift.role || 'Session Coordinator',
        notes: initialShift.notes || ''
      });
      setErrors({});
    } else {
      setFormData({
        staffId: staffList[0]?._id || '',
        date: 'Sep 24, 2026',
        startTime: '08:00 AM',
        endTime: '06:00 PM',
        venue: venues[0]?.name || 'Hyderabad International Convention Centre',
        room: 'Hall A',
        role: staffList[0]?.role || 'Session Coordinator',
        notes: ''
      });
      setErrors({});
    }
  }, [initialShift, isOpen, staffList, venues]);

  if (!isOpen) return null;

  const currentVenue = venues.find((v) => v.name === formData.venue) || venues[0];
  const availableRooms = currentVenue?.rooms || ['Hall A', 'Hall B', 'Main Auditorium'];

  const validate = () => {
    const errs = {};
    if (!formData.staffId) errs.staffId = 'Staff Member is required.';
    if (!formData.date.trim()) errs.date = 'Date is required.';
    if (!formData.startTime.trim()) errs.startTime = 'Start Time is required.';
    if (!formData.endTime.trim()) errs.endTime = 'End Time is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const staffMember = staffList.find((s) => s._id === formData.staffId);

    const payload = {
      ...(initialShift || {}),
      staffId: formData.staffId,
      staffName: staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Staff Member',
      role: formData.role || staffMember?.role || 'Session Coordinator',
      venue: formData.venue,
      room: formData.room,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      notes: formData.notes,
      status: initialShift?.status || 'Scheduled'
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {isEditing ? 'Edit Shift Schedule' : 'Create New Shift'}
              </h2>
              <p className="text-xs text-slate-500">Define operational hours, role, and room station.</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Staff Member <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.staffId}
              onChange={(e) => {
                const sId = e.target.value;
                const st = staffList.find((s) => s._id === sId);
                setFormData((prev) => ({
                  ...prev,
                  staffId: sId,
                  role: st?.role || prev.role
                }));
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              {staffList.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.firstName} {st.lastName} ({st.role})
                </option>
              ))}
            </select>
            {errors.staffId && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.staffId}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="Sep 24, 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              {errors.date && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="08:00 AM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              {errors.startTime && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.startTime}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                End Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="06:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              {errors.endTime && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.endTime}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
              <select
                value={formData.venue}
                onChange={(e) => {
                  const venName = e.target.value;
                  const v = venues.find((vn) => vn.name === venName);
                  setFormData((prev) => ({
                    ...prev,
                    venue: venName,
                    room: v?.rooms?.[0] || 'Hall A'
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {venues.map((v) => (
                  <option key={v._id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Room / Station</label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {availableRooms.map((rm) => (
                  <option key={rm} value={rm}>
                    {rm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Shift Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Shift Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Key deliverables, radio callsigns, or handover protocol..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              {isEditing ? 'Save Changes' : 'Create Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShiftForm;
