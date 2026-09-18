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
  updateStatus: (id, status) => api.patch(`/events/${id}/status`, { status })
};

export const venueService = {
  getAll: (params) => api.get('/venues', { params }),
  getById: (id) => api.get(`/venues/${id}`),
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
  uploadMaterial: (id, material) => api.post(`/sessions/${id}/materials`, material)
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
  updateDeliverable: (id, deliverableId, status) => api.patch(`/sponsorships/${id}/deliverable/${deliverableId}`, { status })
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
  getPlatformStats: () => api.get('/analytics/platform')
};

export const aiService = {
  generate: (data) => api.post('/ai/generate', data),
  getRecommendations: (eventId) => api.get(`/ai/recommendations/${eventId}`),
  updateInterests: (interests) => api.post('/ai/attendee/interests', { interests })
};
