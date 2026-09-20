import React, { useState, useEffect } from 'react';
import { X, Edit2, ShieldAlert } from 'lucide-react';
import IndianPhoneInput from '../../IndianPhoneInput';
import { validateIndianPhone, normalizeIndianPhone } from '../../../utils/phoneUtils';

const TICKET_TYPES = ['Standard', 'VIP', 'Early Bird', 'Student', 'Corporate'];

const DIETARY_OPTIONS = [
  'Standard / No Restrictions',
  'Vegetarian',
  'Vegan',
  'Jain Vegetarian',
  'Halal',
  'Gluten-Free'
];

const EditAttendeeModal = ({
  isOpen,
  onClose,
  attendee,
  onSave
}) => {
  if (!isOpen || !attendee) return null;

  const [form, setForm] = useState({
    firstName: attendee.firstName || '',
    lastName: attendee.lastName || '',
    email: attendee.email || '',
    phone: attendee.phone || '',
    company: attendee.company || '',
    designation: attendee.designation || '',
    city: attendee.city || 'Bengaluru',
    ticketType: attendee.ticketType || 'VIP',
    dietaryPreference: attendee.dietaryPreference || 'Standard / No Restrictions',
    accessibilityRequirements: attendee.accessibilityRequirements || '',
    notes: attendee.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (attendee) {
      setForm({
        firstName: attendee.firstName || '',
        lastName: attendee.lastName || '',
        email: attendee.email || '',
        phone: attendee.phone || '',
        company: attendee.company || '',
        designation: attendee.designation || '',
        city: attendee.city || 'Bengaluru',
        ticketType: attendee.ticketType || 'VIP',
        dietaryPreference: attendee.dietaryPreference || 'Standard / No Restrictions',
        accessibilityRequirements: attendee.accessibilityRequirements || '',
        notes: attendee.notes || ''
      });
    }
  }, [attendee]);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Enter a valid email address.';
    }

    const phoneValidation = validateIndianPhone(form.phone, true);
    if (!phoneValidation.isValid) {
      errs.phone = phoneValidation.error;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const updated = {
      ...attendee,
      ...form,
      phone: normalizeIndianPhone(form.phone)
    };

    setTimeout(() => {
      onSave(updated);
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-2xl w-full overflow-hidden flex flex-col my-6 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Edit Attendee
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Update attendee profile, credentials, contact, and preferences
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Read-Only Payment Notice */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-600">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-[11px] font-semibold">
                Historical payment records are locked for audit compliance. To alter tier charges, use Ticket Management.
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900 ml-2 whitespace-nowrap">
              ₹{typeof attendee.amountPaid === 'number' ? attendee.amountPaid.toLocaleString('en-IN') : '4,999'} ({attendee.paymentStatus})
            </span>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => {
                  setForm({ ...form, firstName: e.target.value });
                  if (errors.firstName) setErrors({ ...errors, firstName: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none ${
                  errors.firstName ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.firstName && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => {
                  setForm({ ...form, lastName: e.target.value });
                  if (errors.lastName) setErrors({ ...errors, lastName: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none ${
                  errors.lastName ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.lastName && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none ${
                  errors.email ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <IndianPhoneInput
                label="Indian Mobile Number"
                required={true}
                value={form.phone}
                onChange={(val) => {
                  setForm({ ...form, phone: val });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                error={errors.phone}
                placeholder="98765 43210"
              />
            </div>
          </div>

          {/* Company & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          {/* City & Ticket Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ticket Tier</label>
              <select
                value={form.ticketType}
                onChange={(e) => setForm({ ...form, ticketType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {TICKET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dietary Preference & Accessibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Preference</label>
              <select
                value={form.dietaryPreference}
                onChange={(e) => setForm({ ...form, dietaryPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {DIETARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Accessibility Requirements</label>
              <input
                type="text"
                value={form.accessibilityRequirements}
                onChange={(e) => setForm({ ...form, accessibilityRequirements: e.target.value })}
                placeholder="e.g. Wheelchair ramp, Sign interpreter"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAttendeeModal;
