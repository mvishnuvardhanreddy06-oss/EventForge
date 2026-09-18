import React, { useState, useEffect } from 'react';
import { sponsorService, sponsorshipService, eventService } from '../../services/api';
import SponsorCard from '../../components/SponsorCard';
import SponsorForm from '../../components/SponsorForm';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Plus, Award } from 'lucide-react';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchSponsors = async (eventId) => {
    try {
      const [spRes, pkgRes] = await Promise.all([
        sponsorService.getAll({ eventId }),
        sponsorshipService.getPackages({ eventId })
      ]);
      if (spRes.success) setSponsors(res => spRes.data.sponsors);
      if (pkgRes.success) setPackages(pkgRes.data.packages);
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
          const initialEventId = evRes.data.events[0]._id;
          setSelectedEventId(initialEventId);
          await fetchSponsors(initialEventId);
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
    fetchSponsors(id);
  };

  const handleCreateSponsor = async (formData) => {
    try {
      const res = await sponsorService.create({
        ...formData,
        eventId: selectedEventId
      });
      if (res.success) {
        setShowModal(false);
        fetchSponsors(selectedEventId);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading sponsor directory..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sponsors & Corporate Partners</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage brand partnerships, sponsorship tiers, and deliverable commitments.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sponsor</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-bold text-slate-700">Select Conference:</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sponsors.map(sp => (
          <SponsorCard key={sp._id} sponsor={sp} />
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Corporate Sponsor">
        <SponsorForm eventId={selectedEventId} packages={packages} onSubmit={handleCreateSponsor} />
      </Modal>
    </div>
  );
};

export default Sponsors;
