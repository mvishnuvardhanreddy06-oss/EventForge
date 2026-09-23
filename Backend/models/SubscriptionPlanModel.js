const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  billingPeriod: {
    type: String,
    enum: ['Monthly', 'Yearly'],
    default: 'Monthly'
  },
  features: [{
    type: String,
    trim: true
  }],
  limits: {
    maxUsers: { type: Number, default: 50 },
    maxEvents: { type: Number, default: 20 },
    storageGB: { type: Number, default: 50 }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
