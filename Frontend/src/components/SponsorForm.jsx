import React, { useState } from 'react';
import IndianPhoneInput from './IndianPhoneInput';
import { validateIndianPhone, normalizeIndianPhone } from '../utils/phoneUtils';

const SponsorForm = ({ eventId, packages = [], initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    eventId: eventId || initialData.eventId || '',
    companyName: initialData.companyName || '',
    contactPerson: initialData.contactPerson || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    website: initialData.website || '',
    logo: initialData.logo || '',
    packageId: initialData.packageId?._id || initialData.packageId || (packages[0]?._id || ''),
    // Payment & Contract Contacts
    paymentContactPerson: initialData.paymentContactPerson || '',
    paymentPhone: initialData.paymentPhone || '',
    contractContactPerson: initialData.contractContactPerson || '',
    contractPhone: initialData.contractPhone || ''
  });

  const [errors, setErrors] = useState({});
  const [showAdditionalContacts, setShowAdditionalContacts] = useState(
    Boolean(initialData.paymentPhone || initialData.contractPhone)
  );

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Contact email is required';
    }

    // Validate primary mobile number (Required)
    const phoneValidation = validateIndianPhone(formData.phone, true);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }

    // Validate payment phone if provided
    if (formData.paymentPhone) {
      const paymentValidation = validateIndianPhone(formData.paymentPhone, false);
      if (!paymentValidation.isValid) {
        newErrors.paymentPhone = paymentValidation.error;
      }
    }

    // Validate contract phone if provided
    if (formData.contractPhone) {
      const contractValidation = validateIndianPhone(formData.contractPhone, false);
      if (!contractValidation.isValid) {
        newErrors.contractPhone = contractValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Normalize phone numbers to stored format: +919876543210 (no spaces)
    const normalizedData = {
      ...formData,
      phone: normalizeIndianPhone(formData.phone),
      paymentPhone: formData.paymentPhone ? normalizeIndianPhone(formData.paymentPhone) : '',
      contractPhone: formData.contractPhone ? normalizeIndianPhone(formData.contractPhone) : ''
    };

    onSubmit(normalizedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company Name */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={e => {
            setFormData({ ...formData, companyName: e.target.value });
            if (errors.companyName) setErrors({ ...errors, companyName: '' });
          }}
          className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none ${
            errors.companyName ? 'border-rose-400' : 'border-slate-200'
          }`}
          placeholder="e.g. Google Cloud, Snowflake, TechNova"
        />
        {errors.companyName && (
          <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.companyName}</p>
        )}
      </div>

      {/* Primary Contact Person & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person *</label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={e => {
              setFormData({ ...formData, contactPerson: e.target.value });
              if (errors.contactPerson) setErrors({ ...errors, contactPerson: '' });
            }}
            placeholder="e.g. Rajesh Sharma"
            className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none ${
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
            value={formData.email}
            onChange={e => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            placeholder="e.g. partnerships@company.com"
            className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none ${
              errors.email ? 'border-rose-400' : 'border-slate-200'
            }`}
          />
          {errors.email && (
            <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Indian Mobile Number (Primary Sponsor Contact) */}
      <div>
        <IndianPhoneInput
          label="Mobile Number"
          required={true}
          value={formData.phone}
          onChange={(normalizedVal) => {
            setFormData({ ...formData, phone: normalizedVal });
            if (errors.phone) setErrors({ ...errors, phone: '' });
          }}
          error={errors.phone}
          placeholder="98765 43210"
        />
      </div>

      {/* Package & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Sponsorship Package</label>
          <select
            value={formData.packageId}
            onChange={e => setFormData({ ...formData, packageId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="">Select Tier</option>
            {packages.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} {p.price ? `(₹${p.price})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={e => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="https://company.com"
          />
        </div>
      </div>

      {/* Logo URL */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Company Logo URL</label>
        <input
          type="url"
          value={formData.logo}
          onChange={e => setFormData({ ...formData, logo: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      {/* Optional Payment & Contract Contacts Accordion */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAdditionalContacts(!showAdditionalContacts)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <span>{showAdditionalContacts ? '− Hide' : '+ Add'} Payment & Contract Contacts</span>
        </button>

        {showAdditionalContacts && (
          <div className="mt-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3.5">
            {/* Payment Contact */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Payment Contact
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Contact Person</label>
                  <input
                    type="text"
                    value={formData.paymentContactPerson}
                    onChange={e => setFormData({ ...formData, paymentContactPerson: e.target.value })}
                    placeholder="e.g. Accounts Lead"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <IndianPhoneInput
                    label="Payment Mobile Number"
                    required={false}
                    value={formData.paymentPhone}
                    onChange={(val) => {
                      setFormData({ ...formData, paymentPhone: val });
                      if (errors.paymentPhone) setErrors({ ...errors, paymentPhone: '' });
                    }}
                    error={errors.paymentPhone}
                    placeholder="98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Contract Contact */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Contract Contact
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Contact Person</label>
                  <input
                    type="text"
                    value={formData.contractContactPerson}
                    onChange={e => setFormData({ ...formData, contractContactPerson: e.target.value })}
                    placeholder="e.g. Legal Counsel"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <IndianPhoneInput
                    label="Contract Mobile Number"
                    required={false}
                    value={formData.contractPhone}
                    onChange={(val) => {
                      setFormData({ ...formData, contractPhone: val });
                      if (errors.contractPhone) setErrors({ ...errors, contractPhone: '' });
                    }}
                    error={errors.contractPhone}
                    placeholder="98765 43210"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving Sponsor...' : 'Save Sponsor'}
        </button>
      </div>
    </form>
  );
};

export default SponsorForm;
