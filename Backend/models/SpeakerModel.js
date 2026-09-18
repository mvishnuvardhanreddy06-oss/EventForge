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
  bio: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  expertise: [{
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
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Speaker', speakerSchema);
