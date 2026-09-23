const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Speaker name is required'],
    trim: true
  },
  designation: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  shortBio: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: 'India'
  },
  yearsExperience: {
    type: Number,
    default: 5
  },
  industry: {
    type: String,
    default: 'Technology & Software'
  },
  expertise: [{
    type: String,
    trim: true
  }],
  preferredSessionTypes: [{
    type: String,
    trim: true
  }],
  socialLinks: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  availability: [{
    date: { type: Date, required: true },
    available: { type: Boolean, default: true },
    notes: { type: String, default: '' }
  }],
  weeklyAvailability: [{
    day: { type: String, required: true },
    available: { type: Boolean, default: true },
    startTime: { type: String, default: '09:00 AM' },
    endTime: { type: String, default: '06:00 PM' }
  }],
  settings: {
    emailNotifications: { type: Boolean, default: true },
    sessionUpdates: { type: Boolean, default: true },
    organizerMessages: { type: Boolean, default: true },
    presentationReminders: { type: Boolean, default: true },
    eventAnnouncements: { type: Boolean, default: true },
    scheduleChanges: { type: Boolean, default: true },
    browserNotifications: { type: Boolean, default: true },
    profileVisibility: { type: String, enum: ['public', 'attendees_only', 'organizers_only'], default: 'public' },
    profileDiscovery: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Speaker', speakerSchema);
