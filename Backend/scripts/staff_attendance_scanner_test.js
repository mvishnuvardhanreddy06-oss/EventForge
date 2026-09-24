/**
 * Automated Verification Script: Staff Session Attendance & QR Scanner Integration
 * Tests:
 * 1. Staff Event Scoping (Assigned vs Unassigned)
 * 2. Session Listing Authorization & Scoping
 * 3. Event 5 ("Modern Web Architectures Forum") Sessions Populated
 * 4. Event 3 (0 Sessions) Graceful Empty List
 * 5. QR Code Token Check-In (POST /api/attendance/scan)
 * 6. Manual Registration Number Check-In (POST /api/attendance/scan)
 * 7. Duplicate Check-In Detection (409 Conflict)
 * 8. Wrong Event Mismatch (400 Bad Request)
 * 9. Unauthorized Staff Check-In Block (403 Forbidden)
 * 10. Session Attendance Roster Retrieval (GET /api/attendance/session/:sessionId)
 * 11. Session Attendance Mark (POST /api/attendance/session)
 * 12. Session Attendance Duplicate Check (409 Conflict)
 * 13. Session Attendance Unmark (DELETE /api/attendance/session/:sessionId/:attendeeId)
 */

const mongoose = require('mongoose');
const http = require('http');
const { app } = require('../server');
const UserModel = require('../models/UserModel');
const EventModel = require('../models/EventModel');
const SessionModel = require('../models/SessionModel');
const RegistrationModel = require('../models/RegistrationModel');
const AttendanceModel = require('../models/AttendanceModel');
const jwt = require('jsonwebtoken');

let server;
let baseUrl;

const request = async (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting Staff Session Attendance & QR Scanner Test Suite ---');
  let passed = 0;
  let total = 0;

  const assert = (condition, description) => {
    total++;
    if (condition) {
      console.log(`[PASS] ${description}`);
      passed++;
    } else {
      console.error(`[FAIL] ${description}`);
    }
  };

  try {
    // Start temporary test server
    const port = 5098;
    server = app.listen(port);
    baseUrl = `http://localhost:${port}`;

    // 1. Fetch credentials
    const staff1 = await UserModel.findOne({ email: 'staff1@eventforge.io' });
    const staff2 = await UserModel.findOne({ email: 'staff2@eventforge.io' });
    const staff1Token = jwt.sign({ id: staff1._id, role: staff1.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const staff2Token = jwt.sign({ id: staff2._id, role: staff2.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const event1 = await EventModel.findOne({ title: /Global AI/i });
    const event2 = await EventModel.findOne({ title: /FinTech/i });
    const event3 = await EventModel.findOne({ title: /DevOps World/i });
    const event5 = await EventModel.findOne({ title: /Modern Web Architectures/i });

    console.log(`Found Events:
  - Event 1 (Assigned to Staff 1): ${event1?.title} (${event1?._id})
  - Event 2 (NOT assigned to Staff 1): ${event2?.title} (${event2?._id})
  - Event 3 (Assigned to Staff 1, 0 sessions): ${event3?.title} (${event3?._id})
  - Event 5 (Assigned to Staff 1, 3 sessions): ${event5?.title} (${event5?._id})`);

    // TEST 1: Staff 1 gets assigned events only
    const evRes = await request('GET', '/api/events', null, staff1Token);
    assert(evRes.status === 200, 'GET /api/events returns 200 OK');
    const returnedEventIds = (evRes.body.data?.events || []).map(e => e._id.toString());
    assert(returnedEventIds.includes(event5._id.toString()), 'Event 5 is included in Staff 1 events');
    assert(returnedEventIds.includes(event1._id.toString()), 'Event 1 is included in Staff 1 events');
    assert(!returnedEventIds.includes(event2._id.toString()), 'Event 2 (unassigned) is excluded from Staff 1 events');

    // TEST 2: Staff 1 requests sessions for unassigned Event 2 -> 403 Forbidden
    const unassignedSessRes = await request('GET', `/api/sessions?eventId=${event2._id}`, null, staff1Token);
    assert(unassignedSessRes.status === 403, 'Staff 1 requesting sessions for unassigned Event 2 returns 403 Forbidden');
    assert(unassignedSessRes.body.error?.code === 'FORBIDDEN_EVENT_ACCESS', 'Error code is FORBIDDEN_EVENT_ACCESS');

    // TEST 3: Staff 1 requests sessions for assigned Event 5 ("Modern Web Architectures Forum")
    const ev5SessRes = await request('GET', `/api/sessions?eventId=${event5._id}`, null, staff1Token);
    assert(ev5SessRes.status === 200, 'Staff 1 requesting sessions for Event 5 returns 200 OK');
    const ev5Sessions = ev5SessRes.body.data?.sessions || [];
    assert(ev5Sessions.length === 3, `Event 5 has exactly 3 populated sessions (Found: ${ev5Sessions.length})`);
    assert(ev5Sessions[0].speakerId?.name, `Session speaker name is populated: ${ev5Sessions[0].speakerId?.name}`);
    assert(ev5Sessions[0].roomName, `Session room is populated: ${ev5Sessions[0].roomName}`);

    // TEST 4: Staff 1 requests sessions for assigned Event 3 (DevOps Expo with 0 sessions)
    const ev3SessRes = await request('GET', `/api/sessions?eventId=${event3._id}`, null, staff1Token);
    assert(ev3SessRes.status === 200, 'Staff 1 requesting sessions for Event 3 returns 200 OK');
    const ev3Sessions = ev3SessRes.body.data?.sessions || [];
    assert(ev3Sessions.length === 0, `Event 3 returns empty array [] for sessions (Found: ${ev3Sessions.length})`);

    // TEST 5: QR Code scan check-in on Event 1
    const regEvent1 = await RegistrationModel.findOne({ eventId: event1._id, checkedIn: false, status: 'confirmed' });
    const scanQrRes = await request('POST', '/api/attendance/scan', {
      qrToken: regEvent1.qrToken,
      eventId: event1._id.toString()
    }, staff1Token);
    assert(scanQrRes.status === 200, 'Check-in using QR token returns 200 OK');
    assert(scanQrRes.body.data?.attendeeName, `Check-in returned structured attendeeName: ${scanQrRes.body.data?.attendeeName}`);
    assert(scanQrRes.body.data?.eventTitle, `Check-in returned structured eventTitle: ${scanQrRes.body.data?.eventTitle}`);
    assert(scanQrRes.body.data?.ticketTier, `Check-in returned structured ticketTier: ${scanQrRes.body.data?.ticketTier}`);
    assert(scanQrRes.body.data?.checkInTime, `Check-in returned structured checkInTime: ${scanQrRes.body.data?.checkInTime}`);

    // TEST 6: Manual Registration Number check-in on Event 5
    const regEvent5 = await RegistrationModel.findOne({ eventId: event5._id, checkedIn: false, status: 'confirmed' });
    const scanRegRes = await request('POST', '/api/attendance/scan', {
      qrToken: regEvent5.registrationNumber, // Using registrationNumber in the exact same field/endpoint!
      eventId: event5._id.toString()
    }, staff1Token);
    assert(scanRegRes.status === 200, `Check-in using registrationNumber (${regEvent5.registrationNumber}) returns 200 OK`);
    assert(scanRegRes.body.data?.attendeeName, `Check-in returned structured attendeeName: ${scanRegRes.body.data?.attendeeName}`);

    // TEST 7: Duplicate Check-in detection
    const dupRes = await request('POST', '/api/attendance/scan', {
      qrToken: regEvent5.registrationNumber,
      eventId: event5._id.toString()
    }, staff1Token);
    assert(dupRes.status === 409, 'Duplicate check-in returns 409 Conflict');
    assert(dupRes.body.error?.code === 'ALREADY_CHECKED_IN', 'Error code is ALREADY_CHECKED_IN');

    // TEST 8: Ticket for wrong event
    const regMismatchRes = await request('POST', '/api/attendance/scan', {
      qrToken: regEvent1.qrToken,
      eventId: event5._id.toString() // Ticket belongs to Event 1, but scanned under Event 5
    }, staff1Token);
    assert(regMismatchRes.status === 400, 'Scanning ticket under wrong event returns 400 Bad Request');
    assert(regMismatchRes.body.error?.code === 'EVENT_MISMATCH', 'Error code is EVENT_MISMATCH');

    // TEST 9: Unauthorized staff scan
    const unauthScanRes = await request('POST', '/api/attendance/scan', {
      qrToken: 'dummy-token',
      eventId: event2._id.toString() // Staff 1 is not assigned to Event 2
    }, staff1Token);
    assert(unauthScanRes.status === 403, 'Unauthorized staff scan returns 403 Forbidden');
    assert(unauthScanRes.body.error?.code === 'FORBIDDEN_EVENT_CHECKIN', 'Error code is FORBIDDEN_EVENT_CHECKIN');

    // TEST 10: Session attendance roster retrieval
    const targetSession = ev5Sessions[0];
    const rosterRes = await request('GET', `/api/attendance/session/${targetSession._id}`, null, staff1Token);
    assert(rosterRes.status === 200, 'GET /api/attendance/session/:id returns 200 OK');
    const rosterData = rosterRes.body.data;
    assert(rosterData.session?.title === targetSession.title, `Roster returned session: ${rosterData.session?.title}`);
    assert(Array.isArray(rosterData.registeredAttendees), 'Roster includes registeredAttendees array');
    assert(rosterData.registeredAttendees.length > 0, `Roster contains ${rosterData.registeredAttendees.length} registered attendees`);
    const sampleAttendee = rosterData.registeredAttendees[0];
    assert(sampleAttendee.attendeeId && sampleAttendee.name && sampleAttendee.ticketName, 'Roster attendee has id, name, and ticket tier');

    // TEST 11: Mark session attendance
    const attendeeToMark = sampleAttendee.attendeeId;
    const markRes = await request('POST', '/api/attendance/session', {
      sessionId: targetSession._id.toString(),
      attendeeId: attendeeToMark.toString(),
      method: 'manual'
    }, staff1Token);
    assert(markRes.status === 201, 'POST /api/attendance/session returns 201 Created');
    assert(markRes.body.data?.attendance?.attendeeId?._id.toString() === attendeeToMark.toString(), 'Recorded session attendance for correct attendee');

    // TEST 12: Duplicate session attendance check
    const dupSessRes = await request('POST', '/api/attendance/session', {
      sessionId: targetSession._id.toString(),
      attendeeId: attendeeToMark.toString(),
      method: 'manual'
    }, staff1Token);
    assert(dupSessRes.status === 409, 'Duplicate session attendance mark returns 409 Conflict');
    assert(dupSessRes.body.error?.code === 'DUPLICATE_SESSION_ATTENDANCE', 'Error code is DUPLICATE_SESSION_ATTENDANCE');

    // TEST 13: Unmark session attendance
    const unmarkRes = await request('DELETE', `/api/attendance/session/${targetSession._id}/${attendeeToMark}`, null, staff1Token);
    assert(unmarkRes.status === 200, 'DELETE /api/attendance/session/:sessionId/:attendeeId returns 200 OK');
    assert(unmarkRes.body.message.includes('unmarked'), 'Response confirms attendance unmarked');

    // TEST 14: Verify roster reflects unmark
    const rosterAfterUnmark = await request('GET', `/api/attendance/session/${targetSession._id}`, null, staff1Token);
    const updatedAttendee = rosterAfterUnmark.body.data.registeredAttendees.find(a => a.attendeeId.toString() === attendeeToMark.toString());
    assert(updatedAttendee.isCheckedIn === false, 'Roster correctly shows isCheckedIn = false after unmark');

    console.log(`\n==================================================`);
    console.log(`Test Results: ${passed} / ${total} Passed (${Math.round((passed / total) * 100)}%)`);
    console.log(`==================================================\n`);

  } catch (err) {
    console.error('Test execution failed with error:', err);
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(passed === total ? 0 : 1);
  }
};

runTests();
