import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, ticketService, couponService, registrationService } from '../../services/api';
import TicketCard from '../../components/TicketCard';
import Loader from '../../components/Loader';
import { CheckCircle2, AlertCircle, Tag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, tRes] = await Promise.all([
          eventService.getById(eventId),
          ticketService.getByEvent(eventId)
        ]);
        if (evRes.success) setEvent(evRes.data.event);
        if (tRes.success && tRes.data.tickets.length > 0) {
          setTickets(tRes.data.tickets);
          setSelectedTicket(tRes.data.tickets[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode || !selectedTicket) return;
    setCouponError('');
    try {
      const res = await couponService.validate({
        eventId,
        code: couponCode.toUpperCase(),
        ticketPrice: selectedTicket.price
      });
      if (res.success) {
        setAppliedCoupon(res.data);
      }
    } catch (err) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!selectedTicket) {
      alert('Please select a ticket tier');
      return;
    }
    setSubmitting(true);
    try {
      const res = await registrationService.register({
        eventId,
        ticketId: selectedTicket._id,
        couponCode: appliedCoupon ? couponCode : undefined
      });
      if (res.success) {
        setStatusMessage(res.message);
        setTimeout(() => {
          navigate('/attendee/tickets');
        }, 1800);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Preparing registration portal..." />;
  if (!event) return <div className="p-8 text-center text-xs text-slate-400">Event not found</div>;

  const finalAmount = appliedCoupon ? appliedCoupon.finalPrice : (selectedTicket?.price || 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Conference Registration</h1>
        <p className="text-xs text-slate-500 mt-0.5">Event: <strong>{event.title}</strong></p>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-black">{statusMessage}</p>
            <p className="text-xs">Redirecting to your digital badge wallet...</p>
          </div>
        </div>
      )}

      {/* Ticket Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-3">Select Your Ticket Pass</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tickets.map((t) => (
            <TicketCard
              key={t._id}
              ticket={t}
              isSelected={selectedTicket?._id === t._id}
              onSelect={(ticket) => {
                setSelectedTicket(ticket);
                setAppliedCoupon(null);
              }}
            />
          ))}
        </div>
      </div>

      {/* Coupon Application */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700">Have an invitation coupon?</label>
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <div className="flex-1 flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-xl">
            <Tag className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. TECHVIP20, EARLY50"
              className="w-full text-xs font-mono font-bold focus:outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Apply
          </button>
        </form>

        {couponError && <p className="text-xs text-rose-600 font-medium">{couponError}</p>}
        {appliedCoupon && (
          <p className="text-xs text-emerald-600 font-bold">
            Coupon applied! You saved {formatCurrency(appliedCoupon.discount)}.
          </p>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-medium">Selected Pass: {selectedTicket?.name}</span>
          <div className="text-2xl font-black text-white mt-0.5">
            Total: {formatCurrency(finalAmount)}
          </div>
        </div>

        <button
          onClick={handleCompleteRegistration}
          disabled={submitting}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
        >
          <span>{submitting ? 'Confirming Registration...' : 'Confirm & Generate Badge'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Registration;
