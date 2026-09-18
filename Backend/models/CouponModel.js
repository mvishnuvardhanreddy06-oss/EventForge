const mongoose = require('mongoose');
const { COUPON_DISCOUNT_TYPE } = require('../utils/constants');

const couponSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: Object.values(COUPON_DISCOUNT_TYPE),
    default: COUPON_DISCOUNT_TYPE.PERCENTAGE
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: 1
  },
  maxUses: {
    type: Number,
    default: 100,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Coupon expiry date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

couponSchema.index({ eventId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Coupon', couponSchema);
