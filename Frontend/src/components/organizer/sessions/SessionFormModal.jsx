import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, MapPin, User, Tag, Plus, Check, AlertCircle } from 'lucide-react';
import SpeakerSelector from './SpeakerSelector';
import RoomSelector from './RoomSelector';

const SESSION_TYPES = [
  'Keynote',
  'Workshop',
  'Panel',
  'Talk',
  'Networking',
  'Break'
];

const PRESET_TAGS = ['AI', 'Cloud', 'Technology', 'Business', 'Leadership', 'Security', 'FinTech'];

const INITIAL_SESSION = {
  title: '',
  type: 'Talk',
  description: '',
  date: 'Sep 24, 2026',
  startTime: '10:00 AM',
  endTime: '11:00 AM',
  room: 'Hall A',
  speakerId: 'Sarah Wilson',
  capacity: 500,
  expectedAttendance: 420,
  status: 'scheduled',
  tags: ['AI', 'Cloud']
};

const SessionFormModal = ({
  isOpen,
  onClose,
  onSave,
  editSession = null,
  speakers = [],
  rooms = []
}) => {
  const [formData, setFormData] = useState(INITIAL_SESSION);
  const [errors, setErrors] = useState({});
  const [customTagInput, setCustomTagInput] = useState('');

  // Conflict simulation triggers
  const [speakerConflict, setSpeakerConflict] = useState(null);
  const [roomConflict, setRoomConflict] = useState(null);

  useEffect(() => {
    if (editSession) {
      setFormData({
        title: editSession.title || '',
        type: editSession.type || 'Talk',
        description: editSession.description || '',
        date: editSession.date || 'Sep 24, 2026',
        startTime: editSession.startTime || '10:00 AM',
        endTime: editSession.endTime || '11:00 AM',
        room: editSession.room || editSession.roomName || 'Hall A',
        speakerId: editSession.speaker?.id || editSession.speaker?.name || editSession.speakerName || 'Sarah Wilson',
        capacity: editSession.capacity || 500,
        expectedAttendance: editSession.expectedAttendance || 420,
        status: editSession.status || 'scheduled',
        tags: editSession.tags || ['AI', 'Cloud']
      });
    } else {
      setFormData(INITIAL_SESSION);
    }
    setErrors({});
    setSpeakerConflict(null);
    setRoomConflict(null);
  }, [editSession, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Session title is required';
    if (!formData.startTime.trim()) errs.startTime = 'Start time is required';
    if (!formData.endTime.trim()) errs.endTime = 'End time is required';
    if (!formData.room.trim() && formData.type !== 'Break') errs.room = 'Room assignment is required';
    if (!formData.speakerId && formData.type !== 'Break' && formData.type !== 'Networking') {
      errs.speaker = 'Speaker selection is required';
    }
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be greater than 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(editSession || {}),
      ...formData,
      capacity: Number(formData.capacity),
      expectedAttendance: Number(formData.expectedAttendance) || 0,
      id: editSession ? editSession.id || editSession._id : `session-${Date.now()}`
    });
  };

  const toggleTag = (tag) => {
    const current = formData.tags || [];
    if (current.includes(tag)) {
      setFormData({ ...formData, tags: current.filter((t) => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...current, tag] });
    }
  };

  const handleAddCustomTag = (e) => {
    e?.preventDefault();
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] });
    }
    setCustomTagInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-100/80 text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editSession ? 'Edit Session' : 'Create Session'}
              </h2>
              <p className="text-xs text-slate-500">
                Set session schedule, speaker assignments, and hall configurations.
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

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
          {/* Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Session Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI Infrastructure at Scale"
                className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 ${
                  errors.title ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Session Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer font-semibold"
              >
                {SESSION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description with Character Counter 0 / 500 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Session Description
              </label>
              <span className={`text-[10px] font-semibold ${formData.description.length > 500 ? 'text-rose-600' : 'text-slate-400'}`}>
                {formData.description.length} / 500
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what attendees will learn from this session..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Date, Start Time & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="Sep 24, 2026"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Time *
              </label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="10:00 AM"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                End Time *
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="11:00 AM"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Room Selector */}
          {formData.type !== 'Break' && (
            <div className="pt-2 border-t border-slate-100">
              <RoomSelector
                rooms={rooms}
                selectedRoomName={formData.room}
                onChange={(room) => setFormData({ ...formData, room })}
                roomConflict={roomConflict}
                onResolveConflict={() => setFormData({ ...formData, room: 'Hall B' })}
              />
            </div>
          )}

          {/* Speaker Selector */}
          {formData.type !== 'Break' && formData.type !== 'Networking' && (
            <div className="pt-2 border-t border-slate-100">
              <SpeakerSelector
                speakers={speakers}
                selectedSpeakerId={formData.speakerId}
                onChange={(speakerId) => setFormData({ ...formData, speakerId })}
                speakerConflict={speakerConflict}
                onResolveConflict={() => setFormData({ ...formData, speakerId: 'Arjun Mehta' })}
              />
            </div>
          )}

          {/* Capacity, Expected Attendance & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Room Capacity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected Attendance
              </label>
              <input
                type="number"
                min="0"
                value={formData.expectedAttendance}
                onChange={(e) => setFormData({ ...formData, expectedAttendance: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Session Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer font-semibold"
              >
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Session Tags */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Session Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = formData.tags?.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="Add custom tag (e.g. Kubernetes)..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shrink-0"
              >
                + Add Tag
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{editSession ? 'Save Changes' : 'Save Session'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionFormModal;
