import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const SessionForm = ({ initialData = {}, venue = null, speakers = [], onSubmit, loading = false, conflictError = null }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'Keynote',
    roomId: initialData.roomId || '',
    roomName: initialData.roomName || '',
    speakerId: initialData.speakerId?._id || initialData.speakerId || '',
    startTime: initialData.startTime ? new Date(initialData.startTime).toISOString().slice(0, 16) : '',
    endTime: initialData.endTime ? new Date(initialData.endTime).toISOString().slice(0, 16) : '',
    capacity: initialData.capacity || 100,
    tags: initialData.tags ? initialData.tags.join(', ') : 'AI, Architecture'
  });

  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    const selectedRoom = venue?.rooms?.find(r => (r._id?.toString() === roomId || r.name === roomId));
    setFormData(prev => ({
      ...prev,
      roomId,
      roomName: selectedRoom ? selectedRoom.name : roomId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      capacity: Number(formData.capacity),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {conflictError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-800 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-bold">Schedule Conflict Detected!</p>
            <p className="font-normal mt-0.5">{conflictError}</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Session Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          placeholder="e.g. Scaling Autonomous Agents"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Keynote, AI, Cloud, Panel"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Assign Room</label>
          <select
            value={formData.roomId}
            onChange={handleRoomChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="">Select Room</option>
            {(venue?.rooms || []).map(r => (
              <option key={r._id || r.name} value={r._id || r.name}>
                {r.name} ({r.capacity} seats)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Assign Speaker</label>
          <select
            value={formData.speakerId}
            onChange={e => setFormData({ ...formData, speakerId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="">Select Speaker (Optional)</option>
            {speakers.map(s => (
              <option key={s._id} value={s._id}>{s.name} ({s.company || 'Independent'})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
          <input
            type="number"
            min="10"
            value={formData.capacity}
            onChange={e => setFormData({ ...formData, capacity: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Start Time *</label>
          <input
            type="datetime-local"
            required
            value={formData.startTime}
            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">End Time *</label>
          <input
            type="datetime-local"
            required
            value={formData.endTime}
            onChange={e => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
        <textarea
          rows="3"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Validating Conflicts...' : 'Save Session'}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
