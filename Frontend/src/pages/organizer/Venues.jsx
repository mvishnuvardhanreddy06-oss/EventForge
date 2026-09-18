import React, { useState, useEffect } from 'react';
import { venueService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Building, Plus, MapPin, Users, Layers } from 'lucide-react';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  const [form, setForm] = useState({ name: '', address: '', city: 'San Francisco', capacity: 1000, facilities: 'High-speed Wi-Fi, A/V Recording, Stage' });
  const [roomForm, setRoomForm] = useState({ name: 'Breakout Hall C', capacity: 200, floor: '2nd Floor' });

  const fetchVenues = async () => {
    try {
      const res = await venueService.getAll();
      if (res.success) setVenues(res.data.venues);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        facilities: form.facilities.split(',').map(f => f.trim()).filter(Boolean)
      };
      await venueService.create(payload);
      setShowModal(false);
      fetchVenues();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await venueService.addRoom(selectedVenueId, {
        ...roomForm,
        capacity: Number(roomForm.capacity)
      });
      setShowRoomModal(false);
      fetchVenues();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading venues..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Venues & Rooms</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage conference centers, auditoriums, and breakout rooms.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Venue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {venues.map((venue) => (
          <div key={venue._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{venue.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{venue.address}, {venue.city}</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {venue.capacity} Total Capacity
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Rooms & Halls ({venue.rooms?.length || 0})</span>
                </h4>
                <div className="space-y-2">
                  {(venue.rooms || []).map((room, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{room.name}</span>
                      <span className="text-slate-500">{room.capacity} seats ({room.floor})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedVenueId(venue._id);
                  setShowRoomModal(true);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                + Add Room to Venue
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Venue Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Conference Venue">
        <form onSubmit={handleCreateVenue} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Venue Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Address *</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Venue Capacity</label>
            <input
              type="number"
              required
              min="1"
              value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Facilities (comma separated)</label>
            <input
              type="text"
              value={form.facilities}
              onChange={e => setForm({ ...form, facilities: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Save Venue
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Room Modal */}
      <Modal isOpen={showRoomModal} onClose={() => setShowRoomModal(false)} title="Add Room to Venue">
        <form onSubmit={handleAddRoom} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Room / Hall Name *</label>
            <input
              type="text"
              required
              value={roomForm.name}
              onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Capacity (Seats) *</label>
              <input
                type="number"
                required
                min="1"
                value={roomForm.capacity}
                onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Floor Level</label>
              <input
                type="text"
                value={roomForm.floor}
                onChange={e => setRoomForm({ ...roomForm, floor: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Save Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Venues;
