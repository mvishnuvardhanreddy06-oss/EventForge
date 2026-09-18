const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  fileType: { type: String, default: 'pdf' },
  uploadedAt: { type: Date, default: Date.now }
});

const sessionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    default: null
  },
  roomId: {
    type: String,
    default: null
  },
  roomName: {
    type: String,
    default: ''
  },
  speakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speaker',
    default: null
  },
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Keynote'
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  capacity: {
    type: Number,
    default: 100
  },
  tags: [{
    type: String,
    trim: true
  }],
  materials: [materialSchema],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

sessionSchema.index({ eventId: 1, startTime: 1, endTime: 1 });
sessionSchema.index({ roomId: 1, startTime: 1, endTime: 1 });
sessionSchema.index({ speakerId: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Session', sessionSchema);
