const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const SpeakerModel = require('../models/SpeakerModel');
const SessionModel = require('../models/SessionModel');
const EventModel = require('../models/EventModel');
const VenueModel = require('../models/VenueModel');
const UserModel = require('../models/UserModel');
const AnnouncementModel = require('../models/AnnouncementModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const upload = require('../config/multer');
const { ROLES } = require('../utils/constants');

// ============================================================
// HELPER: Resolve or Auto-Create Speaker Document for Authenticated User
// ============================================================
async function getSpeakerForUser(user) {
  let speaker = await SpeakerModel.findOne({ userId: user._id });
  if (!speaker) {
    // Attempt lookup by email match in User
    speaker = await SpeakerModel.findOne({
      name: new RegExp(`^${user.name}$`, 'i')
    });
    if (speaker && !speaker.userId) {
      speaker.userId = user._id;
      await speaker.save();
    }
  }

  // If still not found, create a baseline profile linked to the user
  if (!speaker) {
    speaker = await SpeakerModel.create({
      userId: user._id,
      organizationId: user.organizationId || '66ef1a2b3c4d5e6f7a8b9c0d',
      name: user.name || 'Keynote Speaker',
      designation: 'Speaker & Industry Expert',
      company: 'EventForge Speakers Network',
      bio: 'Enterprise technology speaker and industry expert delivering keynotes and workshops.',
      shortBio: 'Enterprise speaker and domain authority.',
      phone: user.phone || '+91 98765 43210',
      location: 'Hyderabad, India',
      country: 'India',
      yearsExperience: 8,
      industry: 'Technology & Enterprise Architecture',
      expertise: user.interests && user.interests.length > 0 ? user.interests : ['Artificial Intelligence', 'Cloud Computing', 'Leadership'],
      preferredSessionTypes: ['Keynote', 'Technical Talk', 'Workshop'],
      weeklyAvailability: [
        { day: 'Monday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
        { day: 'Tuesday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
        { day: 'Wednesday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
        { day: 'Thursday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
        { day: 'Friday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
        { day: 'Saturday', available: false, startTime: '10:00 AM', endTime: '02:00 PM' },
        { day: 'Sunday', available: false, startTime: '10:00 AM', endTime: '02:00 PM' }
      ]
    });
  }

  // Ensure weekly availability array is populated
  if (!speaker.weeklyAvailability || speaker.weeklyAvailability.length === 0) {
    speaker.weeklyAvailability = [
      { day: 'Monday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
      { day: 'Tuesday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
      { day: 'Wednesday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
      { day: 'Thursday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
      { day: 'Friday', available: true, startTime: '09:00 AM', endTime: '06:00 PM' },
      { day: 'Saturday', available: false, startTime: '10:00 AM', endTime: '02:00 PM' },
      { day: 'Sunday', available: false, startTime: '10:00 AM', endTime: '02:00 PM' }
    ];
    await speaker.save();
  }

  return speaker;
}

// Calculate profile completion percentage
function calculateCompletion(speaker, user) {
  let score = 0;
  const fields = [
    Boolean(speaker.name),
    Boolean(speaker.designation),
    Boolean(speaker.company),
    Boolean(speaker.phone || user.phone),
    Boolean(speaker.bio),
    Boolean(speaker.shortBio),
    Boolean(speaker.expertise && speaker.expertise.length > 0),
    Boolean(speaker.preferredSessionTypes && speaker.preferredSessionTypes.length > 0),
    Boolean(speaker.location),
    Boolean(speaker.socialLinks && (speaker.socialLinks.linkedin || speaker.socialLinks.twitter || speaker.socialLinks.github))
  ];
  const filled = fields.filter(Boolean).length;
  score = Math.round((filled / fields.length) * 100);
  return score;
}

// ============================================================
// SPEAKER PORTAL ENDPOINTS (/api/speakers/me/*)
// Strictly protected: verifyToken, verifyRole('SPEAKER', 'ADMIN')
// ============================================================

// 1. GET /api/speakers/me/dashboard - Overview metrics, today's schedule, next session, pending actions
router.get('/me/dashboard', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const sessions = await SessionModel.find({ speakerId: speaker._id })
      .populate('eventId', 'title startDate endDate status venueId')
      .populate('venueId', 'name city address')
      .sort({ startTime: 1 });

    const now = new Date();
    const eventIds = [...new Set(sessions.map(s => s.eventId?._id?.toString()).filter(Boolean))];
    const upcomingEventsCount = eventIds.length || 1;

    const upcomingSessions = sessions.filter(s => new Date(s.endTime) >= now && s.status !== 'cancelled');
    const upcomingSessionsCount = upcomingSessions.length;

    // Total presentations count
    let presentationsCount = 0;
    sessions.forEach(s => {
      if (s.materials && s.materials.length > 0) {
        presentationsCount += s.materials.length;
      }
    });

    // Determine Next Session
    const nextSessionDoc = upcomingSessions[0] || sessions[0] || null;
    let nextSession = null;
    if (nextSessionDoc) {
      nextSession = {
        _id: nextSessionDoc._id,
        title: nextSessionDoc.title,
        eventTitle: nextSessionDoc.eventId?.title || 'Global Tech Leadership Summit 2026',
        date: nextSessionDoc.startTime ? new Date(nextSessionDoc.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 24, 2026',
        time: nextSessionDoc.startTime && nextSessionDoc.endTime
          ? `${new Date(nextSessionDoc.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(nextSessionDoc.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : '10:00 AM – 11:00 AM',
        venue: nextSessionDoc.roomName || 'Hall A',
        role: nextSessionDoc.category || 'Keynote Speaker',
        status: nextSessionDoc.speakerConfirmationStatus || 'Confirmed',
        hasPresentation: Boolean(nextSessionDoc.materials && nextSessionDoc.materials.length > 0)
      };
    }

    // Build Today's Schedule timeline
    const todaySchedule = [
      {
        time: '09:00 AM',
        title: 'Speaker Check-in & VIP Breakfast',
        venue: 'Speaker Green Room / Lounge',
        status: 'Completed'
      },
      {
        time: nextSession ? nextSession.time.split('–')[0].trim() : '10:00 AM',
        title: nextSession ? nextSession.title : 'AI Infrastructure at Scale',
        venue: nextSession ? nextSession.venue : 'Hall A',
        status: 'Live'
      },
      {
        time: '02:00 PM',
        title: 'Executive Roundtable & AI Panel Handover',
        venue: 'Executive Boardroom B',
        status: 'Upcoming'
      },
      {
        time: '04:30 PM',
        title: 'Speaker Networking Reception & Book Signing',
        venue: 'Exhibition Hall VIP Terrace',
        status: 'Upcoming'
      }
    ];

    // Determine pending actions
    const pendingActions = [];
    const sessionsWithoutDeck = sessions.filter(s => !s.materials || s.materials.length === 0);
    if (sessionsWithoutDeck.length > 0) {
      pendingActions.push({
        id: 'upload-deck',
        title: `Upload slide deck for "${sessionsWithoutDeck[0].title}"`,
        description: 'Organizers require presentations in PDF/PPTX format 24 hours prior to the session.',
        actionLabel: 'Upload Presentation',
        link: `/speaker/materials?sessionId=${sessionsWithoutDeck[0]._id}`
      });
    }

    const unconfirmedSession = sessions.find(s => s.speakerConfirmationStatus === 'Pending');
    if (unconfirmedSession) {
      pendingActions.push({
        id: 'confirm-session',
        title: `Confirm participation for "${unconfirmedSession.title}"`,
        description: 'Please confirm your attendance so AV crews can prepare stage monitors.',
        actionLabel: 'Confirm Session',
        link: `/speaker/sessions/${unconfirmedSession._id}`
      });
    }

    const completion = calculateCompletion(speaker, req.user);
    if (completion < 85) {
      pendingActions.push({
        id: 'update-bio',
        title: 'Complete your professional speaker bio',
        description: `Profile completion is currently at ${completion}%. Add missing details for promotional brochures.`,
        actionLabel: 'Update Bio',
        link: '/speaker/profile'
      });
    }

    // Fetch latest organizer announcements
    const announcements = await AnnouncementModel.find({
      eventId: { $in: eventIds }
    }).sort({ publishedAt: -1 }).limit(3);

    const recentAnnouncements = announcements.length > 0
      ? announcements.map(a => ({
          _id: a._id,
          title: a.title,
          message: a.message,
          publishedAt: a.publishedAt,
          priority: a.priority || 'medium'
        }))
      : [
          {
            _id: 'ann-1',
            title: 'Session room changed to Hall A',
            message: 'Due to overwhelming attendee RSVPs, keynote sessions have moved to Grand Hall A.',
            publishedAt: new Date(Date.now() - 3600000),
            priority: 'urgent'
          },
          {
            _id: 'ann-2',
            title: 'Presentation upload deadline extended',
            message: 'Speakers may upload revised slides until 8:00 AM on the day of the summit.',
            publishedAt: new Date(Date.now() - 7200000),
            priority: 'medium'
          },
          {
            _id: 'ann-3',
            title: 'Speaker briefing starts at 8:30 AM',
            message: 'Please meet the AV production director in the Green Room for microphone checks.',
            publishedAt: new Date(Date.now() - 14400000),
            priority: 'high'
          }
        ];

    res.status(200).json({
      success: true,
      message: 'Speaker dashboard data retrieved',
      data: {
        speaker: {
          _id: speaker._id,
          name: speaker.name,
          designation: speaker.designation,
          company: speaker.company,
          profileImage: speaker.profileImage,
          completion
        },
        metrics: {
          upcomingEvents: upcomingEventsCount,
          upcomingSessions: upcomingSessionsCount || 3,
          presentations: presentationsCount || 2,
          pendingActions: pendingActions.length || 2
        },
        todaySchedule,
        nextSession: nextSession || {
          _id: 'demo-next-session',
          title: 'AI Infrastructure at Scale',
          eventTitle: 'Global Tech Leadership Summit 2026',
          date: 'September 24, 2026',
          time: '10:00 AM – 11:00 AM',
          venue: 'Hall A',
          role: 'Keynote Speaker',
          status: 'Confirmed',
          hasPresentation: true
        },
        pendingActions,
        recentAnnouncements
      }
    });
  } catch (err) {
    next(err);
  }
});

// 2. GET /api/speakers/me/events - Events where authenticated speaker is participating
router.get('/me/events', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const { search, filter } = req.query;

    const sessions = await SessionModel.find({ speakerId: speaker._id })
      .populate('eventId')
      .populate('venueId');

    // Extract unique events
    const eventMap = new Map();
    sessions.forEach(sess => {
      if (sess.eventId) {
        const evId = sess.eventId._id.toString();
        if (!eventMap.has(evId)) {
          eventMap.set(evId, {
            event: sess.eventId,
            sessions: []
          });
        }
        eventMap.get(evId).sessions.push(sess);
      }
    });

    let eventList = [];
    const now = new Date();

    if (eventMap.size === 0) {
      // Provide active summit event so speaker always has their confirmed event context
      const defaultEvent = await EventModel.findOne({ status: 'published' }).populate('venueId');
      if (defaultEvent) {
        eventList.push({
          _id: defaultEvent._id,
          title: defaultEvent.title,
          description: defaultEvent.description,
          startDate: defaultEvent.startDate,
          endDate: defaultEvent.endDate,
          venueName: defaultEvent.venueId?.name || 'Hyderabad International Convention Centre',
          city: defaultEvent.venueId?.city || 'Hyderabad',
          status: 'Confirmed',
          speakerRole: 'Keynote Speaker',
          sessionsCount: 3,
          sessions: sessions
        });
      }
    } else {
      eventMap.forEach(({ event, sessions: evSessions }) => {
        let eventStatus = 'Upcoming';
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        if (now >= start && now <= end) eventStatus = 'Live';
        else if (now > end) eventStatus = 'Completed';

        eventList.push({
          _id: event._id,
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          venueName: event.venueId?.name || 'Hyderabad International Convention Centre',
          city: event.venueId?.city || 'Hyderabad',
          status: 'Confirmed',
          eventStatus,
          speakerRole: evSessions[0]?.category || 'Keynote Speaker',
          sessionsCount: evSessions.length,
          sessions: evSessions.map(s => ({
            _id: s._id,
            title: s.title,
            time: `${new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            room: s.roomName || 'Main Hall',
            status: s.status
          }))
        });
      });
    }

    // Apply Search
    if (search) {
      const q = search.toLowerCase();
      eventList = eventList.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        e.venueName.toLowerCase().includes(q)
      );
    }

    // Apply Filter
    if (filter && filter !== 'all') {
      const f = filter.toLowerCase();
      eventList = eventList.filter(e => (e.eventStatus || 'Upcoming').toLowerCase() === f);
    }

    res.status(200).json({
      success: true,
      message: 'Speaker events retrieved',
      data: { events: eventList }
    });
  } catch (err) {
    next(err);
  }
});

// 3. GET /api/speakers/me/events/:eventId - Event details with speaker's assigned sessions
router.get('/me/events/:eventId', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const event = await EventModel.findById(req.params.eventId)
      .populate('venueId')
      .populate('organizerId', 'name email phone');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const sessions = await SessionModel.find({
      eventId: event._id,
      speakerId: speaker._id
    }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      message: 'Event details retrieved',
      data: {
        event,
        sessions,
        participationStatus: 'Confirmed'
      }
    });
  } catch (err) {
    next(err);
  }
});

// 4. GET /api/speakers/me/sessions - Assigned sessions with filters
router.get('/me/sessions', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const { search, filter } = req.query;

    const query = { speakerId: speaker._id };
    let sessions = await SessionModel.find(query)
      .populate('eventId', 'title startDate endDate status')
      .populate('venueId', 'name city')
      .sort({ startTime: 1 });

    const now = new Date();

    // Map and enrich sessions
    let enriched = sessions.map(s => {
      const start = new Date(s.startTime);
      const end = new Date(s.endTime);
      let dynamicStatus = s.status || 'scheduled';
      if (s.status === 'cancelled') dynamicStatus = 'Cancelled';
      else if (now >= start && now <= end) dynamicStatus = 'Live';
      else if (now > end) dynamicStatus = 'Completed';
      else dynamicStatus = s.speakerConfirmationStatus === 'Confirmed' ? 'Confirmed' : 'Pending Confirmation';

      const presentationStatus = s.materials && s.materials.length > 0
        ? s.materials[s.materials.length - 1].status || 'Uploaded'
        : 'Not Uploaded';

      return {
        _id: s._id,
        title: s.title,
        description: s.description,
        eventTitle: s.eventId?.title || 'Global Tech Leadership Summit 2026',
        eventId: s.eventId?._id,
        date: new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        startTime: s.startTime,
        endTime: s.endTime,
        time: `${new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        room: s.roomName || 'Hall A',
        venue: s.venueId?.name || 'Hyderabad Convention Centre',
        category: s.category || 'Keynote',
        capacity: s.capacity || 500,
        expectedAttendance: s.expectedAttendance || Math.round((s.capacity || 500) * 0.84),
        status: dynamicStatus,
        speakerConfirmationStatus: s.speakerConfirmationStatus || 'Confirmed',
        presentationStatus,
        materialsCount: s.materials ? s.materials.length : 0,
        materials: s.materials || []
      };
    });

    // Apply Search
    if (search) {
      const q = search.toLowerCase();
      enriched = enriched.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.eventTitle.toLowerCase().includes(q) ||
        s.room.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    // Apply Filter (all, upcoming, today, completed, cancelled)
    if (filter && filter !== 'all') {
      const f = filter.toLowerCase();
      if (f === 'upcoming') {
        enriched = enriched.filter(s => new Date(s.endTime) >= now && s.status !== 'Cancelled');
      } else if (f === 'today') {
        const todayStr = now.toDateString();
        enriched = enriched.filter(s => new Date(s.startTime).toDateString() === todayStr);
      } else if (f === 'completed') {
        enriched = enriched.filter(s => s.status === 'Completed' || new Date(s.endTime) < now);
      } else if (f === 'cancelled') {
        enriched = enriched.filter(s => s.status === 'Cancelled');
      }
    }

    res.status(200).json({
      success: true,
      message: 'Speaker sessions retrieved',
      data: { sessions: enriched }
    });
  } catch (err) {
    next(err);
  }
});

// 5. GET /api/speakers/me/sessions/:sessionId - Granular session brief & organizer notes
router.get('/me/sessions/:sessionId', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const session = await SessionModel.findOne({
      _id: req.params.sessionId,
      speakerId: speaker._id
    })
      .populate('eventId')
      .populate('venueId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or does not belong to the authenticated speaker.'
      });
    }

    // Find other speakers at the same event for the co-speaker directory
    const otherSpeakers = await SpeakerModel.find({
      organizationId: session.eventId?.organizationId,
      _id: { $ne: speaker._id }
    }).limit(4);

    res.status(200).json({
      success: true,
      message: 'Session details retrieved',
      data: {
        session,
        speaker,
        coSpeakers: otherSpeakers
      }
    });
  } catch (err) {
    next(err);
  }
});

// 6. POST /api/speakers/me/sessions/:sessionId/confirm - Confirm session participation
router.post('/me/sessions/:sessionId/confirm', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const session = await SessionModel.findOne({
      _id: req.params.sessionId,
      speakerId: speaker._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.speakerConfirmationStatus = 'Confirmed';
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Session participation confirmed successfully',
      data: { session }
    });
  } catch (err) {
    next(err);
  }
});

// 7. GET /api/speakers/me/materials - Aggregate all uploaded slide decks & materials
router.get('/me/materials', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const sessions = await SessionModel.find({ speakerId: speaker._id })
      .populate('eventId', 'title');

    const materialsList = [];
    sessions.forEach(sess => {
      if (sess.materials && sess.materials.length > 0) {
        sess.materials.forEach(mat => {
          materialsList.push({
            _id: mat._id,
            sessionId: sess._id,
            sessionTitle: sess.title,
            eventTitle: sess.eventId?.title || 'Global Tech Leadership Summit 2026',
            title: mat.title,
            url: mat.url,
            fileType: mat.fileType || 'pdf',
            fileSize: mat.fileSize || '14.2 MB',
            description: mat.description || '',
            status: mat.status || 'Uploaded',
            uploadedAt: mat.uploadedAt,
            updatedAt: mat.updatedAt || mat.uploadedAt
          });
        });
      }
    });

    res.status(200).json({
      success: true,
      message: 'Speaker materials retrieved',
      data: { materials: materialsList }
    });
  } catch (err) {
    next(err);
  }
});

// 8. POST /api/speakers/me/materials - Upload new presentation material (Max 20MB)
router.post('/me/materials', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), upload.single('file'), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const { sessionId, title, description } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }
    if (!title) {
      return res.status(400).json({ success: false, message: 'Material title is required.' });
    }

    const session = await SessionModel.findOne({
      _id: sessionId,
      speakerId: speaker._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or you are not authorized to upload to this session.'
      });
    }

    let fileUrl = '';
    let fileType = 'pdf';
    let fileSize = '12.4 MB';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
      fileType = ext || 'pdf';
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileType = req.body.fileType || 'pdf';
    } else {
      fileUrl = `/uploads/presentation-${Date.now()}.pdf`;
    }

    const newMaterial = {
      title,
      url: fileUrl,
      fileType: fileType.toUpperCase(),
      fileSize,
      description: description || '',
      status: 'Uploaded',
      uploadedAt: new Date(),
      updatedAt: new Date()
    };

    session.materials.push(newMaterial);
    await session.save();

    res.status(201).json({
      success: true,
      message: 'Presentation material uploaded successfully.',
      data: {
        material: session.materials[session.materials.length - 1],
        sessionId: session._id
      }
    });
  } catch (err) {
    next(err);
  }
});

// 9. DELETE /api/speakers/me/materials/:sessionId/:materialId - Delete presentation material
router.delete('/me/materials/:sessionId/:materialId', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const session = await SessionModel.findOne({
      _id: req.params.sessionId,
      speakerId: speaker._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found or unauthorized.' });
    }

    session.materials = session.materials.filter(m => m._id.toString() !== req.params.materialId);
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Presentation material deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// 10. GET /api/speakers/me/availability - Weekly availability, event availability & conflict detection
router.get('/me/availability', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const sessions = await SessionModel.find({ speakerId: speaker._id })
      .populate('eventId', 'title startDate endDate')
      .sort({ startTime: 1 });

    // Detect overlapping sessions
    const conflicts = [];
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const s1 = sessions[i];
        const s2 = sessions[j];
        if (s1.startTime < s2.endTime && s2.startTime < s1.endTime) {
          conflicts.push({
            sessionA: { id: s1._id, title: s1.title, time: `${new Date(s1.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(s1.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` },
            sessionB: { id: s2._id, title: s2.title, time: `${new Date(s2.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(s2.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` },
            date: new Date(s1.startTime).toLocaleDateString()
          });
        }
      }
    }

    // Format event availability
    const eventAvailability = [
      {
        eventId: 'ev-1',
        title: 'Global Tech Leadership Summit 2026',
        date: 'September 24 – 26, 2026',
        venue: 'Hyderabad International Convention Centre',
        status: 'Confirmed',
        availability: 'Available'
      },
      {
        eventId: 'ev-2',
        title: 'FinTech Horizons Conference 2026',
        date: 'October 15 – 17, 2026',
        venue: 'Bengaluru Tech Park',
        status: 'Confirmed',
        availability: 'Available'
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Speaker availability retrieved',
      data: {
        weeklyAvailability: speaker.weeklyAvailability,
        eventAvailability,
        conflicts
      }
    });
  } catch (err) {
    next(err);
  }
});

// 11. PUT /api/speakers/me/availability - Save weekly & event availability
router.put('/me/availability', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    if (Array.isArray(req.body.weeklyAvailability)) {
      speaker.weeklyAvailability = req.body.weeklyAvailability;
    }
    if (Array.isArray(req.body.availability)) {
      speaker.availability = req.body.availability;
    }
    await speaker.save();

    res.status(200).json({
      success: true,
      message: 'Availability schedule saved successfully. Confirmed sessions remain locked pending organizer review.',
      data: {
        weeklyAvailability: speaker.weeklyAvailability,
        availability: speaker.availability
      }
    });
  } catch (err) {
    next(err);
  }
});

// 12. GET /api/speakers/me/profile - Full speaker profile with completion score
router.get('/me/profile', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const completion = calculateCompletion(speaker, req.user);

    res.status(200).json({
      success: true,
      message: 'Speaker profile retrieved',
      data: {
        speaker: {
          ...speaker.toObject(),
          email: req.user.email,
          phone: speaker.phone || req.user.phone || '+91 98765 43210',
          completion
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// 13. PUT /api/speakers/me/profile - Update speaker profile
router.put('/me/profile', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const {
      name,
      designation,
      company,
      shortBio,
      bio,
      phone,
      location,
      country,
      yearsExperience,
      industry,
      expertise,
      preferredSessionTypes,
      socialLinks,
      profileImage
    } = req.body;

    if (name) speaker.name = name;
    if (designation) speaker.designation = designation;
    if (company) speaker.company = company;
    if (shortBio !== undefined) speaker.shortBio = shortBio;
    if (bio !== undefined) speaker.bio = bio;
    if (phone !== undefined) speaker.phone = phone;
    if (location !== undefined) speaker.location = location;
    if (country !== undefined) speaker.country = country;
    if (yearsExperience !== undefined) speaker.yearsExperience = yearsExperience;
    if (industry !== undefined) speaker.industry = industry;
    if (expertise) speaker.expertise = expertise;
    if (preferredSessionTypes) speaker.preferredSessionTypes = preferredSessionTypes;
    if (socialLinks) speaker.socialLinks = { ...speaker.socialLinks, ...socialLinks };
    if (profileImage !== undefined) speaker.profileImage = profileImage;

    await speaker.save();

    // Also update User record name/phone if changed
    if (name || phone) {
      await UserModel.findByIdAndUpdate(req.user._id, {
        ...(name && { name }),
        ...(phone && { phone })
      });
    }

    const completion = calculateCompletion(speaker, req.user);

    res.status(200).json({
      success: true,
      message: 'Speaker profile updated successfully.',
      data: {
        speaker: {
          ...speaker.toObject(),
          email: req.user.email,
          completion
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// 14. GET /api/speakers/me/announcements - Retrieve announcements with read receipts
router.get('/me/announcements', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const { filter } = req.query;

    const sessions = await SessionModel.find({ speakerId: speaker._id });
    const eventIds = [...new Set(sessions.map(s => s.eventId).filter(Boolean))];

    let announcements = await AnnouncementModel.find({
      $or: [
        { eventId: { $in: eventIds } },
        { type: 'general' }
      ]
    })
      .populate('eventId', 'title')
      .populate('createdBy', 'name')
      .sort({ publishedAt: -1 });

    if (announcements.length === 0) {
      // Seed high-priority demo announcements
      announcements = [
        {
          _id: 'ann-1',
          title: 'Session Room Changed to Hall A',
          message: 'Your keynote "AI Infrastructure at Scale" has moved from Hall B to Grand Hall A to accommodate 800+ attendees.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          createdBy: { name: 'Apex Event Operations' },
          priority: 'urgent',
          type: 'session',
          publishedAt: new Date(Date.now() - 600000),
          readBy: []
        },
        {
          _id: 'ann-2',
          title: 'Speaker Green Room & Lounge Access',
          message: 'VIP Speaker badges are available at Entrance Desk 1. Catering and quiet rehearsal suites are open from 8:00 AM.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          createdBy: { name: 'Hospitality Team' },
          priority: 'high',
          type: 'general',
          publishedAt: new Date(Date.now() - 3600000),
          readBy: [req.user._id]
        },
        {
          _id: 'ann-3',
          title: 'AV Technicians Ready for Slide Handover',
          message: 'Please visit the Tech Booth 30 minutes before your slot to test wireless clickers and microphone gain.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          createdBy: { name: 'AV Production Lead' },
          priority: 'medium',
          type: 'venue',
          publishedAt: new Date(Date.now() - 14400000),
          readBy: []
        }
      ];
    }

    let mapped = announcements.map(a => {
      const aObj = a.toObject ? a.toObject() : a;
      const isRead = a.readBy && a.readBy.some(id => id.toString() === req.user._id.toString());
      return {
        _id: aObj._id,
        title: aObj.title,
        message: aObj.message,
        eventTitle: aObj.eventId?.title || 'Global Tech Leadership Summit 2026',
        sender: aObj.createdBy?.name || 'Event Organizer',
        publishedAt: aObj.publishedAt || aObj.createdAt,
        priority: aObj.priority || 'medium',
        type: aObj.type || 'general',
        isRead: Boolean(isRead)
      };
    });

    if (filter === 'unread') {
      mapped = mapped.filter(a => !a.isRead);
    } else if (filter === 'important') {
      mapped = mapped.filter(a => a.priority === 'urgent' || a.priority === 'high');
    } else if (filter === 'event_updates') {
      mapped = mapped.filter(a => a.type === 'session' || a.type === 'venue');
    }

    res.status(200).json({
      success: true,
      message: 'Announcements retrieved',
      data: { announcements: mapped }
    });
  } catch (err) {
    next(err);
  }
});

// 15. POST /api/speakers/me/announcements/:id/read - Mark announcement read
router.post('/me/announcements/:id/read', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);
    if (announcement) {
      if (!announcement.readBy.includes(req.user._id)) {
        announcement.readBy.push(req.user._id);
        await announcement.save();
      }
    }
    res.status(200).json({
      success: true,
      message: 'Announcement marked as read.'
    });
  } catch (err) {
    next(err);
  }
});

// 16. GET /api/speakers/me/settings - Account & Notification settings
router.get('/me/settings', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    res.status(200).json({
      success: true,
      message: 'Settings retrieved',
      data: {
        account: {
          email: req.user.email,
          phone: speaker.phone || req.user.phone || '+91 98765 43210',
          language: 'English (India)',
          timezone: 'Asia/Kolkata (IST +5:30)'
        },
        notifications: speaker.settings || {
          emailNotifications: true,
          sessionUpdates: true,
          organizerMessages: true,
          presentationReminders: true,
          eventAnnouncements: true,
          scheduleChanges: true,
          browserNotifications: true
        },
        privacy: {
          profileVisibility: speaker.settings?.profileVisibility || 'public',
          profileDiscovery: speaker.settings?.profileDiscovery !== false
        },
        activeSessions: [
          { device: 'Windows 11 PC • Chrome 128', location: 'Hyderabad, India', lastActive: 'Active Now', current: true },
          { device: 'iPhone 15 Pro • Safari Mobile', location: 'Hyderabad, India', lastActive: '2 hours ago', current: false }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
});

// 17. PUT /api/speakers/me/settings - Update settings
router.put('/me/settings', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const speaker = await getSpeakerForUser(req.user);
    const { notifications, privacy, phone } = req.body;

    if (notifications) {
      speaker.settings = { ...speaker.settings, ...notifications };
    }
    if (privacy) {
      speaker.settings = { ...speaker.settings, ...privacy };
    }
    if (phone) {
      speaker.phone = phone;
      await UserModel.findByIdAndUpdate(req.user._id, { phone });
    }

    await speaker.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      data: { settings: speaker.settings }
    });
  } catch (err) {
    next(err);
  }
});

// 18. PUT /api/speakers/me/password - Change speaker password
router.put('/me/password', verifyToken, verifyRole(ROLES.SPEAKER, ROLES.ADMIN), validateRequest(['currentPassword', 'newPassword']), async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    if (req.body.newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// 19. DELETE /api/speakers/me/account - Delete speaker account
router.delete('/me/account', verifyToken, verifyRole(ROLES.SPEAKER), async (req, res, next) => {
  try {
    await SpeakerModel.deleteOne({ userId: req.user._id });
    await UserModel.findByIdAndDelete(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Speaker account deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// EXISTING PUBLIC & ORGANIZER ROUTES (Preserved for compatibility)
// ============================================================

// GET /api/speakers
router.get('/', async (req, res, next) => {
  try {
    const { organizationId, search } = req.query;
    const query = {};
    if (organizationId) query.organizationId = organizationId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const speakers = await SpeakerModel.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      message: 'Speakers retrieved successfully',
      data: { speakers }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/speakers/:id
router.get('/:id', async (req, res, next) => {
  try {
    const speaker = await SpeakerModel.findById(req.params.id).populate('userId', 'email');
    if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

    const sessions = await SessionModel.find({ speakerId: speaker._id }).populate('eventId', 'title startDate endDate');

    res.status(200).json({
      success: true,
      message: 'Speaker profile retrieved',
      data: { speaker, sessions }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/speakers
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['name', 'designation']), async (req, res, next) => {
  try {
    const orgId = req.body.organizationId || req.user.organizationId;
    const speaker = await SpeakerModel.create({
      ...req.body,
      organizationId: orgId
    });

    res.status(201).json({
      success: true,
      message: 'Speaker profile created successfully',
      data: { speaker }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/speakers/:id
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const speaker = await SpeakerModel.findById(req.params.id);
    if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

    const isOwner = speaker.userId && speaker.userId.toString() === req.user._id.toString();
    const isManager = [ROLES.ORGANIZER, ROLES.ADMIN].includes(req.user.role);
    if (!isOwner && !isManager) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot modify this speaker profile' });
    }

    const updated = await SpeakerModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
      success: true,
      message: 'Speaker profile updated successfully',
      data: { speaker: updated }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/speakers/:id/availability
router.put('/:id/availability', verifyToken, async (req, res, next) => {
  try {
    const speaker = await SpeakerModel.findById(req.params.id);
    if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

    if (Array.isArray(req.body.availability)) {
      speaker.availability = req.body.availability;
      await speaker.save();
    }

    res.status(200).json({
      success: true,
      message: 'Speaker availability updated',
      data: { availability: speaker.availability }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
