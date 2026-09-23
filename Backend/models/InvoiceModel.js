const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  sponsorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsor',
    required: true
  },
  sponsorshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsorship',
    default: null
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SponsorshipPackage',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['Wire Transfer', 'Corporate Credit Card', 'ACH Transfer', 'Net Banking', 'Cheque'],
    default: 'Wire Transfer'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

invoiceSchema.index({ sponsorId: 1, status: 1 });
invoiceSchema.index({ eventId: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
