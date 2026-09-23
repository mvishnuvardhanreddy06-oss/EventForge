const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'submitted', 'approved', 'changes_requested', 'completed', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  fileUrl: { type: String, default: '' },
  fileName: { type: String, default: '' },
  fileSize: { type: String, default: '' },
  fileType: { type: String, default: '' },
  feedback: { type: String, default: '' },
  submittedAt: { type: Date, default: null },
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
    default: 'paid'
  },
  contractStatus: {
    type: String,
    enum: ['draft', 'active', 'completed', 'terminated'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 86400000)
  },
  totalAmount: {
    type: Number,
    default: 500000
  },
  paidAmount: {
    type: Number,
    default: 500000
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

sponsorshipSchema.index({ sponsorId: 1 });
sponsorshipSchema.index({ eventId: 1 });

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
