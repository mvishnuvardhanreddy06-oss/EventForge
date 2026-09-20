import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Users, Phone, Mail, Globe, Check } from 'lucide-react';
import FacilitySelector from './FacilitySelector';
import VenueImageUpload from './VenueImageUpload';

const VENUE_TYPES = [
  'Convention Center',
  'Hotel',
  'Conference Hall',
  'Auditorium',
  'Outdoor',
  'Hybrid'
];

const INITIAL_FORM = {
  name: '',
  type: 'Convention Center',
  description: '',
  address: '',
  city: 'Hyderabad',
  state: 'Telangana',
  country: 'India',
  postalCode: '',
  capacity: 1000,
  rooms: 4,
  website: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  status: 'available',
  facilities: ['Wi-Fi', 'Parking', 'Catering', 'AV Equipment'],
  images: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'
  ]
};

const VenueFormModal = ({ isOpen, onClose, onSave, editVenue = null }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editVenue) {
      setFormData({
        name: editVenue.name || '',
        type: editVenue.type || 'Convention Center',
        description: editVenue.description || '',
        address: editVenue.address || '',
        city: editVenue.city || 'Hyderabad',
        state: editVenue.state || 'Telangana',
        country: editVenue.country || 'India',
        postalCode: editVenue.postalCode || '',
        capacity: editVenue.capacity || 1000,
        rooms: editVenue.rooms?.length || editVenue.roomCount || 4,
        website: editVenue.website || '',
        contactPerson: editVenue.contactPerson || '',
        contactEmail: editVenue.contactEmail || '',
        contactPhone: editVenue.contactPhone || '',
        status: editVenue.status || 'available',
        facilities: editVenue.facilities || ['Wi-Fi', 'Parking', 'Catering'],
        images: editVenue.images && editVenue.images.length > 0
          ? editVenue.images
          : [INITIAL_FORM.images[0]]
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [editVenue, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Venue name is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.country.trim()) errs.country = 'Country is required';
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be greater than 0';
    }
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errs.contactEmail = 'Invalid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(editVenue || {}),
      ...formData,
      capacity: Number(formData.capacity),
      roomCount: Number(formData.rooms) || 1,
      id: editVenue ? editVenue.id || editVenue._id : `venue-${Date.now()}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-100/80 text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editVenue ? 'Edit Venue' : 'Add New Venue'}
              </h2>
              <p className="text-xs text-slate-500">
                {editVenue
                  ? 'Update venue specifications, room capacity, and available facilities.'
                  : 'Register a new venue for your organization’s corporate events.'}
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

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* Section 1: Basic Information */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 text-blue-600">
              <span>01. Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hyderabad International Convention Centre"
                  className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 ${
                    errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Venue Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
                >
                  {VENUE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key highlights, architecture, VIP entrances, and campus overview..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Section 2: Location & Address */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 text-blue-600">
              <MapPin className="w-3.5 h-3.5" />
              <span>02. Location & Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Novotel & HICC Complex, HITEC City"
                  className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 ${
                    errors.address ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Hyderabad"
                  className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 ${
                    errors.city ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Telangana"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="e.g. 500081"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Capacity, Rooms & Status */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 text-blue-600">
              <Users className="w-3.5 h-3.5" />
              <span>03. Capacity & Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Venue Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g. 5000"
                  className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 ${
                    errors.capacity ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.capacity && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Rooms / Halls
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  placeholder="e.g. 12"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Venue Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer font-semibold"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Contact Information */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 text-blue-600">
              <Phone className="w-3.5 h-3.5" />
              <span>04. Contact & Coordinator Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Rajesh Verma (Operations Director)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="e.g. contact@hicc-events.in"
                  className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 ${
                    errors.contactEmail ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.contactEmail && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.contactEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="e.g. +91 40 6682 4422"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="e.g. https://www.hicc.com"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Facilities */}
          <div className="pt-2 border-t border-slate-100">
            <FacilitySelector
              selectedFacilities={formData.facilities}
              onChange={(facilities) => setFormData({ ...formData, facilities })}
            />
          </div>

          {/* Section 6: Images Upload */}
          <div className="pt-2 border-t border-slate-100">
            <VenueImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{editVenue ? 'Save Changes' : 'Save Venue'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueFormModal;
