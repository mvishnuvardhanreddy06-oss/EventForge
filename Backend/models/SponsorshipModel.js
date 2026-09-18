const mongoose = require('mongoose');
const { DELIVERABLE_STATUS } = require('../utils/constants');

const deliverableSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: Object.values(DELIVERABLE_STATUS),
    default: DELIVERABLE_STATUS.PENDING
  },
  completedAt: { type: Date, default: null }
});

const sponsorshipSchema = new mongoose.Schema({
  sponsorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsor',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SponsorshipPackage',
    required: true
  },
  deliverables: [deliverableSchema],
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'pending', 'paid', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
