const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserModel = require('./models/UserModel');
const OrganizationModel = require('./models/OrganizationModel');
const EventModel = require('./models/EventModel');
const VenueModel = require('./models/VenueModel');
const SessionModel = require('./models/SessionModel');
const SpeakerModel = require('./models/SpeakerModel');
const SponsorModel = require('./models/SponsorModel');
const SponsorshipPackageModel = require('./models/SponsorshipPackageModel');
const SponsorshipModel = require('./models/SponsorshipModel');
const TicketModel = require('./models/TicketModel');
const RegistrationModel = require('./models/RegistrationModel');
const AttendanceModel = require('./models/AttendanceModel');
const AnnouncementModel = require('./models/AnnouncementModel');
const CouponModel = require('./models/CouponModel');
const FeedbackModel = require('./models/FeedbackModel');
const NotificationModel = require('./models/NotificationModel');

const { generateQRToken, createRegistrationQR } = require('./services/qrService');
const { ROLES, EVENT_STATUS, REGISTRATION_STATUS, ATTENDANCE_METHOD } = require('./utils/constants');

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventforge');
    console.log('Connected. Clearing existing collections...');

    await Promise.all([
      UserModel.deleteMany({}),
      OrganizationModel.deleteMany({}),
      EventModel.deleteMany({}),
      VenueModel.deleteMany({}),
      SessionModel.deleteMany({}),
      SpeakerModel.deleteMany({}),
      SponsorModel.deleteMany({}),
      SponsorshipPackageModel.deleteMany({}),
      SponsorshipModel.deleteMany({}),
      TicketModel.deleteMany({}),
      RegistrationModel.deleteMany({}),
      AttendanceModel.deleteMany({}),
      AnnouncementModel.deleteMany({}),
      CouponModel.deleteMany({}),
      FeedbackModel.deleteMany({}),
      NotificationModel.deleteMany({})
    ]);

    const defaultPassword = 'Password123!';

    // 1. Organizations
    console.log('Creating 2 Organizations...');
    const org1 = await OrganizationModel.create({
      name: 'Nexus Tech Summits',
      description: 'Global organizer of premier developer and AI conferences.',
      email: 'contact@nexussummits.io',
      phone: '+1 (555) 301-4490',
      subscriptionPlan: 'Enterprise',
      subscriptionStatus: 'active'
    });

    const org2 = await OrganizationModel.create({
      name: 'Apex Global Events',
      description: 'Leading producer of executive business and FinTech forums.',
      email: 'events@apexevents.com',
      phone: '+1 (555) 782-9912',
      subscriptionPlan: 'Pro',
      subscriptionStatus: 'active'
    });

    // 2. Platform Admin
    console.log('Creating 1 Platform Admin...');
    const adminUser = await UserModel.create({
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      password: defaultPassword,
      role: ROLES.ADMIN,
      phone: '+1 (555) 000-0001',
      interests: ['Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'Leadership']
    });

    // 3. Organizers
    console.log('Creating 3 Organizers...');
    const organizer1 = await UserModel.create({
      name: 'Elena Rostova',
      email: 'organizer@nexus.io',
      password: defaultPassword,
      role: ROLES.ORGANIZER,
      organizationId: org1._id,
      phone: '+1 (555) 100-0001'
    });

    const organizer2 = await UserModel.create({
      name: 'Marcus Sterling',
      email: 'organizer@apex.io',
      password: defaultPassword,
      role: ROLES.ORGANIZER,
      organizationId: org2._id,
      phone: '+1 (555) 100-0002'
    });

    const organizer3 = await UserModel.create({
      name: 'Sophia Chen',
      email: 'organizer3@nexus.io',
      password: defaultPassword,
      role: ROLES.ORGANIZER,
      organizationId: org1._id,
      phone: '+1 (555) 100-0003'
    });

    // 4. Staff Members (5)
    console.log('Creating 5 Staff members...');
    const staffMembers = [];
    const staffNames = ['David Kim', 'Jessica Patel', 'Carlos Mendoza', 'Amina Yusuf', 'Liam O Connor'];
    for (let i = 0; i < 5; i++) {
      const staff = await UserModel.create({
        name: staffNames[i],
        email: `staff${i + 1}@eventforge.io`,
        password: defaultPassword,
        role: ROLES.STAFF,
        organizationId: i % 2 === 0 ? org1._id : org2._id,
        phone: `+1 (555) 200-000${i + 1}`
      });
      staffMembers.push(staff);
    }

    // 5. Speakers (5)
    console.log('Creating 5 Speakers and Speaker profiles...');
    const speakerProfiles = [
      {
        name: 'Dr. Priya Sharma',
        designation: 'VP of AI Research',
        company: 'DeepNeural Labs',
        bio: 'Recognized innovator in autonomous agentic workflows, multi-modal reasoning models, and enterprise AI orchestration.',
        expertise: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
        socialLinks: { twitter: 'https://twitter.com/priyasharma', linkedin: 'https://linkedin.com/in/priyasharma' }
      },
      {
        name: 'Michael Vance',
        designation: 'Chief Cloud Architect',
        company: 'HyperScale Cloud',
        bio: 'Pioneered zero-downtime multi-region Kubernetes clusters handling over 500 million daily telemetry events.',
        expertise: ['Cloud Computing', 'DevOps', 'Distributed Systems'],
        socialLinks: { twitter: 'https://twitter.com/mvance', github: 'https://github.com/mvance' }
      },
      {
        name: 'Samantha Ray',
        designation: 'Chief Information Security Officer',
        company: 'CyberShield Global',
        bio: 'Keynote speaker on Zero Trust enterprise architectures, cloud workload defense, and proactive threat intelligence.',
        expertise: ['Cybersecurity', 'Zero Trust', 'Governance'],
        socialLinks: { linkedin: 'https://linkedin.com/in/samantharay' }
      },
      {
        name: 'Vikram Malhotra',
        designation: 'Head of Web Engineering',
        company: 'NextGen Interfaces',
        bio: 'Author of progressive web framework standards and micro-frontend patterns powering Fortune 100 portals.',
        expertise: ['Web Development', 'Frontend Architecture', 'Performance'],
        socialLinks: { github: 'https://github.com/vmalhotra' }
      },
      {
        name: 'Claire Beauchamp',
        designation: 'Managing Director & VC',
        company: 'Horizon Ventures',
        bio: 'Venture investor backing high-growth B2B enterprise software, developer infrastructure, and fintech innovations.',
        expertise: ['Business', 'Startups', 'Leadership'],
        socialLinks: { twitter: 'https://twitter.com/claireb', linkedin: 'https://linkedin.com/in/clairebeauchamp' }
      }
    ];

    const speakerDocs = [];
    for (let i = 0; i < speakerProfiles.length; i++) {
      const spData = speakerProfiles[i];
      const spUser = await UserModel.create({
        name: spData.name,
        email: `speaker${i + 1}@eventforge.io`,
        password: defaultPassword,
        role: ROLES.SPEAKER,
        organizationId: org1._id,
        interests: spData.expertise
      });

      const speakerDoc = await SpeakerModel.create({
        userId: spUser._id,
        organizationId: org1._id,
        name: spData.name,
        designation: spData.designation,
        company: spData.company,
        bio: spData.bio,
        expertise: spData.expertise,
        socialLinks: spData.socialLinks,
        availability: [
          { date: new Date('2026-10-15'), available: true },
          { date: new Date('2026-10-16'), available: true },
          { date: new Date('2026-10-17'), available: true }
        ]
      });
      speakerDocs.push(speakerDoc);
    }

    // 6. Sponsors (10)
    console.log('Creating 10 Corporate Sponsors...');
    const sponsorCompanies = [
      { name: 'Google Cloud', contact: 'Rachel Adams', email: 'cloud-events@google.com', website: 'https://cloud.google.com' },
      { name: 'Microsoft Azure', contact: 'James Wilson', email: 'azure-partner@microsoft.com', website: 'https://azure.microsoft.com' },
      { name: 'Amazon Web Services', contact: 'Tara Singh', email: 'aws-summits@amazon.com', website: 'https://aws.amazon.com' },
      { name: 'NVIDIA Corporation', contact: 'Leon Scott', email: 'enterprise@nvidia.com', website: 'https://nvidia.com' },
      { name: 'Snowflake', contact: 'Maria Garcia', email: 'sponsorships@snowflake.com', website: 'https://snowflake.com' },
      { name: 'Databricks', contact: 'Kevin Thorne', email: 'events@databricks.com', website: 'https://databricks.com' },
      { name: 'Stripe', contact: 'Chloe Dupont', email: 'growth@stripe.com', website: 'https://stripe.com' },
      { name: 'Twilio', contact: 'Daniel Lee', email: 'dev-relations@twilio.com', website: 'https://twilio.com' },
      { name: 'MongoDB Inc.', contact: 'Sunita Rao', email: 'partnerships@mongodb.com', website: 'https://mongodb.com' },
      { name: 'GitHub', contact: 'Peter Jackson', email: 'sponsors@github.com', website: 'https://github.com' }
    ];

    const sponsorUsers = [];
    for (let i = 0; i < sponsorCompanies.length; i++) {
      const sc = sponsorCompanies[i];
      const sUser = await UserModel.create({
        name: `${sc.name} Representative`,
        email: `sponsor${i + 1}@eventforge.io`,
        password: defaultPassword,
        role: ROLES.SPONSOR,
        organizationId: org1._id
      });
      sponsorUsers.push(sUser);
    }

    // 7. Attendees (30)
    console.log('Creating 30 Attendees with realistic interest profiles...');
    const attendeeInterestsList = [
      ['Artificial Intelligence', 'Data Science', 'Machine Learning'],
      ['Cloud Computing', 'DevOps', 'Microservices'],
      ['Cybersecurity', 'Zero Trust', 'Cloud Security'],
      ['Web Development', 'Frontend Architecture', 'JavaScript'],
      ['Business', 'Leadership', 'Startups'],
      ['Artificial Intelligence', 'Cloud Computing', 'DevOps'],
      ['Cybersecurity', 'Leadership', 'Business'],
      ['Web Development', 'Data Science', 'Startups']
    ];

    const attendeeDocs = [];
    for (let i = 1; i <= 30; i++) {
      const interests = attendeeInterestsList[i % attendeeInterestsList.length];
      const attendee = await UserModel.create({
        name: `Attendee User ${i}`,
        email: `attendee${i}@example.com`,
        password: defaultPassword,
        role: ROLES.ATTENDEE,
        interests
      });
      attendeeDocs.push(attendee);
    }

    // 8. Venues
    console.log('Creating Venues with Rooms...');
    const venue1 = await VenueModel.create({
      organizationId: org1._id,
      name: 'Silicon Horizon Convention Center',
      address: '77 Innovation Boulevard',
      city: 'San Francisco',
      capacity: 2500,
      rooms: [
        { name: 'Grand Keynote Hall', capacity: 1200, floor: '1st Floor', facilities: ['4K Video Wall', 'Simultaneous Translation', 'Stage Lighting'] },
        { name: 'Breakout Hall Alpha', capacity: 350, floor: '2nd Floor', facilities: ['Projector', 'Lapel Mics', 'Interactive Screens'] },
        { name: 'Breakout Hall Beta', capacity: 350, floor: '2nd Floor', facilities: ['Projector', 'Podium Mics'] },
        { name: 'Hands-on Lab 101', capacity: 120, floor: '3rd Floor', facilities: ['High-speed Ethernet', 'Power Outlets at Each Desk'] }
      ],
      facilities: ['High-speed Wi-Fi', 'VIP Lounge', 'Press Room', 'Catering Kitchen']
    });

    const venue2 = await VenueModel.create({
      organizationId: org2._id,
      name: 'Metropolitan Financial Summit Center',
      address: '100 Wall Street Plaza',
      city: 'New York',
      capacity: 1800,
      rooms: [
        { name: 'Plenary Auditorium', capacity: 900, floor: 'Ground Floor', facilities: ['Broadcast Studio', 'Concert Audio'] },
        { name: 'Executive Boardroom', capacity: 100, floor: '5th Floor', facilities: ['Teleconference Suite'] }
      ],
      facilities: ['Secure Access Escort', 'Underground Valet', 'Private Dining']
    });

    // 9. Events (5)
    console.log('Creating 5 Events...');
    const now = new Date();
    const dayMs = 86400000;

    const event1 = await EventModel.create({
      organizationId: org1._id,
      organizerId: organizer1._id,
      title: 'Global AI & Cloud Summit 2026',
      description: 'The premier worldwide conference uniting pioneering researchers, enterprise architects, and engineering leaders shaping generative AI, agentic systems, and hyperscale cloud infrastructure.',
      eventType: 'Conference',
      category: 'Artificial Intelligence',
      venueId: venue1._id,
      startDate: new Date(now.getTime() + 15 * dayMs),
      endDate: new Date(now.getTime() + 17 * dayMs),
      registrationStart: new Date(now.getTime() - 10 * dayMs),
      registrationEnd: new Date(now.getTime() + 14 * dayMs),
      capacity: 500,
      registrationRequired: true,
      status: EVENT_STATUS.PUBLISHED,
      tags: ['AI', 'Cloud', 'Machine Learning', 'DevOps', 'Agents']
    });

    const event2 = await EventModel.create({
      organizationId: org2._id,
      organizerId: organizer2._id,
      title: 'FinTech Horizons Conference 2026',
      description: 'Navigating next-generation algorithmic banking, cross-border digital assets, and AI fraud prevention frameworks in high-compliance financial markets.',
      eventType: 'Conference',
      category: 'Business',
      venueId: venue2._id,
      startDate: new Date(now.getTime() + 30 * dayMs),
      endDate: new Date(now.getTime() + 32 * dayMs),
      registrationStart: new Date(now.getTime() - 5 * dayMs),
      registrationEnd: new Date(now.getTime() + 29 * dayMs),
      capacity: 350,
      status: EVENT_STATUS.PUBLISHED,
      tags: ['FinTech', 'Banking', 'Cybersecurity', 'Compliance']
    });

    const event3 = await EventModel.create({
      organizationId: org1._id,
      organizerId: organizer1._id,
      title: 'DevOps World & Platform Engineering Expo',
      description: 'Hands-on developer congress focused on internal developer portals, automated CI/CD security gates, and Kubernetes platform engineering.',
      eventType: 'Exhibition',
      category: 'DevOps',
      venueId: venue1._id,
      startDate: new Date(now.getTime() - 1 * dayMs),
      endDate: new Date(now.getTime() + 2 * dayMs),
      registrationStart: new Date(now.getTime() - 30 * dayMs),
      registrationEnd: new Date(now.getTime() + 1 * dayMs),
      capacity: 400,
      status: EVENT_STATUS.ONGOING,
      tags: ['DevOps', 'Kubernetes', 'CI/CD', 'PlatformEngineering']
    });

    const event4 = await EventModel.create({
      organizationId: org1._id,
      organizerId: organizer3._id,
      title: 'CyberSec Enterprise Shield 2026',
      description: 'Strategic cybersecurity masterclass covering zero-trust perimeter defenses, AI-accelerated SOC operations, and incident response playbooks.',
      eventType: 'Seminar',
      category: 'Cybersecurity',
      venueId: venue1._id,
      startDate: new Date(now.getTime() + 45 * dayMs),
      endDate: new Date(now.getTime() + 46 * dayMs),
      registrationStart: new Date(now.getTime() + 5 * dayMs),
      registrationEnd: new Date(now.getTime() + 44 * dayMs),
      capacity: 250,
      status: EVENT_STATUS.DRAFT,
      tags: ['Cybersecurity', 'Zero Trust', 'ThreatIntelligence']
    });

    const event5 = await EventModel.create({
      organizationId: org1._id,
      organizerId: organizer1._id,
      title: 'Modern Web Architectures Forum',
      description: 'Retrospective and practical symposium exploring edge rendering, WebAssembly, and component design systems at international scale.',
      eventType: 'Workshop',
      category: 'Web Development',
      venueId: venue1._id,
      startDate: new Date(now.getTime() - 20 * dayMs),
      endDate: new Date(now.getTime() - 18 * dayMs),
      registrationStart: new Date(now.getTime() - 50 * dayMs),
      registrationEnd: new Date(now.getTime() - 21 * dayMs),
      capacity: 300,
      status: EVENT_STATUS.COMPLETED,
      tags: ['Web Development', 'React', 'Frontend', 'Edge']
    });

    // 10. Sponsorship Packages & Sponsors for Event 1
    console.log('Creating Sponsorship Packages and Assigning Sponsors...');
    const pkgPlatinum = await SponsorshipPackageModel.create({
      eventId: event1._id,
      name: 'Platinum Tier Partner',
      price: 25000,
      description: 'Maximum brand presence, opening keynote co-sponsorship, and prime 40x40 exhibition booth.',
      benefits: ['Opening Keynote Mention', 'Prime Booth Space', '20 All-Access VIP Passes', 'Logo on All Media'],
      availableSlots: 3,
      status: 'active'
    });

    const pkgGold = await SponsorshipPackageModel.create({
      eventId: event1._id,
      name: 'Gold Tier Partner',
      price: 15000,
      description: 'Featured break-out session sponsor and prominent placement on attendee swag bags.',
      benefits: ['Breakout Room Sponsor', '10 VIP Passes', 'Logo on Website & App'],
      availableSlots: 5,
      status: 'active'
    });

    const pkgSilver = await SponsorshipPackageModel.create({
      eventId: event1._id,
      name: 'Silver Tier Partner',
      price: 8000,
      description: 'Entry-level partner package with dedicated networking kiosk and directory listing.',
      benefits: ['Networking Kiosk', '5 Passes', 'Directory Profile'],
      availableSlots: 10,
      status: 'active'
    });

    const sponsorDocs = [];
    for (let i = 0; i < sponsorCompanies.length; i++) {
      const sc = sponsorCompanies[i];
      const pkg = i < 2 ? pkgPlatinum : (i < 5 ? pkgGold : pkgSilver);
      const sponsor = await SponsorModel.create({
        organizationId: org1._id,
        eventId: event1._id,
        userId: sponsorUsers[i]._id,
        companyName: sc.name,
        contactPerson: sc.contact,
        email: sc.email,
        website: sc.website,
        packageId: pkg._id,
        status: 'approved',
        brandAssets: [
          { name: `${sc.name} Vector Logo`, fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', assetType: 'logo' }
        ]
      });
      sponsorDocs.push(sponsor);

      await SponsorshipModel.create({
        sponsorId: sponsor._id,
        eventId: event1._id,
        packageId: pkg._id,
        deliverables: [
          { title: 'Brand Logo Upload on Portal', dueDate: new Date(now.getTime() + 5 * dayMs), status: 'completed', completedAt: new Date() },
          { title: 'Executive Speaker Bio Submission', dueDate: new Date(now.getTime() + 10 * dayMs), status: 'completed', completedAt: new Date() },
          { title: 'Exhibition Hall Booth Design Approval', dueDate: new Date(now.getTime() + 12 * dayMs), status: i % 2 === 0 ? 'completed' : 'in_progress' },
          { title: 'Swag Bag Collateral Delivery', dueDate: new Date(now.getTime() + 14 * dayMs), status: 'pending' }
        ],
        paymentStatus: 'paid',
        status: 'active'
      });
    }

    // 11. Tickets for Event 1
    console.log('Creating Tickets for Event 1...');
    const ticketVIP = await TicketModel.create({
      eventId: event1._id,
      name: 'VIP All-Access Pass',
      description: 'Includes reserved front-row seating, VIP lounge dining, and private speaker networking reception.',
      price: 599,
      quantity: 50,
      sold: 15,
      remaining: 35,
      saleStart: new Date(now.getTime() - 10 * dayMs),
      saleEnd: new Date(now.getTime() + 14 * dayMs),
      benefits: ['Front-row seating', 'VIP Lounge', 'Speaker Dinner', 'Full Video Recordings'],
      status: 'active'
    });

    const ticketStandard = await TicketModel.create({
      eventId: event1._id,
      name: 'Standard Conference Pass',
      description: 'Full access to all technical sessions, exhibitions, lunch, and networking floors.',
      price: 299,
      quantity: 300,
      sold: 25,
      remaining: 275,
      saleStart: new Date(now.getTime() - 10 * dayMs),
      saleEnd: new Date(now.getTime() + 14 * dayMs),
      benefits: ['All Keynotes', 'Expo Hall', 'Daily Lunch'],
      status: 'active'
    });

    const ticketStudent = await TicketModel.create({
      eventId: event1._id,
      name: 'Student & Academic Pass',
      description: 'Special discounted pass for full-time enrolled students and academic researchers.',
      price: 99,
      quantity: 50,
      sold: 5,
      remaining: 45,
      saleStart: new Date(now.getTime() - 10 * dayMs),
      saleEnd: new Date(now.getTime() + 14 * dayMs),
      benefits: ['Keynotes', 'Academic Track', 'Digital Certificate'],
      status: 'active'
    });

    // 12. Sessions for Event 1
    console.log('Creating Sessions for Event 1...');
    const event1Day1 = new Date(event1.startDate);
    const startH = (h, m = 0) => new Date(new Date(event1Day1).setHours(h, m, 0, 0));

    const session1 = await SessionModel.create({
      eventId: event1._id,
      venueId: venue1._id,
      roomId: 'room-keynote-1',
      roomName: 'Grand Keynote Hall',
      speakerId: speakerDocs[0]._id,
      title: 'Architecting Autonomous Multi-Agent Systems in Enterprise',
      description: 'Deconstructing autonomous tool-calling, agentic orchestration loops, and enterprise security guardrails.',
      category: 'Artificial Intelligence',
      startTime: startH(10, 0),
      endTime: startH(11, 15),
      capacity: 800,
      tags: ['AI', 'Agents', 'Enterprise']
    });

    const session2 = await SessionModel.create({
      eventId: event1._id,
      venueId: venue1._id,
      roomId: 'room-alpha-2',
      roomName: 'Breakout Hall Alpha',
      speakerId: speakerDocs[1]._id,
      title: 'Zero-Downtime Multi-Cloud Kubernetes Infrastructures',
      description: 'Deep-dive into multi-cluster service meshes, active-active cross-cloud failover, and automated cost optimization.',
      category: 'Cloud Computing',
      startTime: startH(11, 30),
      endTime: startH(12, 30),
      capacity: 350,
      tags: ['Cloud Computing', 'Kubernetes', 'DevOps']
    });

    const session3 = await SessionModel.create({
      eventId: event1._id,
      venueId: venue1._id,
      roomId: 'room-beta-3',
      roomName: 'Breakout Hall Beta',
      speakerId: speakerDocs[2]._id,
      title: 'Hardening Cloud Native Perimeters with Zero Trust Governance',
      description: 'Practical implementation of identity-first authorization, eBPF network observability, and continuous verification.',
      category: 'Cybersecurity',
      startTime: startH(13, 30),
      endTime: startH(14, 30),
      capacity: 350,
      tags: ['Cybersecurity', 'Zero Trust']
    });

    const session4 = await SessionModel.create({
      eventId: event1._id,
      venueId: venue1._id,
      roomId: 'room-lab-4',
      roomName: 'Hands-on Lab 101',
      speakerId: speakerDocs[3]._id,
      title: 'Building Real-time Collaborative Web Applications at Scale',
      description: 'Hands-on architectural patterns combining WebSockets, CRDTs, and edge caching for sub-50ms sync.',
      category: 'Web Development',
      startTime: startH(14, 45),
      endTime: startH(16, 0),
      capacity: 120,
      tags: ['Web Development', 'WebSockets', 'Frontend']
    });

    const session5 = await SessionModel.create({
      eventId: event1._id,
      venueId: venue1._id,
      roomId: 'room-keynote-1',
      roomName: 'Grand Keynote Hall',
      speakerId: speakerDocs[4]._id,
      title: 'Executive Roundtable: The Future of Venture-Backed Technology',
      description: 'High-level strategic insights on B2B software valuation multiples, developer tool traction, and market scaling.',
      category: 'Business',
      startTime: startH(16, 15),
      endTime: startH(17, 30),
      capacity: 600,
      tags: ['Business', 'Startups', 'Leadership']
    });

    // 13. Coupons
    console.log('Creating Coupons...');
    const coupon1 = await CouponModel.create({
      eventId: event1._id,
      code: 'TECHVIP20',
      discountType: 'percentage',
      discountValue: 20,
      maxUses: 100,
      usedCount: 8,
      expiryDate: new Date(now.getTime() + 30 * dayMs),
      isActive: true
    });

    const coupon2 = await CouponModel.create({
      eventId: event1._id,
      code: 'EARLY50',
      discountType: 'fixed',
      discountValue: 50,
      maxUses: 50,
      usedCount: 5,
      expiryDate: new Date(now.getTime() + 10 * dayMs),
      isActive: true
    });

    // 14. Registrations, QR Tokens & Attendance
    console.log('Registering attendees and generating QR codes...');
    for (let i = 0; i < 25; i++) {
      const attendee = attendeeDocs[i];
      const ticket = i < 5 ? ticketVIP : (i < 20 ? ticketStandard : ticketStudent);
      const regNum = `EF-2026-${1000 + i}`;
      const qrToken = generateQRToken(regNum, event1._id, attendee._id);
      const qrCodeUrl = await createRegistrationQR(qrToken, regNum, event1.title);

      const isCheckedIn = i < 12;
      const checkInTime = isCheckedIn ? new Date(now.getTime() - Math.floor(Math.random() * 3600000)) : null;

      await RegistrationModel.create({
        eventId: event1._id,
        attendeeId: attendee._id,
        ticketId: ticket._id,
        registrationNumber: regNum,
        status: REGISTRATION_STATUS.CONFIRMED,
        paymentStatus: 'paid',
        couponId: i % 3 === 0 ? coupon1._id : null,
        finalAmount: i % 3 === 0 ? ticket.price * 0.8 : ticket.price,
        qrToken,
        qrCodeUrl,
        selectedSessions: [session1._id, session2._id],
        checkedIn: isCheckedIn,
        checkedInAt: checkInTime
      });

      if (isCheckedIn) {
        await AttendanceModel.create({
          eventId: event1._id,
          sessionId: null,
          attendeeId: attendee._id,
          checkedInAt: checkInTime,
          method: ATTENDANCE_METHOD.QR,
          checkedInBy: staffMembers[0]._id
        });

        if (i < 8) {
          await AttendanceModel.create({
            eventId: event1._id,
            sessionId: session1._id,
            attendeeId: attendee._id,
            checkedInAt: checkInTime,
            method: ATTENDANCE_METHOD.QR,
            checkedInBy: staffMembers[1]._id
          });
        }
      }
    }

    // 3 Waitlisted attendees
    console.log('Adding 3 attendees to waitlist...');
    for (let i = 25; i < 28; i++) {
      const attendee = attendeeDocs[i];
      const regNum = `EF-2026-${1000 + i}`;
      const qrToken = generateQRToken(regNum, event1._id, attendee._id);
      const qrCodeUrl = await createRegistrationQR(qrToken, regNum, event1.title);

      await RegistrationModel.create({
        eventId: event1._id,
        attendeeId: attendee._id,
        ticketId: ticketStandard._id,
        registrationNumber: regNum,
        status: REGISTRATION_STATUS.WAITLISTED,
        paymentStatus: 'pending',
        finalAmount: ticketStandard.price,
        qrToken,
        qrCodeUrl
      });
    }

    // 2 Cancelled attendees
    for (let i = 28; i < 30; i++) {
      const attendee = attendeeDocs[i];
      const regNum = `EF-2026-${1000 + i}`;
      const qrToken = generateQRToken(regNum, event1._id, attendee._id);
      const qrCodeUrl = await createRegistrationQR(qrToken, regNum, event1.title);

      await RegistrationModel.create({
        eventId: event1._id,
        attendeeId: attendee._id,
        ticketId: ticketStandard._id,
        registrationNumber: regNum,
        status: REGISTRATION_STATUS.CANCELLED,
        paymentStatus: 'refunded',
        finalAmount: ticketStandard.price,
        qrToken,
        qrCodeUrl
      });
    }

    // 15. Announcements
    console.log('Publishing Announcements...');
    await AnnouncementModel.create({
      eventId: event1._id,
      title: 'Welcome to Global AI & Cloud Summit 2026!',
      message: 'Registration desk opens at 8:00 AM in the North Entrance. Please present your digital QR code for rapid check-in.',
      type: 'general',
      createdBy: organizer1._id
    });

    await AnnouncementModel.create({
      eventId: event1._id,
      title: 'Room Allocation: Keynote Hall Capacity Expanded',
      message: 'Due to overwhelming interest, the keynote session has been expanded with overflow livestream screens in Breakout Hall Beta.',
      type: 'venue',
      createdBy: organizer1._id
    });

    await AnnouncementModel.create({
      eventId: event1._id,
      title: 'VIP Executive Luncheon at 12:30 PM',
      message: 'VIP Pass holders are cordially invited to the 5th Floor Skylight Terrace for the networking lunch.',
      type: 'session',
      createdBy: organizer1._id
    });

    // 16. Feedback
    console.log('Adding attendee feedback...');
    const sampleFeedback = [
      { rating: 5, comment: 'Exceptional keynote! The live agentic orchestration demo blew my mind.' },
      { rating: 5, comment: 'Seamless QR check-in process at the entrance, took less than 3 seconds!' },
      { rating: 4, comment: 'Great breakout sessions. Audio quality in Breakout Beta was crisp.' },
      { rating: 5, comment: 'The speaker lineup this year is truly world-class.' },
      { rating: 4, comment: 'High-quality technical content and generous sponsor giveaways.' }
    ];

    for (let i = 0; i < sampleFeedback.length; i++) {
      await FeedbackModel.create({
        eventId: event1._id,
        sessionId: i % 2 === 0 ? session1._id : session2._id,
        attendeeId: attendeeDocs[i]._id,
        rating: sampleFeedback[i].rating,
        comment: sampleFeedback[i].comment
      });
    }

    // 17. Notifications
    console.log('Sending Initial Notifications...');
    await NotificationModel.create({
      userId: organizer1._id,
      eventId: event1._id,
      title: 'High Registration Velocity',
      message: 'Event "Global AI & Cloud Summit 2026" has surpassed 80% confirmed capacity.',
      type: 'alert'
    });

    await NotificationModel.create({
      userId: attendeeDocs[0]._id,
      eventId: event1._id,
      title: 'Badge Ready for Check-in',
      message: 'Your VIP badge and QR code are ready in your EventForge dashboard.',
      type: 'info'
    });

    console.log('====================================================');
    console.log('  EventForge Database Seed Completed Successfully!  ');
    console.log('====================================================');
    console.log('Test Credentials:');
    console.log('  Platform Admin : mvishnuvardhanreddy33@gmail.com / Password123!');
    console.log('  Organizer      : organizer@nexus.io     / Password123!');
    console.log('  Organizer (2)  : organizer@apex.io      / Password123!');
    console.log('  Event Staff    : staff1@eventforge.io   / Password123!');
    console.log('  Speaker        : speaker1@eventforge.io / Password123!');
    console.log('  Sponsor        : sponsor1@eventforge.io / Password123!');
    console.log('  Attendee       : attendee1@example.com  / Password123!');
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Database seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
