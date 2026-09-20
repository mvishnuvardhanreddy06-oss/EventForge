import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Users,
  Layers,
  Phone,
  Mail,
  Globe,
  Check,
  Calendar,
  Wrench,
  PauseCircle,
  Edit2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import VenueStatusBadge from './VenueStatusBadge';
import VenueAvailabilityCalendar from './VenueAvailabilityCalendar';
import VenueBookingList from './VenueBookingList';

const DEFAULT_VENUE_IMAGE = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop';

const VenueDetailsDrawer = ({
  isOpen,
  onClose,
  venue,
  onEdit,
  onToggleMaintenance,
  onDeactivate
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'calendar' | 'bookings'

  if (!isOpen || !venue) return null;

  const images = (venue.images && venue.images.length > 0)
    ? venue.images
    : [DEFAULT_VENUE_IMAGE];

  const currentImage = images[activeImageIndex] || images[0];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-100/80 text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900 truncate">
                  {venue.name}
                </h3>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs text-slate-500 font-medium">
                    {venue.type}
                  </span>
                  <span className="text-slate-300">•</span>
                  <VenueStatusBadge status={venue.status} size="xs" />
                </div>
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

          {/* Tab Navigation */}
          <div className="px-6 bg-white border-b border-slate-100 flex items-center space-x-4 shrink-0 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Facilities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`py-3 border-b-2 transition-all ${
                activeTab === 'calendar'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Availability Calendar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`py-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'bookings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Upcoming Bookings</span>
              {venue.upcomingBookings?.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
                  {venue.upcomingBookings.length}
                </span>
              )}
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
            {activeTab === 'overview' && (
              <>
                {/* Photo Gallery Carousel */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 group">
                  <img
                    src={currentImage}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_VENUE_IMAGE;
                    }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-y-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white text-[10px]">
                        <span>{activeImageIndex + 1}</span>
                        <span>/</span>
                        <span>{images.length}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Max Capacity</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {Number(venue.capacity).toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-400">Attendees</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Rooms / Halls</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {venue.rooms?.length || venue.roomCount || 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Configurations</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Current State</p>
                    <p className="text-sm font-black text-slate-900 mt-1 capitalize">
                      {venue.status}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {venue.description && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      About Venue
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                      {venue.description}
                    </p>
                  </div>
                )}

                {/* Location Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Location & Address</span>
                  </h4>
                  <p className="text-xs text-slate-800 font-semibold">
                    {venue.address}
                  </p>
                  <p className="text-xs text-slate-500">
                    {venue.city}, {venue.state} {venue.postalCode} • {venue.country}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Contact Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Coordinator</p>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {venue.contactPerson || 'Venue Management Desk'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                      <p className="font-semibold text-blue-600 mt-0.5 truncate">
                        {venue.contactEmail || 'desk@eventvenue.com'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {venue.contactPhone || '+91 40 6682 4422'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Official Website</p>
                      {venue.website ? (
                        <a
                          href={venue.website}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-blue-600 hover:underline mt-0.5 flex items-center space-x-1 truncate"
                        >
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">{venue.website}</span>
                        </a>
                      ) : (
                        <p className="text-slate-400 mt-0.5">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Facilities List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Available Facilities ({venue.facilities?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(venue.facilities || []).map((fac, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-800"
                      >
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="truncate">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-4">
                <VenueAvailabilityCalendar venue={venue} />
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <VenueBookingList
                  bookings={venue.upcomingBookings}
                  venueName={venue.name}
                  onViewEvent={() => {
                    onClose();
                  }}
                />
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(venue)}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Venue</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onToggleMaintenance(venue)}
                className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center space-x-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>
                  {venue.status === 'maintenance' ? 'Exit Maintenance' : 'Set Maintenance'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onDeactivate(venue)}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center space-x-1.5"
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Deactivate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsDrawer;
