const mongoose = require('mongoose');
const { REGISTRATION_STATUS } = require('../utils/constants');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: Object.values(REGISTRATION_STATUS),
    default: REGISTRATION_STATUS.CONFIRMED
  },
  paymentStatus: {
    type: String,
    enum: ['free', 'pending', 'paid', 'refunded'],
    default: 'paid'
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null
  },
  finalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  qrToken: {
    type: String,
    required: true,
    unique: true
  },
  qrCodeUrl: {
    type: String,
    default: ''
  },
  selectedSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }],
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date,
    default: null
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

registrationSchema.index({ eventId: 1, attendeeId: 1 });
registrationSchema.index({ eventId: 1, status: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
