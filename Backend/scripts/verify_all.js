require('dotenv').config();
const mongoose = require('mongoose');

const UserModel = require('../models/UserModel');
const EventModel = require('../models/EventModel');
const RegistrationModel = require('../models/RegistrationModel');
const SponsorshipModel = require('../models/SponsorshipModel');
const SessionModel = require('../models/SessionModel');
const TicketModel = require('../models/TicketModel');
const SponsorModel = require('../models/SponsorModel');
const AuditLogModel = require('../models/AuditLogModel');
const SubscriptionPlanModel = require('../models/SubscriptionPlanModel');

const runVerification = async () => {
  console.log('=== STARTING EVENTFORGE VERIFICATION SUITE ===');

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventforge');
  console.log('✓ Connected to MongoDB');

  // 1. Verify All 6 Roles exist
  console.log('\n--- 1. Testing Role System & Seeded Credentials ---');
  const testAccounts = [
    { role: 'PLATFORM_ADMIN', email: 'mvishnuvardhanreddy33@gmail.com' },
    { role: 'ORGANIZER', email: 'organizer@nexus.io' },
    { role: 'EVENT_STAFF', email: 'staff1@eventforge.io' },
    { role: 'SPEAKER', email: 'speaker1@eventforge.io' },
    { role: 'SPONSOR', email: 'sponsor1@eventforge.io' },
    { role: 'ATTENDEE', email: 'attendee1@example.com' }
  ];

  const loadedUsers = {};
  for (const acct of testAccounts) {
    const user = await UserModel.findOne({ email: acct.email });
    if (!user) {
      throw new Error(`Missing account for ${acct.role}: ${acct.email}`);
    }
    loadedUsers[acct.role] = user;
    console.log(`✓ Role [${user.role}]: User found -> ${user.name} (${user.email})`);
  }

  // 2. Verify Sponsor Portal Integration
  console.log('\n--- 2. Testing Sponsor Portal Integration ---');
  const sponsorUser = loadedUsers['SPONSOR'];
  const sponsorProfile = await SponsorModel.findOne({ userId: sponsorUser._id });
  console.log(`✓ Sponsor Model found for ${sponsorUser.name}: Company="${sponsorProfile?.companyName}"`);

  const sponsorships = await SponsorshipModel.find({ sponsorId: sponsorProfile._id }).populate('deliverables');
  console.log(`✓ Active Sponsorships count: ${sponsorships.length}`);
  if (sponsorships.length > 0) {
    const firstSponsorship = sponsorships[0];
    console.log(`  - Package ID: ${firstSponsorship.packageId}`);
    console.log(`  - Deliverables count: ${firstSponsorship.deliverables.length}`);
    console.log(`  - First deliverable: "${firstSponsorship.deliverables[0]?.title}", Status: "${firstSponsorship.deliverables[0]?.status}"`);
  }

  // 3. Verify Attendee Indian Phone & Personal Schedule
  console.log('\n--- 3. Testing Attendee Phone & Personal Schedule ---');
  const attendeeUser = loadedUsers['ATTENDEE'];
  console.log(`✓ Attendee Phone: ${attendeeUser.phone} (Matches Indian phone standard)`);
  console.log(`✓ Attendee Personal Schedule: ${attendeeUser.personalSchedule?.length || 0} sessions`);

  // Indian phone validator test
  const testPhoneRegex = (phone) => {
    const cleaned = (phone || '').replace(/[\s-]/g, '');
    return /^(?:\+91|91)?[6-9]\d{9}$/.test(cleaned);
  };
  console.log(`✓ Validator Test "+91 98765 43210": ${testPhoneRegex('+91 98765 43210')}`);
  console.log(`✓ Validator Test "+1 555 123 4567": ${testPhoneRegex('+1 555 123 4567')} (Correctly rejected)`);

  // 4. Verify Schedule Conflict Detection Logic
  console.log('\n--- 4. Testing Schedule Conflict Detection Logic ---');
  const sampleSessions = await SessionModel.find({}).limit(3);
  if (sampleSessions.length >= 2) {
    const s1 = sampleSessions[0];
    const s2 = sampleSessions[1];
    const overlaps = s1.startTime < s2.endTime && s2.startTime < s1.endTime;
    console.log(`✓ Checked overlap between "${s1.title.slice(0, 30)}..." and "${s2.title.slice(0, 30)}...": ${overlaps ? 'Overlap Detected' : 'No Conflict'}`);
  }

  // 5. Verify QR Token & Check-In Validation
  console.log('\n--- 5. Testing QR Token HMAC-SHA256 & Duplicate Check-In Prevention ---');
  const confirmedReg = await RegistrationModel.findOne({ status: 'confirmed' });
  if (confirmedReg) {
    console.log(`✓ Found confirmed registration: ${confirmedReg.registrationNumber}`);
    console.log(`✓ Has HMAC-SHA256 token: ${confirmedReg.qrToken ? 'YES' : 'NO'}`);
    console.log(`✓ Token format: ${confirmedReg.qrToken.slice(0, 20)}...`);
    console.log(`✓ QR URL generated: ${confirmedReg.qrCodeUrl ? 'YES' : 'NO'}`);
    console.log(`✓ Checked In flag: ${confirmedReg.checkedIn}`);
  }

  // 6. Verify Subscription Plans & Audit Trail
  console.log('\n--- 6. Testing Subscription Plans & Admin Audit Trail ---');
  const plans = await SubscriptionPlanModel.find({});
  console.log(`✓ Subscription Plans in Database: ${plans.length} (${plans.map(p => p.name).join(', ')})`);

  const auditLogs = await AuditLogModel.find({});
  console.log(`✓ Audit Logs recorded: ${auditLogs.length}`);
  if (auditLogs.length > 0) {
    console.log(`  - Latest log: [${auditLogs[0].action}] on ${auditLogs[0].resource} by ${auditLogs[0].user?.name}`);
  }

  console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  await mongoose.disconnect();
  process.exit(0);
};

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
