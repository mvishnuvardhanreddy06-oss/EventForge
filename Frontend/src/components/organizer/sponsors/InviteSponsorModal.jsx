import React, { useState } from 'react';
import { X, Send, Building2, User, Mail, DollarSign } from 'lucide-react';
import IndianPhoneInput from '../../IndianPhoneInput';
import { validateIndianPhone, normalizeIndianPhone } from '../../../utils/phoneUtils';

const DEFAULT_INVITE_MESSAGE = `Dear Partner,

We cordially invite your organization to partner with us as an official sponsor for our upcoming conference. 

Please review our sponsorship packages and confirm your participation. We look forward to collaborating with your brand.`;

const InviteSponsorModal = ({
  isOpen,
  onClose,
  onInvite,
  packages = []
}) => {
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    packageId: packages[0]?._id || '',
    message: DEFAULT_INVITE_MESSAGE
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!form.email.trim()) newErrors.email = 'Contact email is required';

    const phoneValidation = validateIndianPhone(form.phone, true);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onInvite({
        ...form,
        phone: normalizeIndianPhone(form.phone),
        status: 'pending'
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-lg w-full overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Invite Corporate Sponsor
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Send a formal sponsorship proposal and partnership invitation
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
        <form onSubmit={handleSend} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              value={form.companyName}
              onChange={e => {
                setForm({ ...form, companyName: e.target.value });
                if (errors.companyName) setErrors({ ...errors, companyName: '' });
              }}
              placeholder="e.g. Google Cloud, Snowflake"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                errors.companyName ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.companyName && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.companyName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person *</label>
              <input
                type="text"
                value={form.contactPerson}
                onChange={e => {
                  setForm({ ...form, contactPerson: e.target.value });
                  if (errors.contactPerson) setErrors({ ...errors, contactPerson: '' });
                }}
                placeholder="e.g. Rajesh Sharma"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.contactPerson ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.contactPerson && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.contactPerson}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="partner@company.com"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.email ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Indian Phone Input */}
          <div>
            <IndianPhoneInput
              label="Contact Mobile Number"
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

          {/* Sponsorship Tier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Package Tier</label>
            <select
              value={form.packageId}
              onChange={e => setForm({ ...form, packageId: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="">Select Package Tier</option>
              {packages.map(p => (
                <option key={p._id || p.name} value={p._id || p.name}>
                  {p.name} {p.price ? `(₹${p.price})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Invitation Proposal Message</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Footer */}
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
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Send Invitation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteSponsorModal;
