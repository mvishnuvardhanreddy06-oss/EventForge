import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService, attendeePortalService } from '../../services/api';
import Loader from '../../components/Loader';
import Badge from '../../components/Badge';
import SessionCard from '../../components/SessionCard';
import TicketCard from '../../components/TicketCard';
import { formatDate } from '../../utils/formatters';
import { Calendar, MapPin, Users, Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';

const AttendeeEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await attendeePortalService.getEventDetails(id).catch(() => eventService.getById(id));
        const evData = res?.data?.event || res?.event || res?.data;
        if (evData) {
          setEvent(evData);
          setTickets(res?.data?.tickets || res?.tickets || []);
          setSessions(res?.data?.sessions || res?.sessions || []);
          if (res?.data?.registration?.isRegistered || res?.registration?.isRegistered) {
            setIsRegistered(true);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <Loader text="Loading event details..." />;
  if (!event) return <div className="p-8 text-center text-xs text-slate-400">Event not found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'})` }} />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/30">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
              {event.eventType}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 mb-8">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{event.venueId?.name || 'TBA'}, {event.venueId?.city || ''}</span>
            </div>
          </div>

          {isRegistered ? (
            <Link
              to="/attendee/tickets"
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Pass Active (View Ticket)</span>
            </Link>
          ) : (
            <Link
              to={`/attendee/register/${event._id}`}
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>Reserve Ticket & Register</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Ticket Selection Tiers */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-2">Available Passes & Passes</h3>
        <p className="text-xs text-slate-500 mb-6">Select your conference tier. Coupons can be applied during checkout.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <TicketCard key={ticket._id} ticket={ticket} onSelect={() => {}} />
          ))}
        </div>
      </div>

      {/* Keynote Sessions */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-2">Conference Agenda & Schedule</h3>
        <p className="text-xs text-slate-500 mb-6">Preview keynote addresses, breakout tracks, and technical labs.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map(s => (
            <SessionCard key={s._id} session={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendeeEventDetails;
