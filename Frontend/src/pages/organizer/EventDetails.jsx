import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../../services/api';
import Loader from '../../components/Loader';
import Badge from '../../components/Badge';
import SessionCard from '../../components/SessionCard';
import TicketCard from '../../components/TicketCard';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  Calendar,
  MapPin,
  Users,
  Edit3,
  CheckCircle,
  Clock,
  Ticket,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await eventService.getById(id);
      if (res.success) {
        setEvent(res.data.event);
        setTickets(res.data.tickets || []);
        setSessions(res.data.sessions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleTogglePublish = async () => {
    try {
      await eventService.togglePublish(id);
      fetchEvent();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <Loader text="Loading event details..." />;
  if (!event) return <div className="p-8 text-center text-xs text-slate-400">Event not found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 shadow-xl">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'})` }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Badge status={event.status} />
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm">
                {event.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
              {event.title}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleTogglePublish}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                event.status === 'published'
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {event.status === 'published' ? 'Unpublish to Draft' : 'Publish Live'}
            </button>
            <Link
              to={`/organizer/events/${event._id}/edit`}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold mb-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Schedule</span>
          </div>
          <p className="text-xs font-bold text-slate-900">{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold mb-1">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Venue</span>
          </div>
          <p className="text-xs font-bold text-slate-900">{event.venueId?.name || 'TBA'}, {event.venueId?.city || ''}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Capacity</span>
          </div>
          <p className="text-xs font-bold text-slate-900">{event.capacity} Attendees</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold mb-1">
            <Ticket className="w-4 h-4 text-blue-600" />
            <span>Active Tickets</span>
          </div>
          <p className="text-xs font-bold text-slate-900">{tickets.length} Tiers Configured</p>
        </div>
      </div>

      {/* Scheduled Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Conference Sessions ({sessions.length})</h3>
          <Link to="/organizer/sessions" className="text-xs font-bold text-blue-600 hover:underline">
            Manage Sessions & Conflicts
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map(s => (
            <SessionCard key={s._id} session={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
