const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'System' },
    email: { type: String, default: 'system@eventforge.io' },
    role: { type: String, default: 'SYSTEM' }
  },
  action: {
    type: String,
    required: true,
    enum: ['Created', 'Updated', 'Deleted', 'Logged In', 'Logged Out', 'Approved', 'Rejected', 'Checked In', 'Paid', 'Exported']
  },
  resource: {
    type: String,
    required: true // 'Event', 'Session', 'User', 'Organization', 'Sponsorship', 'Ticket', 'Registration', 'Deliverable'
  },
  resourceId: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  device: {
    type: String,
    default: 'Web App'
  },
  browser: {
    type: String,
    default: 'Chrome'
  },
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Warning'],
    default: 'Success'
  }
}, {
  timestamps: true
});

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ 'user.userId': 1 });
auditLogSchema.index({ resource: 1, action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
