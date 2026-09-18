import React, { useState } from 'react';

const EventForm = ({ initialData = {}, venues = [], onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    eventType: initialData.eventType || 'Conference',
    category: initialData.category || 'Artificial Intelligence',
    venueId: initialData.venueId?._id || initialData.venueId || (venues[0]?._id || ''),
    startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
    endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
    registrationEnd: initialData.registrationEnd ? new Date(initialData.registrationEnd).toISOString().slice(0, 16) : '',
    capacity: initialData.capacity || 500,
    tags: initialData.tags ? initialData.tags.join(', ') : 'AI, Cloud, Enterprise',
    bannerImage: initialData.bannerImage || '',
    registrationRequired: initialData.registrationRequired !== false,
    approvalRequired: initialData.approvalRequired || false,
    status: initialData.status || 'draft'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="e.g. Global Tech Forum 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Event Type</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Seminar">Seminar</option>
            <option value="Networking">Networking</option>
            <option value="Tech">Tech Event</option>
            <option value="Corporate Meeting">Corporate Meeting</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
          <input
            type="text"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="e.g. Artificial Intelligence, Cloud, FinTech"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Venue</label>
          <select
            name="venueId"
            value={formData.venueId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="">Select Venue (Optional)</option>
            {venues.map(v => (
              <option key={v._id} value={v._id}>{v.name} ({v.city})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Total Capacity (Delegates) *</label>
          <input
            type="number"
            name="capacity"
            required
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Event Start Date & Time *</label>
          <input
            type="datetime-local"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Event End Date & Time *</label>
          <input
            type="datetime-local"
            name="endDate"
            required
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Registration Deadline *</label>
          <input
            type="datetime-local"
            name="registrationEnd"
            required
            value={formData.registrationEnd}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image URL</label>
          <input
            type="url"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="AI, Machine Learning, Enterprise, Security"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
          <textarea
            rows="4"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
            placeholder="Write a compelling overview of the event..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-6 pt-2">
        <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            name="approvalRequired"
            checked={formData.approvalRequired}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span>Require Organizer Approval for Attendees</span>
        </label>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving Event...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
