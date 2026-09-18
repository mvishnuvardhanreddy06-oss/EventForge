const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: [true, 'Organization contact email is required'],
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  subscriptionPlan: {
    type: String,
    enum: ['Free', 'Starter', 'Pro', 'Enterprise'],
    default: 'Pro'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'past_due'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Organization', organizationSchema);
