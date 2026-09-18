const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  STAFF: 'staff',
  SPEAKER: 'speaker',
  ATTENDEE: 'attendee',
  SPONSOR: 'sponsor'
};

const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const REGISTRATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CONFIRMED: 'confirmed',
  WAITLISTED: 'waitlisted',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

const ATTENDANCE_METHOD = {
  QR: 'qr',
  MANUAL: 'manual'
};

const ANNOUNCEMENT_TYPES = {
  GENERAL: 'general',
  URGENT: 'urgent',
  SESSION: 'session',
  VENUE: 'venue',
  REGISTRATION: 'registration'
};

const COUPON_DISCOUNT_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
};

const DELIVERABLE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

module.exports = {
  ROLES,
  EVENT_STATUS,
  REGISTRATION_STATUS,
  ATTENDANCE_METHOD,
  ANNOUNCEMENT_TYPES,
  COUPON_DISCOUNT_TYPE,
  DELIVERABLE_STATUS
};
