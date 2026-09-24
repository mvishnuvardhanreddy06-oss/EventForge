require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const UserModel = require('../models/UserModel');
const EventModel = require('../models/EventModel');
const TicketModel = require('../models/TicketModel');
const RegistrationModel = require('../models/RegistrationModel');
const SpeakerModel = require('../models/SpeakerModel');
const SponsorModel = require('../models/SponsorModel');
const InvoiceModel = require('../models/InvoiceModel');
const { ROLES } = require('../utils/constants');

const runIntegrityTests = async () => {
  console.log('\n======================================================');
  console.log(' EVENTFORGE BACKEND SECURITY & DATA INTEGRITY TESTS   ');
  console.log('======================================================\n');

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[SETUP] Ephemeral server running on ${baseUrl}`);

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
    // -------------------------------------------------------------------------
    // TEST 1: JWT Secret Hardening & Error Masking
    // -------------------------------------------------------------------------
    console.log('\n--- 1. JWT Fallback Removal & Error Masking ---');
    const fakeSecretToken = jwt.sign(
      { id: new mongoose.Types.ObjectId(), role: ROLES.ADMIN },
      'eventforge_fallback_secret_2026',
      { expiresIn: '1h' }
    );
    const fallbackRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${fakeSecretToken}` }
    });
    const fallbackData = await fallbackRes.json();
    assert(fallbackRes.status === 401, 'Token signed with hardcoded fallback secret is rejected with 401 Unauthorized', `got: ${fallbackRes.status}`);
    assert(fallbackData.message === 'Invalid or expired token.', 'Error message is masked to generic "Invalid or expired token."', `got: ${fallbackData.message}`);
    assert(fallbackData.error?.code === 'INVALID_TOKEN', 'Error code is masked as INVALID_TOKEN');

    // -------------------------------------------------------------------------
    // TEST 2: Self-Registration Role Restriction
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Public Self-Registration Security ---');
    const forbiddenRoles = ['organizer', 'admin', 'staff', 'speaker', 'sponsor'];
    for (const role of forbiddenRoles) {
      const regRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Malicious ${role}`,
          email: `test_block_${role}_${Date.now()}@test.com`,
          password: 'Password123!',
          role
        })
      });
      const regData = await regRes.json();
      assert(regRes.status === 403, `Self-registration as "${role}" rejected with 403 Forbidden`);
      assert(regData.error?.code === 'FORBIDDEN_ROLE_REGISTRATION', `Error code is FORBIDDEN_ROLE_REGISTRATION for ${role}`);
    }

    // Legitimate registration defaults to ATTENDEE with organizationId: null
    const legitAttendeeEmail = `legit_attendee_${Date.now()}@test.com`;
    const legitRegRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Legitimate Attendee',
        email: legitAttendeeEmail,
        password: 'Password123!',
        role: 'attendee'
      })
    });
    const legitRegData = await legitRegRes.json();
    assert(legitRegRes.status === 201, 'Legitimate attendee self-registration succeeds with 201 Created');
    const createdUser = await UserModel.findOne({ email: legitAttendeeEmail });
    assert(createdUser && createdUser.role === ROLES.ATTENDEE, 'Created user has role ATTENDEE');
    assert(createdUser.organizationId === null, 'Created user has organizationId strictly null');

    // -------------------------------------------------------------------------
    // TEST 3: GET /api/auth/users Protection
    // -------------------------------------------------------------------------
    console.log('\n--- 3. /api/auth/users Role & Tenant Scoping ---');
    // Attendee login
    const attLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: legitAttendeeEmail, password: 'Password123!' })
    });
    const attToken = (await attLogin.json()).data.token;

    // Staff login
    const staff1Login = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'staff1@eventforge.io', password: 'Password123!' })
    });
    const staff1Token = (await staff1Login.json()).data.token;

    // Attendee cannot access /api/auth/users
    const attUsersRes = await fetch(`${baseUrl}/api/auth/users`, {
      headers: { 'Authorization': `Bearer ${attToken}` }
    });
    assert(attUsersRes.status === 403, 'Attendee access to /api/auth/users returns 403 Forbidden');

    // Staff cannot access /api/auth/users
    const staffUsersRes = await fetch(`${baseUrl}/api/auth/users`, {
      headers: { 'Authorization': `Bearer ${staff1Token}` }
    });
    assert(staffUsersRes.status === 403, 'Staff access to /api/auth/users returns 403 Forbidden');

    // Organizer login
    const org1Login = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'organizer@nexus.io', password: 'Password123!' })
    });
    const org1Token = (await org1Login.json()).data.token;

    // Organizer can access, but only within own organization
    const org1UsersRes = await fetch(`${baseUrl}/api/auth/users`, {
      headers: { 'Authorization': `Bearer ${org1Token}` }
    });
    const org1UsersData = await org1UsersRes.json();
    assert(org1UsersRes.status === 200, 'Organizer access to /api/auth/users succeeds with 200 OK');
    const returnedUsers = org1UsersData.data?.users || [];
    const org1UserDoc = await UserModel.findOne({ email: 'organizer@nexus.io' });
    const foreignUsers = returnedUsers.filter(u => {
      const uOrgId = u.organizationId?._id ? u.organizationId._id.toString() : u.organizationId?.toString();
      return uOrgId && uOrgId !== org1UserDoc.organizationId.toString();
    });
    assert(foreignUsers.length === 0, 'Organizer cannot see users belonging to other organizations');

    // -------------------------------------------------------------------------
    // TEST 4: Staff Explicit Event Assignment Enforcement
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Staff Explicit Event Assignment Enforcement ---');
    // Staff 1 is assigned to event1 (Global AI & Cloud Summit 2026), but NOT event2 (FinTech Horizons)
    const event1 = await EventModel.findOne({ title: 'Global AI & Cloud Summit 2026' });
    const event2 = await EventModel.findOne({ title: 'FinTech Horizons Conference 2026' });

    // Staff 1 check-in scan on assigned event1
    const staffAssignedScan = await fetch(`${baseUrl}/api/attendance/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staff1Token}`
      },
      body: JSON.stringify({
        qrToken: 'FAKE_OR_NONEXISTENT_QR',
        eventId: event1._id.toString()
      })
    });
    // Even if QR is invalid, authorization passes to validation logic (returns 400 or 404, NOT 403 Forbidden)
    assert(staffAssignedScan.status !== 403, 'Staff 1 is authorized to scan for assigned Event 1 (status is not 403 Forbidden)');

    // Staff 1 check-in scan on UNASSIGNED event2
    const staffUnassignedScan = await fetch(`${baseUrl}/api/attendance/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staff1Token}`
      },
      body: JSON.stringify({
        qrToken: 'FAKE_QR',
        eventId: event2._id.toString()
      })
    });
    assert(staffUnassignedScan.status === 403, 'Staff 1 scanning for unassigned Event 2 is blocked with 403 Forbidden');

    // -------------------------------------------------------------------------
    // TEST 5: Multi-Tenant Organization Isolation in Analytics & Mutation
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Multi-Tenant Organization Analytics Isolation ---');
    // Organizer 1 (Nexus) attempts to fetch analytics for Event 2 (Apex)
    const crossOrgAnalyticsRes = await fetch(`${baseUrl}/api/analytics/organizer/${event2._id}`, {
      headers: { 'Authorization': `Bearer ${org1Token}` }
    });
    assert(crossOrgAnalyticsRes.status === 403, 'Organizer cannot view analytics for event owned by another organization (403 Forbidden)');

    // Organizer 1 (Nexus) attempts to mutate Event 2 (Apex)
    const crossOrgUpdateRes = await fetch(`${baseUrl}/api/events/${event2._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${org1Token}`
      },
      body: JSON.stringify({ title: 'Hacked Title' })
    });
    assert(crossOrgUpdateRes.status === 403, 'Organizer cannot mutate event owned by another organization (403 Forbidden)');

    // -------------------------------------------------------------------------
    // TEST 6: Payment Data Integrity & Pending QR Check-In Guard
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Payment Status & Premature Check-In Protection ---');
    // Find paid ticket tier for Event 1
    const paidTicket = await TicketModel.findOne({ eventId: event1._id, price: { $gt: 0 } });
    if (paidTicket) {
      const paidRegRes = await fetch(`${baseUrl}/api/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${attToken}`
        },
        body: JSON.stringify({
          eventId: event1._id.toString(),
          ticketId: paidTicket._id.toString()
        })
      });
      const paidRegData = await paidRegRes.json();
      assert(paidRegRes.status === 201, 'Paid registration created successfully');
      const regDoc = await RegistrationModel.findById(paidRegData.data?.registration?._id);
      assert(regDoc.paymentStatus === 'pending', 'Paid registration starts with paymentStatus strictly "pending"');
      assert(regDoc.status === 'pending', 'Paid registration starts with status strictly "pending"');

      // Staff attempts to scan QR of unconfirmed/pending registration
      const scanPendingRes = await fetch(`${baseUrl}/api/attendance/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${staff1Token}`
        },
        body: JSON.stringify({
          qrToken: regDoc.qrToken,
          eventId: event1._id.toString()
        })
      });
      assert(scanPendingRes.status === 400, 'Check-in scan rejected with 400 for ticket with pending payment');
    }

    // -------------------------------------------------------------------------
    // TEST 7: Privacy Check on Public Endpoints
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Public Data Privacy Enforcement ---');
    const publicSpeakersRes = await fetch(`${baseUrl}/api/speakers`);
    const publicSpeakersData = await publicSpeakersRes.json();
    const speakerList = publicSpeakersData.data?.speakers || [];
    const leakedSpeakerPhone = speakerList.some(s => s.phone && s.phone.trim() !== '');
    assert(!leakedSpeakerPhone, 'Public GET /api/speakers does not leak private speaker phone numbers');

    const publicSponsorsRes = await fetch(`${baseUrl}/api/sponsors`);
    const publicSponsorsData = await publicSponsorsRes.json();
    const sponsorList = publicSponsorsData.data?.sponsors || [];
    const leakedSponsorPhone = sponsorList.some(s => s.phone && s.phone.trim() !== '');
    const leakedSponsorEmail = sponsorList.some(s => s.email && s.email.trim() !== '');
    assert(!leakedSponsorPhone && !leakedSponsorEmail, 'Public GET /api/sponsors does not leak private phone or email');

    console.log('\n======================================================');
    console.log(`RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('Fatal test error:', err);
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(passed === total ? 0 : 1);
  }
};

runIntegrityTests();
