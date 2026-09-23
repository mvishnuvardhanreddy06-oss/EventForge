import React, { useState, useEffect } from 'react';
import { attendeePortalService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import {
  Ticket,
  QrCode,
  Calendar,
  MapPin,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printableTicket, setPrintableTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await attendeePortalService.getTickets();
        if (res.data?.success) {
          setTickets(res.data.data.tickets || []);
        }
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <Loader text="Loading your digital passbook..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Digital Pass Wallet</h1>
        <p className="text-xs text-slate-500 mt-1">
          Present your digital barcode pass on your mobile device at conference registration desks and security gates.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No active conference badges</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You do not have any confirmed event tickets at this time. Browse available events to secure your pass.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => {
            const ev = t.eventId || {};
            const ticketType = t.ticketId || {};
            const isCheckedIn = t.checkedIn;

            return (
              <div
                key={t._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Pass Header */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white border border-white/20">
                        {ticketType.name || 'All-Access Pass'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCheckedIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {isCheckedIn ? '✓ Checked In' : 'Active Pass'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-1">{ev.title}</h3>
                    <p className="text-xs text-slate-300 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{formatDate(ev.startDate)}</span>
                    </p>
                  </div>

                  {/* QR Code Canvas */}
                  <div className="p-6 flex flex-col items-center justify-center bg-slate-50/60 border-b border-dashed border-slate-200">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                      {t.qrCodeUrl ? (
                        <img src={t.qrCodeUrl} alt="Badge QR Code" className="w-40 h-40 object-contain" />
                      ) : (
                        <div className="w-40 h-40 flex items-center justify-center bg-slate-100 rounded-xl">
                          <QrCode className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-900 mt-2.5 tracking-wider">
                      {t.registrationNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">HMAC-SHA256 Encrypted Token</span>
                  </div>

                  {/* Pass Meta */}
                  <div className="p-5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Attendee:</span>
                      <span className="font-bold text-slate-900">{user?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Venue:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">{ev.venue?.name || 'Convention Center'}</span>
                    </div>
                    {isCheckedIn && (
                      <div className="flex items-center justify-between text-emerald-600 font-semibold pt-1">
                        <span>Check-In Recorded:</span>
                        <span>{t.checkedInAt ? formatDate(t.checkedInAt) : 'Gate Verified'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Print/View Footer */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setPrintableTicket(t)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Badge Pass</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Ticket Pass Modal */}
      {printableTicket && (
        <Modal
          isOpen={!!printableTicket}
          onClose={() => setPrintableTicket(null)}
          title={`Conference Pass: ${printableTicket.registrationNumber}`}
        >
          <div className="space-y-6 text-xs text-slate-700">
            {/* The Badge Canvas */}
            <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl shadow-xl space-y-4 border border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                      EF
                    </div>
                    <span className="font-black text-base tracking-tight">EventForge Pass</span>
                  </div>
                  <span className="text-[10px] text-blue-300 font-mono mt-0.5 block">{printableTicket.registrationNumber}</span>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white">
                  {printableTicket.ticketId?.name || 'Standard Pass'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{printableTicket.eventId?.title}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  {formatDate(printableTicket.eventId?.startDate)} • {printableTicket.eventId?.venue?.name || 'Main Hall'}
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center">
                {printableTicket.qrCodeUrl ? (
                  <img src={printableTicket.qrCodeUrl} alt="Printable QR" className="w-48 h-48 object-contain" />
                ) : (
                  <QrCode className="w-48 h-48 text-slate-400" />
                )}
                <span className="font-mono text-xs font-bold text-slate-900 mt-2">{printableTicket.registrationNumber}</span>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-slate-300 border-t border-white/10">
                <span>Attendee: <strong className="text-white">{user?.name}</strong></span>
                <span className="text-[10px] font-mono text-slate-400">{user?.email}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-2xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintableTicket(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyTickets;
