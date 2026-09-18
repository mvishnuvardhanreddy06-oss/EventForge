/**
 * Algorithmic Hybrid Recommendation Engine
 * Computes match score based on attendee interest overlaps, category match, tags,
 * and excludes sessions already attended or conflicting in time.
 */

const scoreSession = (session, interests = [], userRegisteredSessionIds = new Set(), userSessionTimes = []) => {
  if (userRegisteredSessionIds.has(session._id.toString())) {
    return null;
  }

  // Check if session has already ended
  if (session.endTime && new Date(session.endTime) < new Date()) {
    return null;
  }

  // Check schedule conflict with currently registered sessions
  const sStart = new Date(session.startTime);
  const sEnd = new Date(session.endTime);
  for (const timeSlot of userSessionTimes) {
    if (sStart < timeSlot.end && sEnd > timeSlot.start) {
      return null; // Overlap conflict!
    }
  }

  let score = 50; // base score
  const matchedFactors = [];

  const normalizedInterests = interests.map(i => i.toLowerCase().trim());

  // Category match
  if (session.category && normalizedInterests.some(i => session.category.toLowerCase().includes(i) || i.includes(session.category.toLowerCase()))) {
    score += 25;
    matchedFactors.push(`aligns with your interest in ${session.category}`);
  }

  // Tags match
  if (Array.isArray(session.tags)) {
    for (const tag of session.tags) {
      if (normalizedInterests.includes(tag.toLowerCase())) {
        score += 10;
        matchedFactors.push(`matches tag #${tag}`);
      }
    }
  }

  // Capacity or popularity bonus
  if (session.capacity && session.capacity > 0) {
    score += 5;
  }

  score = Math.min(score, 98);

  let reason = matchedFactors.length > 0
    ? `Recommended because it ${matchedFactors.slice(0, 2).join(' and ')}.`
    : `Trending session in ${session.category || 'General'} track.`;

  return {
    session,
    matchScore: score,
    reason
  };
};

const computeRecommendations = (availableSessions, attendeeInterests = [], registeredSessions = []) => {
  const registeredIds = new Set(registeredSessions.map(s => s._id ? s._id.toString() : s.toString()));
  const registeredTimes = registeredSessions
    .filter(s => s.startTime && s.endTime)
    .map(s => ({ start: new Date(s.startTime), end: new Date(s.endTime) }));

  const recommendations = [];

  for (const session of availableSessions) {
    const scored = scoreSession(session, attendeeInterests, registeredIds, registeredTimes);
    if (scored && scored.matchScore >= 55) {
      recommendations.push(scored);
    }
  }

  // Sort by match score descending
  recommendations.sort((a, b) => b.matchScore - a.matchScore);
  return recommendations;
};

module.exports = {
  computeRecommendations,
  scoreSession
};
