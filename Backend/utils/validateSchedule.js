/**
 * Conflict Detection Utility for EventForge Sessions
 * Validates that no overlapping sessions occur for:
 * 1. The same room in a venue
 * 2. The same speaker
 */

const checkRoomConflict = async (SessionModel, { eventId, venueId, roomId, startTime, endTime, excludeSessionId = null }) => {
  if (!roomId || !startTime || !endTime) return false;
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const query = {
    roomId,
    status: { $ne: 'cancelled' },
    startTime: { $lt: end },
    endTime: { $gt: start }
  };

  if (excludeSessionId) {
    query._id = { $ne: excludeSessionId };
  }

  const conflict = await SessionModel.findOne(query).populate('speakerId', 'name');
  return conflict;
};

const checkSpeakerConflict = async (SessionModel, { speakerId, startTime, endTime, excludeSessionId = null }) => {
  if (!speakerId || !startTime || !endTime) return false;

  const start = new Date(startTime);
  const end = new Date(endTime);

  const query = {
    speakerId,
    status: { $ne: 'cancelled' },
    startTime: { $lt: end },
    endTime: { $gt: start }
  };

  if (excludeSessionId) {
    query._id = { $ne: excludeSessionId };
  }

  const conflict = await SessionModel.findOne(query);
  return conflict;
};

const checkVenueConflict = async (EventModel, { venueId, startDate, endDate, excludeEventId = null }) => {
  if (!venueId || !startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const query = {
    venueId,
    status: { $in: ['published', 'ongoing'] },
    startDate: { $lt: end },
    endDate: { $gt: start }
  };

  if (excludeEventId) {
    query._id = { $ne: excludeEventId };
  }

  const conflict = await EventModel.findOne(query).populate('venueId', 'name city address');
  return conflict;
};

module.exports = {
  checkRoomConflict,
  checkSpeakerConflict,
  checkVenueConflict
};
