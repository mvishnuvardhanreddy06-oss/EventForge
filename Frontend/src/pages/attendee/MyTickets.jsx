import React, { useState, useEffect } from 'react';
import { registrationService } from '../../services/api';
import Loader from '../../components/Loader';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import QRDisplay from '../../components/QRDisplay';
import { QrCode, Calendar, MapPin, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const MyTickets = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReg, setActiveReg] = useState(null);

  const fetchRegistrations = async () => {
    try {
      const res = await registrationService.getAll();
      if (res.success) setRegistrations(res.data.registrations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this pass? Your seat will be released to the waitlist.')) return;
    try {
      await registrationService.cancel(id);
      fetchRegistrations();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <Loader text="Loading your registered tickets..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Registered Passes</h1>
        <p className="text-xs text-slate-500 mt-0.5">Access your digital tickets, verifiable QR codes, and entry status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {registrations.map((reg) => (
          <div key={reg._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {reg.ticketId?.name || 'Delegate Pass'}
                </span>
                <Badge status={reg.status} />
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1">{reg.eventId?.title}</h3>
              <p className="text-xs text-slate-500 flex items-center space-x-1 mb-4">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(reg.eventId?.startDate)} - {formatDate(reg.eventId?.endDate)}</span>
              </p>
              <p className="font-mono text-xs font-bold text-slate-400 mb-4">
                Reg Number: <strong className="text-blue-600">{reg.registrationNumber}</strong>
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveReg(reg)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>View Digital Badge</span>
              </button>

              {reg.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancel(reg._id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700"
                >
                  Cancel Pass
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!activeReg} onClose={() => setActiveReg(null)} title="Verified Event Entry Badge">
        <QRDisplay registration={activeReg} />
      </Modal>
    </div>
  );
};

export default MyTickets;
