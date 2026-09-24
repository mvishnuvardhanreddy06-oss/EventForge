import api from './axios';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUsers: (params) => api.get('/auth/users', { params }),
  toggleUserStatus: (id) => api.patch(`/auth/users/${id}/status`)
};

export const organizationService = {
  getAll: () => api.get('/organizations'),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  toggleStatus: (id) => api.patch(`/organizations/${id}/status`)
};

export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  togglePublish: (id) => api.patch(`/events/${id}/publish`),
  updateStatus: (id, status) => api.patch(`/events/${id}/status`, { status }),
  getAssignedStaff: (id) => api.get(`/events/${id}/staff`),
  assignStaff: (id, staffId) => api.post(`/events/${id}/staff`, { staffId }),
  removeStaff: (id, staffId) => api.delete(`/events/${id}/staff/${staffId}`)
};

export const venueService = {
  getAll: (params) => api.get('/venues', { params }),
  getById: (id) => api.get(`/venues/${id}`),
  checkAvailability: (id, params) => api.get(`/venues/${id}/check-availability`, { params }),
  getAllConflicts: () => api.get('/venues/conflicts/all'),
  getBookings: (id) => api.get(`/venues/${id}/bookings`),
  create: (data) => api.post('/venues', data),
  update: (id, data) => api.put(`/venues/${id}`, data),
  delete: (id) => api.delete(`/venues/${id}`),
  addRoom: (id, roomData) => api.post(`/venues/${id}/rooms`, roomData)
};

export const sessionService = {
  getAll: (params) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
  uploadMaterial: (id, material) => api.post(`/sessions/${id}/materials`, material),
  reviewMaterial: (sessionId, materialId, data) => api.patch(`/sessions/${sessionId}/materials/${materialId}/review`, data)
};

export const speakerService = {
  getAll: (params) => api.get('/speakers', { params }),
  getById: (id) => api.get(`/speakers/${id}`),
  create: (data) => api.post('/speakers', data),
  update: (id, data) => api.put(`/speakers/${id}`, data),
  updateAvailability: (id, availability) => api.put(`/speakers/${id}/availability`, { availability })
};

export const sponsorService = {
  getAll: (params) => api.get('/sponsors', { params }),
  getById: (id) => api.get(`/sponsors/${id}`),
  create: (data) => api.post('/sponsors', data),
  update: (id, data) => api.put(`/sponsors/${id}`, data),
  uploadAsset: (id, asset) => api.post(`/sponsors/${id}/assets`, asset)
};

export const sponsorshipService = {
  getPackages: (params) => api.get('/sponsorships/packages', { params }),
  createPackage: (data) => api.post('/sponsorships/packages', data),
  getAll: (params) => api.get('/sponsorships', { params }),
  assignPackage: (data) => api.post('/sponsorships', data),
  updateDeliverable: (id, deliverableId, status) => api.patch(`/sponsorships/${id}/deliverable/${deliverableId}`, { status }),
  reviewDeliverable: (sponsorshipId, deliverableId, data) => api.patch(`/sponsors/deliverables/${sponsorshipId}/${deliverableId}/review`, data)
};

export const ticketService = {
  getByEvent: (eventId) => api.get('/tickets', { params: { eventId } }),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`)
};

export const registrationService = {
  getAll: (params) => api.get('/registrations', { params }),
  getById: (id) => api.get(`/registrations/${id}`),
  register: (data) => api.post('/registrations', data),
  cancel: (id) => api.patch(`/registrations/${id}/cancel`),
  approve: (id) => api.patch(`/registrations/${id}/approve`),
  getTicket: (id) => api.get(`/registrations/${id}/ticket`)
};

export const attendanceService = {
  scanQR: (data) => api.post('/attendance/scan', data),
  recordSessionAttendance: (data) => api.post('/attendance/session', data),
  unmarkSessionAttendance: (sessionId, attendeeId) => api.delete(`/attendance/session/${sessionId}/${attendeeId}`),
  getEventAttendance: (eventId) => api.get(`/attendance/event/${eventId}`),
  getSessionAttendance: (sessionId) => api.get(`/attendance/session/${sessionId}`),
  getMyHistory: () => api.get('/attendance/history')
};

export const announcementService = {
  getByEvent: (eventId) => api.get('/announcements', { params: { eventId } }),
  create: (data) => api.post('/announcements', data),
  delete: (id) => api.delete(`/announcements/${id}`)
};

export const couponService = {
  getByEvent: (eventId) => api.get('/coupons', { params: { eventId } }),
  create: (data) => api.post('/coupons', data),
  validate: (data) => api.post('/coupons/validate', data),
  delete: (id) => api.delete(`/coupons/${id}`)
};

export const feedbackService = {
  getByEvent: (params) => api.get('/feedback', { params }),
  submit: (data) => api.post('/feedback', data),
  getStats: (eventId) => api.get(`/feedback/stats/${eventId}`)
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all')
};

export const analyticsService = {
  getOrganizerStats: (eventId) => api.get(`/analytics/organizer/${eventId}`),
  getOrganizerDashboard: () => api.get('/analytics/organizer/dashboard'),
  getPlatformStats: () => api.get('/analytics/platform')
};

export const aiService = {
  generate: (data) => api.post('/ai/generate', data),
  getRecommendations: (eventId) => api.get(`/ai/recommendations/${eventId}`),
  updateInterests: (interests) => api.post('/ai/attendee/interests', { interests })
};

export const speakerPortalService = {
  getDashboard: () => api.get('/speakers/me/dashboard'),
  getEvents: (params) => api.get('/speakers/me/events', { params }),
  getEventDetails: (id) => api.get(`/speakers/me/events/${id}`),
  getSessions: (params) => api.get('/speakers/me/sessions', { params }),
  getSessionDetails: (id) => api.get(`/speakers/me/sessions/${id}`),
  confirmSession: (id) => api.post(`/speakers/me/sessions/${id}/confirm`),
  getMaterials: () => api.get('/speakers/me/materials'),
  uploadMaterial: (formData) => api.post('/speakers/me/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMaterial: (sessionId, materialId) => api.delete(`/speakers/me/materials/${sessionId}/${materialId}`),
  getAvailability: () => api.get('/speakers/me/availability'),
  updateAvailability: (data) => api.put('/speakers/me/availability', data),
  getProfile: () => api.get('/speakers/me/profile'),
  updateProfile: (data) => api.put('/speakers/me/profile', data),
  getAnnouncements: (params) => api.get('/speakers/me/announcements', { params }),
  markAnnouncementRead: (id) => api.post(`/speakers/me/announcements/${id}/read`),
  getSettings: () => api.get('/speakers/me/settings'),
  updateSettings: (data) => api.put('/speakers/me/settings', data),
  changePassword: (data) => api.put('/speakers/me/password', data),
  deleteAccount: (data) => api.delete('/speakers/me/account', { data })
};

export const sponsorPortalService = {
  getDashboard: () => api.get('/sponsors/me/dashboard'),
  getEvents: (params) => api.get('/sponsors/me/events', { params }),
  getEventDetails: (id) => api.get(`/sponsors/me/events/${id}`),
  getSponsorships: (params) => api.get('/sponsors/me/sponsorships', { params }),
  getSponsorshipDetails: (id) => api.get(`/sponsors/me/sponsorships/${id}`),
  getDeliverables: (params) => api.get('/sponsors/me/deliverables', { params }),
  uploadDeliverable: (sponsorshipId, deliverableId, formData) => api.post(`/sponsors/me/deliverables/${sponsorshipId}/${deliverableId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getProfile: () => api.get('/sponsors/me/profile'),
  updateProfile: (data) => api.put('/sponsors/me/profile', data),
  getInvoices: (params) => api.get('/sponsors/me/invoices', { params }),
  getInvoiceDetails: (id) => api.get(`/sponsors/me/invoices/${id}`),
  payInvoice: (id, data) => api.post(`/sponsors/me/invoices/${id}/pay`, data),
  getAnnouncements: (params) => api.get('/sponsors/me/announcements', { params }),
  markAnnouncementRead: (id) => api.post(`/sponsors/me/announcements/${id}/read`),
  getSettings: () => api.get('/sponsors/me/settings'),
  updateSettings: (data) => api.put('/sponsors/me/settings', data),
  changePassword: (data) => api.put('/sponsors/me/password', data),
  deleteAccount: (data) => api.delete('/sponsors/me/account', { data })
};

export const attendeePortalService = {
  getDashboard: () => api.get('/attendee/dashboard'),
  getEvents: (params) => api.get('/attendee/events', { params }),
  getEventDetails: (id) => api.get(`/attendee/events/${id}`),
  registerForEvent: (id, data) => api.post(`/attendee/events/${id}/register`, data),
  getRegistrations: (params) => api.get('/attendee/registrations', { params }),
  getRegistrationDetails: (id) => api.get(`/attendee/registrations/${id}`),
  cancelRegistration: (id, data) => api.patch(`/attendee/registrations/${id}/cancel`, data),
  getTickets: (params) => api.get('/attendee/tickets', { params }),
  getTicketPass: (registrationId) => api.get(`/attendee/tickets/${registrationId}`),
  getSchedule: (params) => api.get('/attendee/schedule', { params }),
  addToSchedule: (sessionId) => api.post('/attendee/schedule/add', { sessionId }),
  removeFromSchedule: (sessionId) => api.post('/attendee/schedule/remove', { sessionId }),
  getSessions: (params) => api.get('/attendee/sessions', { params }),
  getNotifications: (params) => api.get('/attendee/notifications', { params }),
  markNotificationRead: (id) => api.patch(`/attendee/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/attendee/notifications/read-all'),
  getAvailableFeedback: () => api.get('/attendee/feedback/available'),
  submitFeedback: (data) => api.post('/attendee/feedback', data),
  getSettings: () => api.get('/attendee/settings'),
  updateSettings: (data) => api.put('/attendee/settings', data),
  changePassword: (data) => api.put('/attendee/password', data),
  deleteAccount: (data) => api.delete('/attendee/account', { data })
};

export const auditLogService = {
  getAll: (params) => api.get('/audit-logs', { params }),
  export: (params) => api.get('/audit-logs/export', { params })
};

export const subscriptionService = {
  getPlans: () => api.get('/subscriptions/plans'),
  createPlan: (data) => api.post('/subscriptions/plans', data),
  updatePlan: (id, data) => api.put(`/subscriptions/plans/${id}`, data),
  getOrganizations: () => api.get('/subscriptions/organizations'),
};
