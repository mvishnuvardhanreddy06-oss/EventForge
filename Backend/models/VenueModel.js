const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  floor: {
    type: String,
    default: 'Ground'
  },
  facilities: [{
    type: String,
    trim: true
  }]
});

const venueSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  name: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Total venue capacity is required'],
    min: 1
  },
  rooms: [roomSchema],
  facilities: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Venue', venueSchema);
