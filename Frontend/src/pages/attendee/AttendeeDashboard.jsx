import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService, eventService, aiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Loader from '../../components/Loader';
import EventCard from '../../components/EventCard';
import QRDisplay from '../../components/QRDisplay';
import Modal from '../../components/Modal';
import {
  Ticket,
  Calendar,
  Sparkles,
  QrCode,
  ArrowRight,
  Compass,
  Megaphone
} from 'lucide-react';

const AttendeeDashboard = () => {
  const { user } = useAuth();
  const { liveAnnouncements } = useSocket();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModalReg, setQrModalReg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, evRes] = await Promise.all([
          registrationService.getAll(),
          eventService.getAll({ status: 'published' })
        ]);
        if (regRes.success) setRegistrations(regRes.data.registrations);
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const recRes = await aiService.getRecommendations(evRes.data.events[0]._id);
          if (recRes.success) setRecommendations(recRes.data.recommendations);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading your conference passbook..." />;

  const confirmedPasses = registrations.filter(r => r.status === 'confirmed');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Live Announcement Alert Banner */}
      {liveAnnouncements.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Live Announcement: {liveAnnouncements[0].title}</p>
              <p className="text-[11px] text-blue-100">{liveAnnouncements[0].message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2 inline-block">
            Official Attendee Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Explore curated conferences, present your digital QR badge at the door, and discover AI-recommended technical sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/attendee/qr-code"
            className="inline-flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Show My QR Badge</span>
          </Link>
          <Link
            to="/attendee/browse"
            className="inline-flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-sm transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Events</span>
          </Link>
        </div>
      </div>

      {/* Quick Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Confirmed Passes</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{confirmedPasses.length}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Ticket className="w-6 h-6" /></div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">AI Recommendations</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{recommendations.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Sparkles className="w-6 h-6" /></div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Entrance Check-In</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {confirmedPasses.some(r => r.checkedIn) ? 'Checked In' : 'Ready'}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><QrCode className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Confirmed Passes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">My Event Passes ({confirmedPasses.length})</h3>
          <Link to="/attendee/tickets" className="text-xs font-bold text-blue-600 hover:underline">
            View all passes
          </Link>
        </div>

        {confirmedPasses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
            You have not registered for any events yet.{' '}
            <Link to="/attendee/browse" className="text-blue-600 font-bold hover:underline">
              Browse conferences
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {confirmedPasses.map((reg) => (
              <div key={reg._id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 mb-2">
                    {reg.ticketId?.name || 'Delegate Pass'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{reg.eventId?.title}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-1">Reg #: {reg.registrationNumber}</p>
                </div>
                <button
                  onClick={() => setQrModalReg(reg)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Badge</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Conferences to Explore */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Featured Conferences & Summits</h3>
          <Link to="/attendee/browse" className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1">
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.slice(0, 3).map((ev) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      </div>

      <Modal isOpen={!!qrModalReg} onClose={() => setQrModalReg(null)} title="My Official Delegate QR Badge">
        <QRDisplay registration={qrModalReg} />
      </Modal>
    </div>
  );
};

export default AttendeeDashboard;
