require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const UserModel = require('../models/UserModel');
const EventModel = require('../models/EventModel');
const RegistrationModel = require('../models/RegistrationModel');
const TicketModel = require('../models/TicketModel');
const FeedbackModel = require('../models/FeedbackModel');
const { ROLES } = require('../utils/constants');

const runFeedbackAndRegistrationTest = async () => {
  console.log('================================================================');
  console.log(' ATTENDEE FEEDBACK & DUPLICATE REGISTRATION VERIFICATION TEST   ');
  console.log('================================================================\n');

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[SETUP] Ephemeral test server running at ${baseUrl}`);

  try {
    // 1. Fetch attendee user
    const attendee = await UserModel.findOne({ role: ROLES.ATTENDEE });
    if (!attendee) {
      throw new Error('Attendee user not found in database. Please seed database first.');
    }

    const token = jwt.sign(
      { id: attendee._id, _id: attendee._id, role: attendee.role, organizationId: attendee.organizationId },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 2. Test GET /api/attendee/feedback/available
    console.log('--- 1. FEEDBACK AVAILABLE EVENTS ---');
    const availRes = await fetch(`${baseUrl}/api/attendee/feedback/available`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const availJson = await availRes.json();
    console.log(`  Status: ${availRes.status}`);
    console.log(`  Success: ${availJson.success}`);
    console.log(`  Available Events Count: ${availJson.data?.availableEvents?.length || 0}`);
    if (availRes.status !== 200 || !availJson.success) {
      throw new Error(`Failed to get available feedback: ${JSON.stringify(availJson)}`);
    }
    console.log('  ✓ PASS: GET /api/attendee/feedback/available returned 200 OK with available events array\n');

    // 3. Test GET /api/attendee/events (public discovery events used by Feedback.jsx)
    console.log('--- 2. FEEDBACK ALL DISCOVERY EVENTS ---');
    const evRes = await fetch(`${baseUrl}/api/attendee/events`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const evJson = await evRes.json();
    console.log(`  Status: ${evRes.status}`);
    console.log(`  Success: ${evJson.success}`);
    console.log(`  Events Count: ${evJson.data?.events?.length || 0}`);
    if (evRes.status !== 200 || !evJson.data?.events) {
      throw new Error(`Failed to get discovery events: ${JSON.stringify(evJson)}`);
    }
    console.log('  ✓ PASS: GET /api/attendee/events returned 200 OK with events array\n');

    // 4. Test POST /api/attendee/feedback
    console.log('--- 3. SUBMIT FEEDBACK & PREVENT DUPLICATES ---');
    const targetEvent = await EventModel.findOne({ status: { $in: ['published', 'ongoing'] } });
    if (!targetEvent) throw new Error('No target event found');

    // Clear previous feedback for targetEvent to test fresh submission
    await FeedbackModel.deleteMany({ eventId: targetEvent._id, attendeeId: attendee._id, sessionId: null });

    const submitRes = await fetch(`${baseUrl}/api/attendee/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        eventId: targetEvent._id.toString(),
        eventRating: 5,
        sessionRating: 5,
        speakerRating: 5,
        venueRating: 5,
        overallRating: 5,
        comment: 'Outstanding conference program and keynote delivery!',
        likedAspects: 'Deep technical workshops',
        improvements: 'None'
      })
    });
    const submitJson = await submitRes.json();
    console.log(`  Initial Submit Status: ${submitRes.status}`);
    console.log(`  Success: ${submitJson.success}`);
    if (submitRes.status !== 201 || !submitJson.success) {
      throw new Error(`Failed initial feedback submission: ${JSON.stringify(submitJson)}`);
    }
    console.log('  ✓ PASS: POST /api/attendee/feedback returned 201 Created');

    // Test duplicate submission rejection
    const dupRes = await fetch(`${baseUrl}/api/attendee/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        eventId: targetEvent._id.toString(),
        overallRating: 5,
        comment: 'Duplicate test'
      })
    });
    const dupJson = await dupRes.json();
    console.log(`  Duplicate Submit Status: ${dupRes.status}`);
    console.log(`  Duplicate Error Code: ${dupJson.error?.code}`);
    if (dupRes.status !== 409 || dupJson.error?.code !== 'DUPLICATE_FEEDBACK') {
      throw new Error(`Expected 409 DUPLICATE_FEEDBACK, got: ${JSON.stringify(dupJson)}`);
    }
    console.log('  ✓ PASS: Duplicate feedback correctly rejected with 409 Conflict\n');

    // 5. Test Duplicate Event Registration Rejection (409 Conflict)
    console.log('--- 4. DUPLICATE REGISTRATION 409 CONFLICT HANDLING ---');
    const existingReg = await RegistrationModel.findOne({ attendeeId: attendee._id, status: 'confirmed' });
    if (!existingReg) throw new Error('No existing registration found for attendee');

    const regEventId = existingReg.eventId;
    const ticket = await TicketModel.findOne({ eventId: regEventId });

    const duplicateRegRes = await fetch(`${baseUrl}/api/attendee/events/${regEventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ticketId: ticket ? ticket._id.toString() : existingReg.ticketId.toString(),
        phone: '+919876543210',
        attendeeName: 'Attendee User 1'
      })
    });
    const duplicateRegJson = await duplicateRegRes.json();
    console.log(`  Status: ${duplicateRegRes.status}`);
    console.log(`  Message: "${duplicateRegJson.message}"`);
    if (duplicateRegRes.status !== 409 || !duplicateRegJson.message.includes('already registered')) {
      throw new Error(`Expected 409 already registered, got: ${JSON.stringify(duplicateRegJson)}`);
    }
    console.log('  ✓ PASS: Re-registering for existing event correctly returns 409 Conflict with "You are already registered for this event."\n');

    console.log('================================================================');
    console.log(' ALL ATTENDEE FEEDBACK & REGISTRATION TESTS PASSED!             ');
    console.log('================================================================');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
};

runFeedbackAndRegistrationTest();
