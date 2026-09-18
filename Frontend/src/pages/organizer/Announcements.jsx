import React, { useState, useEffect } from 'react';
import { announcementService, eventService } from '../../services/api';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Megaphone, Plus, Clock, Trash2, Send } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'general' });

  const fetchAnnouncements = async (eventId) => {
    try {
      const res = await announcementService.getByEvent(eventId);
      if (res.success) setAnnouncements(res.data.announcements);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const id = evRes.data.events[0]._id;
          setSelectedEventId(id);
          await fetchAnnouncements(id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    fetchAnnouncements(id);
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await announcementService.create({
        ...form,
        eventId: selectedEventId
      });
      setShowModal(false);
      setForm({ title: '', message: '', type: 'general' });
      fetchAnnouncements(selectedEventId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await announcementService.delete(id);
      fetchAnnouncements(selectedEventId);
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <Loader text="Loading announcements..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Real-time Announcements</h1>
          <p className="text-xs text-slate-500 mt-0.5">Broadcast immediate notifications across attendee mobile badges via WebSockets.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast Message</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-bold text-slate-700">Select Event:</span>
        <select
          value={selectedEventId}
          onChange={handleEventChange}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {announcements.map((item) => (
          <div key={item._id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                    {item.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{item.message}</p>
                <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Published {formatDateTime(item.publishedAt)} by {item.createdBy?.name || 'Organizer'}</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(item._id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Delete Announcement"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Broadcast Real-Time Announcement">
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Headline *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="e.g. Keynote Starts in 15 Minutes in Hall A"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              <option value="general">General Notice</option>
              <option value="urgent">Urgent Schedule Alert</option>
              <option value="session">Session / Keynote</option>
              <option value="venue">Venue / Room Change</option>
              <option value="registration">Registration Desk</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Message *</label>
            <textarea
              rows="4"
              required
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Write clear instructions for all checked-in attendees..."
            />
          </div>
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;
