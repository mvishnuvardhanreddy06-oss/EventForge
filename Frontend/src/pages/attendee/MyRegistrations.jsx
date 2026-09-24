import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendeePortalService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import {
  FileText,
  Calendar,
  MapPin,
  QrCode,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  Trash2,
  Ticket
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReg, setSelectedReg] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchRegistrations = async () => {
    try {
      const res = await attendeePortalService.getRegistrations();
      const list = res?.data?.registrations || res?.registrations || res?.data?.data?.registrations || [];
      setRegistrations(list);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this event registration? Your ticket pass and QR token will be voided.')) return;
    setCancelling(true);
    try {
      const res = await attendeePortalService.cancelRegistration(id, { reason: 'User requested cancellation' });
      if (res?.success || res?.data?.success) {
        alert('Registration cancelled successfully.');
        setSelectedReg(null);
        fetchRegistrations();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to cancel registration');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader text="Loading your registrations..." />;

  const filtered = registrations.filter(r => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Event Registrations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your confirmed passes, registration barcodes, session selections, and booking receipts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['all', 'confirmed', 'waitlisted', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              statusFilter === tab
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No registrations found</p>
          <p className="text-xs text-slate-400">You do not have any registrations under this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const ev = item.eventId || {};
            const t = item.ticketId || {};
            const isConfirmed = item.status === 'confirmed';
            const isCancelled = item.status === 'cancelled';

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-200 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-base font-bold text-slate-900">{ev.title || 'Conference Summit'}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                        {t.name || 'General Admission'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(ev.startDate)}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ev.venue?.name || 'Main Hall'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registration #</span>
                      <span className="font-mono text-sm font-black text-slate-900">{item.registrationNumber}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paid</span>
                      <span className="text-sm font-black text-blue-600">{formatCurrency(item.finalAmount || t.price || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex items-center space-x-4 text-slate-500">
                    <span>Selected Sessions: <strong className="text-slate-800">{item.selectedSessions?.length || 0}</strong></span>
                    <span>•</span>
                    <span className="capitalize">Payment: <strong className="text-slate-800">{item.paymentStatus}</strong></span>
                    <span>•</span>
                    <span>Booked: {formatDate(item.createdAt)}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setSelectedReg(item)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center space-x-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {isConfirmed && (
                      <Link
                        to="/attendee/tickets"
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-2xs flex items-center space-x-1 transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Digital QR Pass</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Details Modal */}
      {selectedReg && (
        <Modal
          isOpen={!!selectedReg}
          onClose={() => setSelectedReg(null)}
          title={`Booking Details: ${selectedReg.registrationNumber}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">{selectedReg.eventId?.title}</h4>
              <p className="text-slate-500">
                Ticket: <strong>{selectedReg.ticketId?.name}</strong> • Amount: <strong>{formatCurrency(selectedReg.finalAmount)}</strong>
              </p>
              <p className="text-slate-500">
                Booking Date: {formatDate(selectedReg.createdAt)}
              </p>
            </div>

            {/* QR Preview if confirmed */}
            {selectedReg.qrCodeUrl && selectedReg.status === 'confirmed' && (
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <img src={selectedReg.qrCodeUrl} alt="QR Token" className="w-36 h-36 mx-auto object-contain" />
                <p className="font-mono text-xs font-bold text-slate-900">{selectedReg.registrationNumber}</p>
                <p className="text-[11px] text-slate-400">HMAC-SHA256 Encrypted Entrance Token</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              {selectedReg.status === 'confirmed' ? (
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={() => handleCancelRegistration(selectedReg._id)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center space-x-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{cancelling ? 'Cancelling...' : 'Cancel Registration'}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
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

export default MyRegistrations;
