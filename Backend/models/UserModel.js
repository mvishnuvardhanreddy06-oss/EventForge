const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.ATTENDEE
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null
  },
  profileImage: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  interests: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    default: 'Hyderabad, India'
  },
  language: {
    type: String,
    default: 'English (India)'
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata (IST +5:30)'
  },
  settings: {
    emailNotifications: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true },
    registrationUpdates: { type: Boolean, default: true },
    paymentUpdates: { type: Boolean, default: true },
    scheduleChanges: { type: Boolean, default: true },
    organizerAnnouncements: { type: Boolean, default: true },
    sessionReminders: { type: Boolean, default: true },
    browserNotifications: { type: Boolean, default: true },
    profileVisibility: {
      type: String,
      enum: ['public', 'registered_events_only', 'private'],
      default: 'registered_events_only'
    },
    profileDiscovery: { type: Boolean, default: true }
  },
  personalSchedule: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }],
  assignedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
