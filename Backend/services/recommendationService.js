const SessionModel = require('../models/SessionModel');
const RegistrationModel = require('../models/RegistrationModel');
const AttendanceModel = require('../models/AttendanceModel');
const UserModel = require('../models/UserModel');
const { computeRecommendations } = require('../utils/recommendationEngine');

const getPersonalizedRecommendations = async (userId, eventId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User not found');

  // Find user's registrations and sessions for this event
  const registrations = await RegistrationModel.find({
    attendeeId: userId,
    status: { $in: ['confirmed', 'approved'] }
  }).populate('selectedSessions');

  let userRegisteredSessions = [];
  for (const reg of registrations) {
    if (Array.isArray(reg.selectedSessions)) {
      userRegisteredSessions.push(...reg.selectedSessions);
    }
  }

  // Find user's past attendances
  const attendances = await AttendanceModel.find({
    attendeeId: userId,
    sessionId: { $ne: null }
  }).populate('sessionId');

  const attendedSessions = attendances
    .map(a => a.sessionId)
    .filter(Boolean);

  // Combine registered and attended sessions for conflict check and deduplication
  const allOccupiedSessions = [...userRegisteredSessions, ...attendedSessions];

  // Find all active sessions for the target event
  const query = {
    status: { $ne: 'cancelled' }
  };
  if (eventId) {
    query.eventId = eventId;
  }

  const availableSessions = await SessionModel.find(query)
    .populate('speakerId', 'name designation company profileImage')
    .populate('venueId', 'name city');

  // Compute recommendations using hybrid engine
  const recommendations = computeRecommendations(
    availableSessions,
    user.interests || [],
    allOccupiedSessions
  );

  return recommendations;
};

module.exports = {
  getPersonalizedRecommendations
};
