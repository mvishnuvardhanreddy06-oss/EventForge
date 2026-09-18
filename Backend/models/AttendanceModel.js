const mongoose = require('mongoose');
const { ATTENDANCE_METHOD } = require('../utils/constants');

const attendanceSchema = new mongoose.Schema({
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
  checkedInAt: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: Object.values(ATTENDANCE_METHOD),
    default: ATTENDANCE_METHOD.QR
  },
  checkedInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate check-in for the same event & session
attendanceSchema.index({ eventId: 1, sessionId: 1, attendeeId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
