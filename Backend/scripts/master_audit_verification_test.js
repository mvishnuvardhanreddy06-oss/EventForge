require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const UserModel = require('../models/UserModel');
const OrganizationModel = require('../models/OrganizationModel');
const EventModel = require('../models/EventModel');
const TicketModel = require('../models/TicketModel');
const RegistrationModel = require('../models/RegistrationModel');
const SessionModel = require('../models/SessionModel');
const SpeakerModel = require('../models/SpeakerModel');
const SponsorModel = require('../models/SponsorModel');
const SponsorshipModel = require('../models/SponsorshipModel');
const SubscriptionPlanModel = require('../models/SubscriptionPlanModel');
const { ROLES } = require('../utils/constants');

const runMasterAuditTests = async () => {
  console.log('\n================================================================');
  console.log(' EVENTFORGE MASTER 6-ROLE END-TO-END AUDIT & VERIFICATION SUITE ');
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
    // -------------------------------------------------------------
    // Find or prepare users for each of the 6 roles
    // -------------------------------------------------------------
    const adminUser = await UserModel.findOne({ role: ROLES.ADMIN });
    const orgUser = await UserModel.findOne({ role: ROLES.ORGANIZER });
    const staffUser = await UserModel.findOne({ role: ROLES.STAFF });
    const speakerUser = await UserModel.findOne({ role: ROLES.SPEAKER });
    const sponsorUser = await UserModel.findOne({ role: ROLES.SPONSOR });
    const attendeeUser = await UserModel.findOne({ role: ROLES.ATTENDEE });

    const createToken = (user) => jwt.sign(
      { id: user._id, role: user.role, organizationId: user.organizationId },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const adminToken = createToken(adminUser);
    const orgToken = createToken(orgUser);
    const staffToken = createToken(staffUser);
    const speakerToken = createToken(speakerUser);
    const sponsorToken = createToken(sponsorUser);
    const attendeeToken = createToken(attendeeUser);

    // =============================================================
    // ROLE 1: PLATFORM ADMIN TESTS
    // =============================================================
    console.log('\n--- 1. PLATFORM ADMIN TESTS ---');
    // Admin lists all users across platform
    const adminUsersRes = await fetch(`${baseUrl}/api/auth/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminUsersData = await adminUsersRes.json();
    assert(adminUsersRes.status === 200, 'Admin can fetch all platform users (200 OK)');
    assert(Array.isArray(adminUsersData.data?.users), 'Admin users response contains users array');

    // Admin lists subscription plans
    const adminPlansRes = await fetch(`${baseUrl}/api/subscriptions/plans`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminPlansData = await adminPlansRes.json();
    assert(adminPlansRes.status === 200, 'Admin can fetch subscription plans (200 OK)');
    assert(Array.isArray(adminPlansData.data?.plans), 'Subscription plans array returned');

    // Admin lists organizations subscriptions
    const adminOrgSubsRes = await fetch(`${baseUrl}/api/subscriptions/organizations`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminOrgSubsData = await adminOrgSubsRes.json();
    assert(adminOrgSubsRes.status === 200, 'Admin can list organization subscriptions (200 OK)');
    assert(Array.isArray(adminOrgSubsData.data?.subscriptions), 'Organization subscriptions array returned');

    // Admin can update organization plan
    if (orgUser.organizationId) {
      const patchPlanRes = await fetch(`${baseUrl}/api/subscriptions/organizations/${orgUser.organizationId}/plan`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planName: 'Pro' })
      });
      assert(patchPlanRes.status === 200, 'Admin can change an organization subscription plan (200 OK)');
    }

    // =============================================================
    // ROLE 2: EVENT ORGANIZER TESTS
    // =============================================================
    console.log('\n--- 2. EVENT ORGANIZER TESTS ---');
    // Organizer dashboard analytics
    const orgDashRes = await fetch(`${baseUrl}/api/analytics/organizer/dashboard`, {
      headers: { 'Authorization': `Bearer ${orgToken}` }
    });
    const orgDashData = await orgDashRes.json();
    assert(orgDashRes.status === 200, 'Organizer dashboard analytics returns 200 OK');
    assert(orgDashData.data?.summary?.totalEvents !== undefined, 'Organizer dashboard summary contains totalEvents');
    assert(Array.isArray(orgDashData.data?.events), 'Organizer dashboard returns active events array');

    // Organizer creates a new event
    const createEvtRes = await fetch(`${baseUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${orgToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `Audit Test Conference ${Date.now()}`,
        description: 'End-to-End master verification conference.',
        category: 'Technology',
        eventType: 'Conference',
        capacity: 500,
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        status: 'published'
      })
    });
    const createEvtData = await createEvtRes.json();
    assert(createEvtRes.status === 201, 'Organizer can create a new event (201 Created)');
    const testEventId = createEvtData.data?.event?._id;

    // Organizer assigns staff to event
    const assignStaffRes = await fetch(`${baseUrl}/api/events/${testEventId}/staff`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${orgToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ staffId: staffUser._id })
    });
    assert(assignStaffRes.status === 200, 'Organizer can assign staff to event (200 OK)');

    // Verify staff assignment in event
    const getStaffRes = await fetch(`${baseUrl}/api/events/${testEventId}/staff`, {
      headers: { 'Authorization': `Bearer ${orgToken}` }
    });
    const getStaffData = await getStaffRes.json();
    assert(getStaffRes.status === 200, 'Organizer can view staff assigned to event (200 OK)');
    assert(getStaffData.data?.staff?.some(s => s._id.toString() === staffUser._id.toString()), 'Assigned staff is present in event staff list');

    // =============================================================
    // ROLE 3: EVENT STAFF TESTS
    // =============================================================
    console.log('\n--- 3. EVENT STAFF TESTS ---');
    // Staff event access
    const staffEventsRes = await fetch(`${baseUrl}/api/events`, {
      headers: { 'Authorization': `Bearer ${staffToken}` }
    });
    const staffEventsData = await staffEventsRes.json();
    assert(staffEventsRes.status === 200, 'Staff can fetch assigned events (200 OK)');

    // Staff session dropdown data
    const sessionsRes = await fetch(`${baseUrl}/api/sessions?eventId=${testEventId}`, {
      headers: { 'Authorization': `Bearer ${staffToken}` }
    });
    assert(sessionsRes.status === 200, 'Staff can query sessions for assigned event (200 OK)');

    // Staff scanner access on assigned event (negative test for unassigned event)
    const otherEvent = await EventModel.findOne({ _id: { $ne: testEventId }, assignedStaff: { $ne: staffUser._id } });
    if (otherEvent) {
      const scanBlockedRes = await fetch(`${baseUrl}/api/attendance/scan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${staffToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qrToken: 'test_token',
          eventId: otherEvent._id
        })
      });
      assert(scanBlockedRes.status === 403, 'Staff is blocked with 403 Forbidden from scanning unassigned events');
    }

    // =============================================================
    // ROLE 4: SPEAKER TESTS
    // =============================================================
    console.log('\n--- 4. SPEAKER TESTS ---');
    // Speaker dashboard
    const speakerDashRes = await fetch(`${baseUrl}/api/speakers/me/dashboard`, {
      headers: { 'Authorization': `Bearer ${speakerToken}` }
    });
    const speakerDashData = await speakerDashRes.json();
    assert(speakerDashRes.status === 200, 'Speaker can access /api/speakers/me/dashboard (200 OK)');
    assert(speakerDashData.success === true, 'Speaker dashboard returns success: true');

    // Speaker profile
    const speakerProfileRes = await fetch(`${baseUrl}/api/speakers/me/profile`, {
      headers: { 'Authorization': `Bearer ${speakerToken}` }
    });
    assert(speakerProfileRes.status === 200, 'Speaker can access /api/speakers/me/profile (200 OK)');

    // =============================================================
    // ROLE 5: SPONSOR TESTS
    // =============================================================
    console.log('\n--- 5. SPONSOR TESTS ---');
    // Sponsor dashboard
    const sponsorDashRes = await fetch(`${baseUrl}/api/sponsors/me/dashboard`, {
      headers: { 'Authorization': `Bearer ${sponsorToken}` }
    });
    const sponsorDashData = await sponsorDashRes.json();
    assert(sponsorDashRes.status === 200, 'Sponsor can access /api/sponsors/me/dashboard (200 OK)');
    assert(sponsorDashData.success === true, 'Sponsor dashboard returns success: true');

    // Sponsor invoices
    const sponsorInvoicesRes = await fetch(`${baseUrl}/api/sponsors/me/invoices`, {
      headers: { 'Authorization': `Bearer ${sponsorToken}` }
    });
    assert(sponsorInvoicesRes.status === 200, 'Sponsor can fetch invoices (200 OK)');

    // Sponsor deliverables
    const sponsorDelivRes = await fetch(`${baseUrl}/api/sponsors/me/deliverables`, {
      headers: { 'Authorization': `Bearer ${sponsorToken}` }
    });
    assert(sponsorDelivRes.status === 200, 'Sponsor can fetch deliverables (200 OK)');

    // Sponsorship Packages Listing & Auto-provisioning
    const packagesRes = await fetch(`${baseUrl}/api/sponsorships/packages?eventId=${testEventId}`);
    const packagesData = await packagesRes.json();
    assert(packagesRes.status === 200, 'Public/Organizer can fetch sponsorship packages for event (200 OK)');
    assert(Array.isArray(packagesData.data?.packages) && packagesData.data.packages.length > 0, 'Sponsorship packages array returned with tiers');

    // Auto-provisioning packages for a fresh event
    const freshEvent = await EventModel.create({
      organizationId: orgUser.organizationId,
      organizerId: orgUser._id,
      title: 'Auto-Provision Test Event',
      description: 'Auto-provisioning test event description to verify sponsorship package tiers',
      eventType: 'Conference',
      category: 'Artificial Intelligence',
      venueId: (await EventModel.findOne()).venueId,
      startDate: new Date(Date.now() + 86400000 * 20),
      endDate: new Date(Date.now() + 86400000 * 22),
      registrationStart: new Date(Date.now() - 86400000),
      registrationEnd: new Date(Date.now() + 86400000 * 19),
      capacity: 100
    });
    const autoPkgRes = await fetch(`${baseUrl}/api/sponsorships/packages?eventId=${freshEvent._id}`);
    const autoPkgData = await autoPkgRes.json();
    assert(autoPkgRes.status === 200, 'Auto-provision endpoint returns 200 OK for event with 0 packages');
    assert(autoPkgData.data?.packages?.length === 4, 'Auto-provisioned 4 standard sponsorship packages (Platinum, Gold, Silver, Bronze)');

    // Sponsor Directory
    const sponsorsListRes = await fetch(`${baseUrl}/api/sponsors?eventId=${testEventId}`);
    const sponsorsListData = await sponsorsListRes.json();
    assert(sponsorsListRes.status === 200, 'Organizer can fetch event sponsors (200 OK)');
    assert(Array.isArray(sponsorsListData.data?.sponsors), 'Event sponsors array returned');

    // Register Corporate Sponsor
    const regSponsorRes = await fetch(`${baseUrl}/api/sponsors`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${orgToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventId: testEventId,
        companyName: 'Wipro Limited',
        contactPerson: 'Aditi Deshmukh',
        email: 'aditi.d@wipro.com',
        phone: '+91 98765 12345',
        packageId: packagesData.data.packages[0]._id,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/1200px-Wipro_Primary_Logo_Color_RGB.svg.png'
      })
    });
    assert(regSponsorRes.status === 201, 'Organizer can register a corporate sponsor (201 Created)');

    // =============================================================
    // ROLE 6: ATTENDEE TESTS & WORKFLOW
    // =============================================================
    console.log('\n--- 6. ATTENDEE TESTS & REGISTRATION WORKFLOW ---');
    // Attendee dashboard
    const attDashRes = await fetch(`${baseUrl}/api/attendee/dashboard`, {
      headers: { 'Authorization': `Bearer ${attendeeToken}` }
    });
    assert(attDashRes.status === 200, 'Attendee can access /api/attendee/dashboard (200 OK)');

    // Attendee registrations list
    const attRegsRes = await fetch(`${baseUrl}/api/attendee/registrations`, {
      headers: { 'Authorization': `Bearer ${attendeeToken}` }
    });
    assert(attRegsRes.status === 200, 'Attendee can fetch their registrations (200 OK)');

    // Create a free ticket for testEventId to register
    const freeTicket = await TicketModel.create({
      eventId: testEventId,
      name: 'General Admission',
      price: 0,
      quantity: 200,
      saleEnd: new Date(Date.now() + 86400000 * 30)
    });

    // Attendee registers for the event
    const registerRes = await fetch(`${baseUrl}/api/attendee/events/${testEventId}/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${attendeeToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticketId: freeTicket._id,
        quantity: 1
      })
    });
    const registerData = await registerRes.json();
    assert(registerRes.status === 201, 'Attendee can register for an event (201 Created)');
    const registrationId = registerData.data?.registration?._id;
    assert(Boolean(registrationId), 'Registration object created with valid ID');

    // Attendee tickets pass
    const ticketPassRes = await fetch(`${baseUrl}/api/attendee/tickets/${registrationId}`, {
      headers: { 'Authorization': `Bearer ${attendeeToken}` }
    });
    const ticketPassData = await ticketPassRes.json();
    assert(ticketPassRes.status === 200, 'Attendee can view ticket pass with QR token (200 OK)');
    const qrToken = ticketPassData.data?.qrToken;
    assert(Boolean(qrToken), 'Ticket pass contains valid non-empty qrToken');

    // =============================================================
    // CHECK-IN / QR WORKFLOW
    // =============================================================
    console.log('\n--- 7. CHECK-IN / QR VALIDATION WORKFLOW ---');
    // Staff scans attendee QR code
    const checkInRes = await fetch(`${baseUrl}/api/attendance/scan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${staffToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qrToken,
        eventId: testEventId
      })
    });
    const checkInData = await checkInRes.json();
    assert(checkInRes.status === 200, 'Staff successfully scans attendee QR code (200 OK)');
    assert(checkInData.data?.checkedIn === true, 'Registration checkedIn status set to true');

    // Duplicate check-in is rejected
    const dupCheckInRes = await fetch(`${baseUrl}/api/attendance/scan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${staffToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qrToken,
        eventId: testEventId
      })
    });
    assert(dupCheckInRes.status === 409 || dupCheckInRes.status === 400, 'Duplicate check-in scan is rejected with 409 Conflict');

    // Clean up created test event & ticket & registration
    await RegistrationModel.deleteMany({ eventId: testEventId });
    await TicketModel.deleteMany({ eventId: testEventId });
    await EventModel.findByIdAndDelete(testEventId);

    console.log('\n================================================================');
    console.log(` AUDIT RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%) `);
    console.log('================================================================\n');

    server.close();
    process.exit(passed === total ? 0 : 1);
  } catch (err) {
    console.error('Fatal test error:', err);
    server.close();
    process.exit(1);
  }
};

runMasterAuditTests();
