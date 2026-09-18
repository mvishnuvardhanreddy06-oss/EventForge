const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Ticket name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Total ticket quantity is required'],
    min: 1
  },
  sold: {
    type: Number,
    default: 0,
    min: 0
  },
  remaining: {
    type: Number,
    default: function () {
      return this.quantity;
    }
  },
  saleStart: {
    type: Date,
    default: Date.now
  },
  saleEnd: {
    type: Date,
    required: [true, 'Sale end date is required']
  },
  benefits: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'sold_out', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

ticketSchema.pre('save', function (next) {
  if (this.isModified('quantity') || this.isModified('sold')) {
    this.remaining = Math.max(0, this.quantity - this.sold);
    if (this.remaining === 0) {
      this.status = 'sold_out';
    }
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
