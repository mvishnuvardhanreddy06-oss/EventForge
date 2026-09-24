require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const UserModel = require('../models/UserModel');
const EventModel = require('../models/EventModel');
const VenueModel = require('../models/VenueModel');
const { checkVenueConflict } = require('../utils/validateSchedule');
const { ROLES } = require('../utils/constants');

const runVenueConflictTests = async () => {
  console.log('\n================================================================');
  console.log(' EVENTFORGE VENUE CONFLICT & SCHEDULE COLLISION TEST SUITE ');
  console.log('================================================================\n');

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[SETUP] Ephemeral test server running at ${baseUrl}`);

  let passed = 0;
  let total = 0;

  const assert = (condition, title, details = '') => {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✓ PASS: ${title}`);
    } else {
      console.error(`  ✗ FAIL: ${title} -> ${details}`);
    }
  };

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventforge');
    }

    // 1. Fetch an organizer for auth
    const organizer = await UserModel.findOne({ role: ROLES.ORGANIZER });
    assert(!!organizer, 'Found organizer user for testing');
    const orgToken = jwt.sign(
      { id: organizer._id, role: organizer.role, organizationId: organizer.organizationId, email: organizer.email },
      process.env.JWT_SECRET || 'eventforge-super-secret-jwt-key-for-dev',
      { expiresIn: '1h' }
    );

    // Clean up any old test records
    await VenueModel.deleteMany({ name: { $regex: /^\[TEST-COLLISION\]/ } });
    await EventModel.deleteMany({ title: { $regex: /^\[TEST-COLLISION\]/ } });

    // 2. Create dedicated isolated test venue
    const venue = await VenueModel.create({
      name: '[TEST-COLLISION] Dedicated Convention Arena',
      type: 'Convention Center',
      address: '100 Test Way',
      city: 'Hyderabad',
      capacity: 1000,
      organizationId: organizer.organizationId,
      status: 'available'
    });
    assert(!!venue, 'Created dedicated test venue in database', venue?.name);

    // 3. Create Event A at Venue on Nov 10, 2026 - Nov 12, 2026
    const eventA = await EventModel.create({
      title: '[TEST-COLLISION] Summit A',
      description: 'First event at venue',
      startDate: new Date('2026-11-10T09:00:00.000Z'),
      endDate: new Date('2026-11-12T18:00:00.000Z'),
      registrationStart: new Date('2026-09-01T00:00:00.000Z'),
      registrationEnd: new Date('2026-11-12T18:00:00.000Z'),
      venueId: venue._id,
      capacity: 500,
      organizationId: organizer.organizationId,
      organizerId: organizer._id,
      status: 'published',
      category: 'Technology'
    });
    assert(!!eventA._id, 'Created base published Event A at test venue');

    // 4. Test checkVenueConflict utility with overlapping dates (Nov 11 - Nov 13)
    const conflictFound = await checkVenueConflict(EventModel, {
      venueId: venue._id,
      startDate: '2026-11-11T09:00:00.000Z',
      endDate: '2026-11-13T18:00:00.000Z'
    });
    assert(!!conflictFound, 'checkVenueConflict utility detects overlapping dates', JSON.stringify(conflictFound?.title));
    assert(conflictFound?._id?.toString() === eventA._id.toString(), 'Detected conflict identifies Event A correctly');

    // 5. Test checkVenueConflict with non-overlapping dates (Nov 14 - Nov 16)
    const noConflictFound = await checkVenueConflict(EventModel, {
      venueId: venue._id,
      startDate: '2026-11-14T09:00:00.000Z',
      endDate: '2026-11-16T18:00:00.000Z'
    });
    assert(!noConflictFound, 'checkVenueConflict returns null for non-overlapping future dates');

    // 6. Test checkVenueConflict with excludeEventId (self-exclusion on update)
    const selfExcludeConflict = await checkVenueConflict(EventModel, {
      venueId: venue._id,
      startDate: '2026-11-10T09:00:00.000Z',
      endDate: '2026-11-12T18:00:00.000Z',
      excludeEventId: eventA._id
    });
    assert(!selfExcludeConflict, 'checkVenueConflict ignores self when excludeEventId is supplied');

    // 7. API Test: POST /api/events with collision should return 409 Conflict
    const createCollisionRes = await fetch(`${baseUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orgToken}`
      },
      body: JSON.stringify({
        title: '[TEST-COLLISION] Summit B Overlapping',
        description: 'Should be rejected due to venue collision',
        startDate: '2026-11-11T10:00:00.000Z',
        endDate: '2026-11-11T16:00:00.000Z',
        venueId: venue._id.toString(),
        capacity: 300,
        category: 'Technology',
        status: 'published'
      })
    });
    const createCollisionJson = await createCollisionRes.json();
    assert(createCollisionRes.status === 409, 'POST /api/events returns 409 Conflict on venue collision', `Status: ${createCollisionRes.status}`);
    assert(createCollisionJson.error?.code === 'VENUE_CONFLICT', 'Error response includes code VENUE_CONFLICT');
    assert(createCollisionJson.message?.includes('Venue Conflict'), 'Error response contains clear collision explanation message');

    // 8. API Test: POST /api/events with non-overlapping date should succeed (201)
    const createNonCollisionRes = await fetch(`${baseUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orgToken}`
      },
      body: JSON.stringify({
        title: '[TEST-COLLISION] Summit C Safe',
        description: 'Should succeed since dates do not collide',
        startDate: '2026-11-15T09:00:00.000Z',
        endDate: '2026-11-16T18:00:00.000Z',
        venueId: venue._id.toString(),
        capacity: 300,
        category: 'Technology',
        status: 'published'
      })
    });
    const createNonCollisionJson = await createNonCollisionRes.json();
    assert(createNonCollisionRes.status === 201, 'POST /api/events succeeds (201) for non-overlapping dates at same venue');

    // 9. API Test: GET /api/venues/:id/check-availability for busy dates returns available: false
    const checkBusyRes = await fetch(`${baseUrl}/api/venues/${venue._id}/check-availability?startDate=2026-11-10T09:00:00.000Z&endDate=2026-11-12T18:00:00.000Z`);
    const checkBusyJson = await checkBusyRes.json();
    assert(checkBusyRes.status === 200, 'GET /api/venues/:id/check-availability responds with 200');
    assert(checkBusyJson.available === false, 'check-availability returns available: false for booked window');
    assert(checkBusyJson.conflict?.conflictingEvent === '[TEST-COLLISION] Summit A', 'check-availability reports conflicting event title');

    // 10. API Test: GET /api/venues/:id/check-availability for free dates returns available: true
    const checkFreeRes = await fetch(`${baseUrl}/api/venues/${venue._id}/check-availability?startDate=2026-12-01T09:00:00.000Z&endDate=2026-12-05T18:00:00.000Z`);
    const checkFreeJson = await checkFreeRes.json();
    assert(checkFreeJson.available === true, 'check-availability returns available: true for free dates');

    // 11. API Test: GET /api/venues/conflicts/all correctly scans database
    const conflictsAllRes = await fetch(`${baseUrl}/api/venues/conflicts/all`);
    const conflictsAllJson = await conflictsAllRes.json();
    assert(conflictsAllRes.status === 200, 'GET /api/venues/conflicts/all responds with 200');
    assert(typeof conflictsAllJson.totalConflicts === 'number', 'GET /api/venues/conflicts/all returns totalConflicts count');

    // 12. API Test: GET /api/venues/:id/bookings returns venue bookings
    const bookingsRes = await fetch(`${baseUrl}/api/venues/${venue._id}/bookings`);
    const bookingsJson = await bookingsRes.json();
    assert(bookingsRes.status === 200, 'GET /api/venues/:id/bookings responds with 200');
    assert(Array.isArray(bookingsJson.data?.bookings), 'GET /api/venues/:id/bookings returns bookings array');
    assert(bookingsJson.data?.bookings?.length >= 2, 'Venue bookings lists confirmed event bookings');

    // Clean up test events and venue
    await EventModel.deleteMany({ title: { $regex: /^\[TEST-COLLISION\]/ } });
    await VenueModel.deleteMany({ name: { $regex: /^\[TEST-COLLISION\]/ } });
    console.log('[CLEANUP] Deleted test events and test venue');

    console.log('\n================================================================');
    console.log(` VENUE CONFLICT SUITE RESULTS: ${passed}/${total} PASSED`);
    console.log('================================================================\n');

    server.close();
    await mongoose.disconnect();
    process.exit(passed === total ? 0 : 1);
  } catch (err) {
    console.error('Test execution error:', err);
    server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
};

runVenueConflictTests();
