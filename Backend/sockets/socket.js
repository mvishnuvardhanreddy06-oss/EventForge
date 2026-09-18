const { getIO } = require('../config/socket');

const emitToEvent = (eventId, eventName, payload) => {
  const io = getIO();
  if (io && eventId) {
    io.to(`event:${eventId}`).emit(eventName, payload);
  }
};

const emitToUser = (userId, eventName, payload) => {
  const io = getIO();
  if (io && userId) {
    io.to(`user:${userId}`).emit(eventName, payload);
  }
};

const emitToOrg = (orgId, eventName, payload) => {
  const io = getIO();
  if (io && orgId) {
    io.to(`org:${orgId}`).emit(eventName, payload);
  }
};

const emitCheckInUpdate = (eventId, checkInData) => {
  emitToEvent(eventId, 'checkin_update', checkInData);
};

const emitAttendanceUpdate = (eventId, attendanceData) => {
  emitToEvent(eventId, 'attendance_update', attendanceData);
};

const emitAnnouncement = (eventId, announcement) => {
  emitToEvent(eventId, 'announcement', announcement);
};

module.exports = {
  emitToEvent,
  emitToUser,
  emitToOrg,
  emitCheckInUpdate,
  emitAttendanceUpdate,
  emitAnnouncement
};
