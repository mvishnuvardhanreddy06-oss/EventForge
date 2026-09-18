const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    default: null
  },
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maximum rating is 5']
  },
  comment: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Compound index: prevent duplicate feedback from same attendee for same event & session
feedbackSchema.index({ eventId: 1, sessionId: 1, attendeeId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
