import React, { useState, useEffect } from 'react';
import { registrationService, eventService } from '../../services/api';
import RegistrationTable from '../../components/RegistrationTable';
import Waitlist from '../../components/Waitlist';
import QRDisplay from '../../components/QRDisplay';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('confirmed'); // 'confirmed' or 'waitlist'
  const [previewRegistration, setPreviewRegistration] = useState(null);

  const fetchRegistrations = async (eventId) => {
    try {
      const res = await registrationService.getAll({ eventId });
      if (res.success) setRegistrations(res.data.registrations);
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
          await fetchRegistrations(id);
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
    fetchRegistrations(id);
  };

  const handleCancel = async (regId) => {
    if (!window.confirm('Cancel this registration? If confirmed, the next waitlisted attendee will be auto-promoted.')) return;
    try {
      await registrationService.cancel(regId);
      fetchRegistrations(selectedEventId);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleApprove = async (regId) => {
    try {
      await registrationService.approve(regId);
      fetchRegistrations(selectedEventId);
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <Loader text="Loading registrations..." />;

  const confirmedList = registrations.filter(r => ['confirmed', 'approved', 'pending'].includes(r.status));
  const waitlist = registrations.filter(r => r.status === 'waitlisted');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Registrations & Waitlist</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage confirmed delegate rosters and automated waitlist promotion queue.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'confirmed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Confirmed ({confirmedList.length})
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'waitlist' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Waitlist Queue ({waitlist.length})
          </button>
        </div>
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

      {activeTab === 'confirmed' ? (
        <RegistrationTable
          registrations={confirmedList}
          isOrganizer={true}
          onCancel={handleCancel}
          onApprove={handleApprove}
          onViewQR={(reg) => setPreviewRegistration(reg)}
        />
      ) : (
        <Waitlist waitlist={waitlist} onPromote={handleApprove} />
      )}

      <Modal isOpen={!!previewRegistration} onClose={() => setPreviewRegistration(null)} title="Attendee Digital QR Ticket">
        <QRDisplay registration={previewRegistration} />
      </Modal>
    </div>
  );
};

export default Registrations;
