const mongoose = require('mongoose');

const sponsorshipPackageSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Package name is required (e.g. Platinum, Gold, Silver)'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  benefits: [{
    type: String,
    trim: true
  }],
  availableSlots: {
    type: Number,
    default: 5,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'sold_out', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SponsorshipPackage', sponsorshipPackageSchema);
