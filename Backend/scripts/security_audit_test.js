require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { app } = require('../server');

const runSecurityTests = async () => {
  console.log('\n======================================================');
  console.log('    EVENTFORGE ENTERPRISE SECURITY AUDIT TEST SUITE   ');
  console.log('======================================================\n');

  // Start ephemeral server
  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[SETUP] Ephemeral test server listening on ${baseUrl}`);

  let passedTests = 0;
  let totalTests = 0;

  const assert = (condition, title, details = '') => {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✓ PASS: ${title}`);
    } else {
      console.error(`  ✗ FAIL: ${title} -> ${details}`);
    }
  };

  try {
    // ---------------------------------------------------------
    // TEST 1: Helmet Security Headers & CORS
    // ---------------------------------------------------------
    console.log('\n--- 1. Testing Security Headers & CORS ---');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');
    
    const nosniff = healthRes.headers.get('x-content-type-options');
    assert(nosniff === 'nosniff', 'Header X-Content-Type-Options is "nosniff"', `got: ${nosniff}`);

    const csp = healthRes.headers.get('content-security-policy');
    assert(!!csp && csp.includes("default-src 'self'"), 'Content-Security-Policy is enforced', `got: ${csp?.slice(0, 40)}...`);

    const rateLimitHeader = healthRes.headers.get('ratelimit-limit') || healthRes.headers.get('x-ratelimit-limit');
    assert(!!rateLimitHeader, 'Rate limiting headers are returned on API routes');

    // ---------------------------------------------------------
    // TEST 2: Privilege Escalation Prevention in Registration
    // ---------------------------------------------------------
    console.log('\n--- 2. Testing Privilege Escalation Prevention ---');
    
    // Attacker sends role: 'admin'
    const adminRegRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker Admin',
        email: `hacker_admin_${Date.now()}@exploit.com`,
        password: 'Password123!',
        role: 'admin'
      })
    });
    const adminRegData = await adminRegRes.json();
    assert(adminRegRes.status === 403, 'Attempting to self-register as "admin" returns 403 Forbidden', `got status: ${adminRegRes.status}`);
    assert(adminRegData.error?.code === 'FORBIDDEN_ROLE_REGISTRATION', 'Returns code FORBIDDEN_ROLE_REGISTRATION');

    // Attacker sends role: 'staff'
    const staffRegRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker Staff',
        email: `hacker_staff_${Date.now()}@exploit.com`,
        password: 'Password123!',
        role: 'staff'
      })
    });
    const staffRegData = await staffRegRes.json();
    assert(staffRegRes.status === 403, 'Attempting to self-register as "staff" returns 403 Forbidden', `got status: ${staffRegRes.status}`);

    // ---------------------------------------------------------
    // TEST 3: Password Complexity Policy Enforcement
    // ---------------------------------------------------------
    console.log('\n--- 3. Testing Strong Password Policy ---');
    
    const weakPassRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Weak Pass User',
        email: `weak_user_${Date.now()}@example.com`,
        password: 'password', // Missing uppercase and number
        role: 'attendee'
      })
    });
    const weakPassData = await weakPassRes.json();
    assert(weakPassRes.status === 400, 'Weak password without uppercase/numbers is rejected with 400 Bad Request', `got status: ${weakPassRes.status}`);
    assert(weakPassData.error?.code === 'WEAK_PASSWORD', 'Returns code WEAK_PASSWORD');

    // ---------------------------------------------------------
    // TEST 4: Malformed ObjectId / NoSQL CastError Shield
    // ---------------------------------------------------------
    console.log('\n--- 4. Testing ObjectId Validation Middleware ---');
    
    const badEventIdRes = await fetch(`${baseUrl}/api/events/invalid-event-id-format`);
    const badEventIdData = await badEventIdRes.json();
    assert(badEventIdRes.status === 400, 'Malformed eventId parameter returns clean 400 Bad Request', `got status: ${badEventIdRes.status}`);
    assert(badEventIdData.error?.code === 'INVALID_OBJECT_ID', 'Returns code INVALID_OBJECT_ID without database stack trace');

    const badTicketIdRes = await fetch(`${baseUrl}/api/tickets/non-hex-id-9999`);
    assert(badTicketIdRes.status === 400, 'Malformed ticketId parameter returns clean 400 Bad Request', `got status: ${badTicketIdRes.status}`);

    const badSessionIdRes = await fetch(`${baseUrl}/api/sessions/invalid-session-hex`);
    assert(badSessionIdRes.status === 400, 'Malformed sessionId parameter returns clean 400 Bad Request', `got status: ${badSessionIdRes.status}`);

    // ---------------------------------------------------------
    // TEST 5: RBAC Role Separation & Endpoint Access
    // ---------------------------------------------------------
    console.log('\n--- 5. Testing RBAC Role Separation ---');

    // Login as Attendee
    const attendeeLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'attendee1@example.com',
        password: 'Password123!'
      })
    });
    const attendeeLoginData = await attendeeLoginRes.json();
    const attendeeToken = attendeeLoginData.data?.token;
    assert(attendeeLoginRes.status === 200 && !!attendeeToken, 'Attendee login succeeds with JWT');

    // Attendee attempting to access organization management
    const attendeeOrgRes = await fetch(`${baseUrl}/api/organizations`, {
      headers: { 'Authorization': `Bearer ${attendeeToken}` }
    });
    assert(attendeeOrgRes.status === 403, 'Attendee cannot access /api/organizations (403 Forbidden)', `got status: ${attendeeOrgRes.status}`);

    // Attendee attempting to create ticket
    const attendeeTicketRes = await fetch(`${baseUrl}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${attendeeToken}`
      },
      body: JSON.stringify({
        eventId: new mongoose.Types.ObjectId(),
        name: 'Illegal Tier',
        price: 100,
        quantity: 50,
        saleEnd: new Date()
      })
    });
    assert(attendeeTicketRes.status === 403, 'Attendee cannot create ticket tiers (403 Forbidden)', `got status: ${attendeeTicketRes.status}`);

    // Attendee attempting to access staff check-in scanner
    const attendeeScanRes = await fetch(`${baseUrl}/api/attendance/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${attendeeToken}`
      },
      body: JSON.stringify({
        qrToken: 'FAKE_QR',
        eventId: new mongoose.Types.ObjectId().toString()
      })
    });
    assert(attendeeScanRes.status === 403, 'Attendee cannot execute staff QR check-in (403 Forbidden)', `got status: ${attendeeScanRes.status}`);

    // ---------------------------------------------------------
    // TEST 6: Sensitive Fields Protection
    // ---------------------------------------------------------
    console.log('\n--- 6. Testing Sensitive Field Masking ---');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${attendeeToken}` }
    });
    const meData = await meRes.json();
    assert(meData.data?.user?.password === undefined, 'User object does NOT leak password hash in API response');
    assert(meData.data?.user?.__v === undefined, 'Internal Mongoose __v field is stripped from user response');

    // ---------------------------------------------------------
    // TEST 7: Cross-Tenant IDOR Protection
    // ---------------------------------------------------------
    console.log('\n--- 7. Testing Cross-Tenant IDOR Protection ---');

    // Login as Organizer
    const orgLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'organizer@nexus.io',
        password: 'Password123!'
      })
    });
    const orgLoginData = await orgLoginRes.json();
    const orgToken = orgLoginData.data?.token;
    assert(orgLoginRes.status === 200 && !!orgToken, 'Organizer login succeeds with JWT');

    // Organizer attempts to create a ticket on an unrelated event ID
    const randomEventId = new mongoose.Types.ObjectId().toString();
    const idorTicketRes = await fetch(`${baseUrl}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${orgToken}`
      },
      body: JSON.stringify({
        eventId: randomEventId,
        name: 'IDOR Tier',
        price: 999,
        quantity: 10,
        saleEnd: new Date()
      })
    });
    assert(idorTicketRes.status === 404 || idorTicketRes.status === 403, 'Organizer cannot inject tickets into non-existent or foreign event', `got: ${idorTicketRes.status}`);

    // Organizer attempts to create coupon on random foreign event
    const idorCouponRes = await fetch(`${baseUrl}/api/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${orgToken}`
      },
      body: JSON.stringify({
        eventId: randomEventId,
        code: 'IDORCODE',
        discountType: 'percentage',
        discountValue: 50,
        expiryDate: new Date(Date.now() + 86400000)
      })
    });
    assert(idorCouponRes.status === 404 || idorCouponRes.status === 403, 'Organizer cannot inject coupons into foreign event', `got: ${idorCouponRes.status}`);

    // ---------------------------------------------------------
    // TEST 8: Staff QR Scan Isolation
    // ---------------------------------------------------------
    console.log('\n--- 8. Testing Staff QR Scan Isolation ---');

    // Login as Staff
    const staffLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'staff1@eventforge.io',
        password: 'Password123!'
      })
    });
    const staffLoginData = await staffLoginRes.json();
    const staffToken = staffLoginData.data?.token;
    assert(staffLoginRes.status === 200 && !!staffToken, 'Staff login succeeds with JWT');

    // Staff attempts to scan QR for an event that does not exist or belongs to another organization
    const staffScanRes = await fetch(`${baseUrl}/api/attendance/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        qrToken: 'FAKE_QR_TOKEN_123',
        eventId: randomEventId
      })
    });
    assert(staffScanRes.status === 404 || staffScanRes.status === 403, 'Staff check-in on foreign/non-existent event is rejected', `got: ${staffScanRes.status}`);

    console.log('\n======================================================');
    console.log(`TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('Fatal test error:', err);
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(passedTests === totalTests ? 0 : 1);
  }
};

runSecurityTests();
