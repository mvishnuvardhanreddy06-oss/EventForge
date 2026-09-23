const mongoose = require('mongoose');

const brandAssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileUrl: { type: String, required: true },
  assetType: {
    type: String,
    enum: ['logo', 'guidelines', 'banner', 'brochure', 'promotional_image', 'video'],
    default: 'logo'
  },
  fileSize: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now }
});

const sponsorSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  companyType: {
    type: String,
    default: 'Technology & Enterprise Solutions'
  },
  industry: {
    type: String,
    default: 'Cloud & AI Infrastructure'
  },
  contactPerson: {
    type: String,
    default: ''
  },
  contactTitle: {
    type: String,
    default: 'Director of Strategic Partnerships'
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  address: {
    type: String,
    default: 'Tech Horizon Tower, Level 8'
  },
  city: {
    type: String,
    default: 'Bengaluru'
  },
  state: {
    type: String,
    default: 'Karnataka'
  },
  country: {
    type: String,
    default: 'India'
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  shortDescription: {
    type: String,
    default: 'Pioneering scalable enterprise cloud, AI, and distributed system solutions.'
  },
  fullDescription: {
    type: String,
    default: 'Delivering next-generation cloud architectures, enterprise analytics, and AI acceleration for global businesses.'
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SponsorshipPackage',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'rejected'],
    default: 'pending'
  },
  brandAssets: [brandAssetSchema],
  settings: {
    emailNotifications: { type: Boolean, default: true },
    sponsorshipUpdates: { type: Boolean, default: true },
    deliverableReminders: { type: Boolean, default: true },
    paymentReminders: { type: Boolean, default: true },
    organizerMessages: { type: Boolean, default: true },
    eventAnnouncements: { type: Boolean, default: true },
    scheduleChanges: { type: Boolean, default: true },
    browserNotifications: { type: Boolean, default: true },
    profileVisibility: {
      type: String,
      enum: ['public', 'event_attendees_only', 'organizers_only'],
      default: 'public'
    },
    profileDiscovery: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

sponsorSchema.index({ organizationId: 1 });
sponsorSchema.index({ eventId: 1 });
sponsorSchema.index({ userId: 1 });

module.exports = mongoose.model('Sponsor', sponsorSchema);
