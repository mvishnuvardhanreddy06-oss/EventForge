const mongoose = require('mongoose');
const { ANNOUNCEMENT_TYPES } = require('../utils/constants');

const announcementSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message content is required']
  },
  type: {
    type: String,
    enum: Object.values(ANNOUNCEMENT_TYPES),
    default: ANNOUNCEMENT_TYPES.GENERAL
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

announcementSchema.index({ eventId: 1, publishedAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
