import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { attendeePortalService, couponService, ticketService, eventService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import {
  Ticket,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  Mail,
  Building2,
  QrCode,
  ArrowLeft
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form Details
  const [attendeeDetails, setAttendeeDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    organization: '',
    designation: '',
    dietaryRequirements: 'Vegetarian',
    tShirtSize: 'L'
  });

  const [phoneError, setPhoneError] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, tRes] = await Promise.all([
          attendeePortalService.getEventDetails(eventId).catch(() => eventService.getById(eventId)),
          ticketService.getByEvent(eventId)
        ]);
        const evData = evRes?.data?.event || evRes?.event || evRes?.data;
        if (evData) {
          setEvent(evData);
        }

        const regData = evRes?.data?.registration || evRes?.registration;
        if (regData?.isRegistered) {
          setAlreadyRegistered(true);
        }

        let ticketList = tRes?.data?.tickets || tRes?.tickets || tRes?.data || [];
        if (!Array.isArray(ticketList) || ticketList.length === 0) {
          const evTickets = evRes?.data?.tickets || evRes?.tickets;
          if (Array.isArray(evTickets) && evTickets.length > 0) {
            ticketList = evTickets;
          }
        }
        if (Array.isArray(ticketList) && ticketList.length > 0) {
          setTickets(ticketList);
          setSelectedTicket(ticketList[0]);
        }
      } catch (err) {
        console.error('Failed to load registration data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  // Indian Phone Validator
  const validatePhone = (phoneStr) => {
    if (!phoneStr) return false;
    const cleaned = phoneStr.replace(/[\s-]/g, '');
    const indianRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    return indianRegex.test(cleaned);
  };

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
      if (res.success || res.data?.success) {
        setAppliedCoupon(res.data?.data || res.data);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || err.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (alreadyRegistered) {
      setErrorMsg('You already have a confirmed registration for this event.');
      return;
    }

    if (!selectedTicket) {
      setErrorMsg('Please select a conference ticket pass.');
      return;
    }

    if (!validatePhone(attendeeDetails.phone)) {
      setPhoneError('Please enter a valid Indian mobile number (e.g. +91 98765 43210 or 9876543210).');
      return;
    } else {
      setPhoneError('');
    }

    setSubmitting(true);

    try {
      const isFree = (appliedCoupon ? appliedCoupon.finalPrice : (selectedTicket?.price || 0)) <= 0;
      const payload = {
        ticketId: selectedTicket._id,
        couponCode: appliedCoupon ? couponCode : undefined,
        attendeeDetails,
        paymentDetails: isFree ? {
          method: 'Free Registration',
          transactionId: `FREE-${Date.now()}`
        } : {
          method: paymentMethod,
          transactionId: `TXN-${Date.now()}`
        }
      };

      const res = await attendeePortalService.registerForEvent(eventId, payload);
      if (res?.success || res?.data?.success) {
        const reg = res?.data?.registration || res?.registration || res?.data?.data?.registration;
        setSuccessData(reg);
        setTimeout(() => {
          navigate('/attendee/tickets');
        }, 2000);
      } else {
        setErrorMsg(res?.message || res?.data?.message || 'Registration failed.');
      }
    } catch (err) {
      const isAlreadyReg = err.status === 409 ||
        err.response?.status === 409 ||
        (err.message && err.message.toLowerCase().includes('already registered'));

      if (isAlreadyReg) {
        setAlreadyRegistered(true);
        setErrorMsg('You already hold a confirmed registration for this conference. Redirecting to your ticket pass...');
        setTimeout(() => {
          navigate('/attendee/tickets');
        }, 1800);
      } else {
        setErrorMsg(err.response?.data?.message || err.message || 'Failed to complete registration.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Preparing conference registration..." />;
  if (!event) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto space-y-4">
        <p className="text-sm font-bold text-slate-700">Event not found</p>
        <Link to="/attendee/browse" className="text-xs text-blue-600 hover:underline">
          Return to Events Directory
        </Link>
      </div>
    );
  }

  const finalAmount = appliedCoupon
    ? appliedCoupon.finalPrice
    : (selectedTicket?.price || 0);
  const isFree = finalAmount <= 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to={`/attendee/events/${eventId}`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Brief</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Conference Registration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Event: <strong className="text-slate-800">{event.title}</strong> • Dates: {formatDate(event.startDate)}
        </p>
      </div>

      {/* Success Banner */}
      {successData && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center space-x-4 text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Registration Confirmed!</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              Badge <strong className="font-mono">{successData.registrationNumber}</strong> generated with digital HMAC QR token. Redirecting to your digital wallet...
            </p>
          </div>
        </div>
      )}

      {/* Already Registered Notice */}
      {alreadyRegistered && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-blue-900 text-xs shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">You are already registered for this event</p>
              <p className="text-blue-700 mt-0.5">Your official conference pass and QR badge have already been issued.</p>
            </div>
          </div>
          <Link
            to="/attendee/tickets"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors shrink-0 text-center"
          >
            View Ticket Pass
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-800 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitRegistration} className="space-y-6">
        {/* Ticket Tier Selector */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Ticket className="w-4 h-4 text-blue-600" />
            <span>Select Ticket Pass *</span>
          </h3>

          {tickets.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>No ticket tiers have been published for this event yet. Please contact the conference organizers.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tickets.map((t) => {
                const isSelected = selectedTicket?._id === t._id;
                return (
                  <div
                    key={t._id}
                    onClick={() => {
                      setSelectedTicket(t);
                      setAppliedCoupon(null);
                      setErrorMsg('');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{t.name}</span>
                      <span className="text-sm font-black text-blue-600">{formatCurrency(t.price)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.description || 'Full conference access'}</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Available: {t.remainingQuantity ?? t.quantity ?? 100}</span>
                      <span className={isSelected ? 'text-blue-600 font-bold' : ''}>
                        {isSelected ? '✓ Selected' : 'Choose'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Attendee Profile Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-4 h-4 text-purple-600" />
            <span>Participant Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                value={attendeeDetails.name}
                onChange={(e) => setAttendeeDetails({ ...attendeeDetails, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={attendeeDetails.email}
                onChange={(e) => setAttendeeDetails({ ...attendeeDetails, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Indian Phone Validation */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Mobile Phone (India +91) *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={attendeeDetails.phone}
                onChange={(e) => {
                  setAttendeeDetails({ ...attendeeDetails, phone: e.target.value });
                  if (phoneError) setPhoneError('');
                }}
                className={`w-full p-2.5 rounded-xl border ${
                  phoneError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono text-xs`}
              />
              {phoneError ? (
                <p className="text-[11px] text-rose-600 font-semibold">{phoneError}</p>
              ) : (
                <p className="text-[10px] text-slate-400">Format: +91 98765 43210 or 10-digit Indian number</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Organization / Company</label>
              <input
                type="text"
                placeholder="Google Cloud, Microsoft, Infosys, Startup..."
                value={attendeeDetails.organization}
                onChange={(e) => setAttendeeDetails({ ...attendeeDetails, organization: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Dietary Preferences</label>
              <select
                value={attendeeDetails.dietaryRequirements}
                onChange={(e) => setAttendeeDetails({ ...attendeeDetails, dietaryRequirements: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain">Jain Vegetarian</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">T-Shirt Swag Size</label>
              <select
                value={attendeeDetails.tShirtSize}
                onChange={(e) => setAttendeeDetails({ ...attendeeDetails, tShirtSize: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="S">S (Small)</option>
                <option value="M">M (Medium)</option>
                <option value="L">L (Large)</option>
                <option value="XL">XL (Extra Large)</option>
                <option value="XXL">XXL (2X Large)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-slate-700">Promotional or Partner Coupon</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. TECHVIP20, EARLY50"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              Apply Code
            </button>
          </div>

          {couponError && <p className="text-xs text-rose-600 font-semibold">{couponError}</p>}
          {appliedCoupon && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Coupon <strong>{couponCode}</strong> applied! Discount of {formatCurrency(appliedCoupon.discount)} deducted.</span>
            </div>
          )}
        </div>

        {/* Payment Method - Only show for paid tickets */}
        {!isFree && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {['Credit Card', 'UPI / QR', 'NetBanking', 'Corporate Pass'].map((method) => (
                <label
                  key={method}
                  className={`p-3 rounded-xl border-2 flex items-center space-x-2 cursor-pointer transition-all ${
                    paymentMethod === method
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <span className="truncate">{method}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary & Submit */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400">
              {isFree ? 'Registration Fee' : 'Total Registration Fee'}
            </span>
            <div className="text-2xl font-black text-white">
              {isFree ? 'Free' : formatCurrency(finalAmount)}
            </div>
            {appliedCoupon && !isFree && (
              <span className="text-[11px] text-emerald-400 block">
                Original: {formatCurrency(selectedTicket?.price || 0)} (Discount Applied)
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || alreadyRegistered || tickets.length === 0}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>
              {submitting
                ? 'Generating Digital Badge...'
                : alreadyRegistered
                ? 'Pass Already Issued'
                : tickets.length === 0
                ? 'No Passes Available'
                : isFree
                ? 'Confirm Registration'
                : 'Confirm Registration & Badge'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
