import React, { useState, useEffect } from 'react';
import { ticketService, eventService } from '../../services/api';
import TicketCard from '../../components/TicketCard';
import TicketForm from '../../components/TicketForm';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Plus } from 'lucide-react';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTickets = async (eventId) => {
    try {
      const res = await ticketService.getByEvent(eventId);
      if (res.success) setTickets(res.data.tickets);
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
          await fetchTickets(id);
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
    fetchTickets(id);
  };

  const handleCreateTicket = async (formData) => {
    try {
      const res = await ticketService.create({
        ...formData,
        eventId: selectedEventId
      });
      if (res.success) {
        setShowModal(false);
        fetchTickets(selectedEventId);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading ticket tiers..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ticket Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage passes (VIP, Standard, Student, Corporate) and monitor quotas.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Ticket Tier</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-bold text-slate-700">Target Event:</span>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Ticket Pass">
        <TicketForm eventId={selectedEventId} onSubmit={handleCreateTicket} />
      </Modal>
    </div>
  );
};

export default Tickets;
