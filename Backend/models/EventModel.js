const mongoose = require('mongoose');
const { EVENT_STATUS } = require('../utils/constants');

const eventSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  eventType: {
    type: String,
    enum: ['Conference', 'Workshop', 'Exhibition', 'Seminar', 'Networking', 'Tech', 'Corporate Meeting'],
    default: 'Conference'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  bannerImage: {
    type: String,
    default: ''
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    default: null
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  registrationStart: {
    type: Date,
    default: Date.now
  },
  registrationEnd: {
    type: Date,
    required: [true, 'Registration end date is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  registrationRequired: {
    type: Boolean,
    default: true
  },
  approvalRequired: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: Object.values(EVENT_STATUS),
    default: EVENT_STATUS.DRAFT
  },
  tags: [{
    type: String,
    trim: true
  }],
  assignedStaff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

eventSchema.index({ organizationId: 1, status: 1 });
eventSchema.index({ organizerId: 1 });
eventSchema.index({ title: 'text', description: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);
