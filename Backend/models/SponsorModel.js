const mongoose = require('mongoose');

const brandAssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileUrl: { type: String, required: true },
  assetType: { type: String, default: 'logo' },
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
  contactPerson: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
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
  brandAssets: [brandAssetSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Sponsor', sponsorSchema);
