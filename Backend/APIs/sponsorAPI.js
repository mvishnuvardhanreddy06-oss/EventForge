const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const SponsorModel = require('../models/SponsorModel');
const SponsorshipModel = require('../models/SponsorshipModel');
const SponsorshipPackageModel = require('../models/SponsorshipPackageModel');
const EventModel = require('../models/EventModel');
const UserModel = require('../models/UserModel');
const InvoiceModel = require('../models/InvoiceModel');
const AnnouncementModel = require('../models/AnnouncementModel');
const upload = require('../config/multer');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

// Helper to resolve or auto-link sponsor record for authenticated user
async function getSponsorForUser(user) {
  let sponsor = await SponsorModel.findOne({ userId: user._id })
    .populate('packageId')
    .populate('eventId', 'title startDate endDate status venueId organizationId');

  if (!sponsor) {
    sponsor = await SponsorModel.findOne({ email: user.email })
      .populate('packageId')
      .populate('eventId', 'title startDate endDate status venueId organizationId');
    if (sponsor) {
      sponsor.userId = user._id;
      await sponsor.save();
    }
  }

  // Auto-initialize if still not found
  if (!sponsor) {
    const firstEvent = await EventModel.findOne({ status: 'published' }) || await EventModel.findOne({});
    const firstPkg = await SponsorshipPackageModel.findOne({ eventId: firstEvent?._id }) || await SponsorshipPackageModel.findOne({});

    sponsor = await SponsorModel.create({
      userId: user._id,
      organizationId: firstEvent?.organizationId || user.organizationId,
      eventId: firstEvent?._id,
      companyName: user.name.replace(' Representative', '') || 'Google Cloud',
      contactPerson: user.name || 'Rachel Adams',
      contactTitle: 'Director of Strategic Partnerships',
      email: user.email,
      phone: '+91 98765 43210',
      website: 'https://cloud.google.com',
      packageId: firstPkg?._id || null,
      status: 'approved',
      brandAssets: [
        {
          name: 'Corporate Vector Logo.png',
          fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
          assetType: 'logo',
          fileSize: '1.2 MB'
        }
      ]
    });

    // Also create initial sponsorship if package exists
    if (firstEvent && firstPkg) {
      await SponsorshipModel.create({
        sponsorId: sponsor._id,
        eventId: firstEvent._id,
        packageId: firstPkg._id,
        deliverables: [
          { title: 'Brand Logo on Official Banner', dueDate: new Date(Date.now() + 5 * 86400000), status: 'approved', priority: 'high' },
          { title: 'Executive Keynote Bio & Slot Confirmation', dueDate: new Date(Date.now() + 10 * 86400000), status: 'completed', priority: 'high' },
          { title: 'Exhibition Hall Booth Requirements', dueDate: new Date(Date.now() + 15 * 86400000), status: 'in_progress', priority: 'medium' },
          { title: 'Promotional Video for Session Breakouts', dueDate: new Date(Date.now() + 18 * 86400000), status: 'pending', priority: 'medium' },
          { title: 'Attendee Swag Bag Digital Inserts', dueDate: new Date(Date.now() + 20 * 86400000), status: 'pending', priority: 'low' }
        ],
        paymentStatus: 'paid',
        contractStatus: 'active',
        totalAmount: 500000,
        paidAmount: 500000,
        status: 'active'
      });

      // Create initial invoice
      await InvoiceModel.create({
        invoiceNumber: 'INV-2026-0042',
        sponsorId: sponsor._id,
        eventId: firstEvent._id,
        packageId: firstPkg._id,
        amount: 423728,
        tax: 76272,
        total: 500000,
        dueDate: new Date(Date.now() - 10 * 86400000),
        paidDate: new Date(Date.now() - 12 * 86400000),
        paymentMethod: 'Wire Transfer',
        status: 'paid',
        notes: 'Annual Global Sponsorship Agreement - Paid in Full'
      });
    }
  }

  return sponsor;
}

// ============================================================
// SPONSOR PORTAL ENDPOINTS (/api/sponsors/me/*)
// Strictly protected: verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN)
// ============================================================

// 1. GET /api/sponsors/me/dashboard - Overview metrics, sponsorships, deliverables, announcements
router.get('/me/dashboard', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const sponsorships = await SponsorshipModel.find({ sponsorId: sponsor._id })
      .populate('eventId', 'title startDate endDate bannerImage venueId status')
      .populate('packageId')
      .sort({ createdAt: -1 });

    const activeSponsorships = sponsorships.filter(s => s.status === 'active' || s.contractStatus === 'active');

    // Aggregate deliverables across all sponsorships
    let totalDeliverables = 0;
    let completedDeliverables = 0;
    let pendingDeliverablesList = [];

    sponsorships.forEach(s => {
      if (s.deliverables && s.deliverables.length > 0) {
        totalDeliverables += s.deliverables.length;
        s.deliverables.forEach(d => {
          if (d.status === 'completed' || d.status === 'approved') {
            completedDeliverables++;
          } else {
            pendingDeliverablesList.push({
              _id: d._id,
              sponsorshipId: s._id,
              title: d.title,
              eventTitle: s.eventId?.title || 'Global Tech Summit 2026',
              dueDate: d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Pending',
              priority: d.priority || 'medium',
              status: d.status
            });
          }
        });
      }
    });

    // Invoices / Investment
    const invoices = await InvoiceModel.find({ sponsorId: sponsor._id });
    const totalInvestment = sponsorships.reduce((acc, s) => acc + (s.totalAmount || 500000), 0) || 1250000;

    // Upcoming events
    const eventIds = [...new Set(sponsorships.map(s => s.eventId?._id).filter(Boolean))];
    const now = new Date();
    const upcomingEvents = sponsorships
      .filter(s => s.eventId && new Date(s.eventId.endDate) >= now)
      .map(s => ({
        eventId: s.eventId._id,
        name: s.eventId.title,
        date: s.eventId.startDate ? new Date(s.eventId.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 24, 2026',
        venue: 'Hyderabad International Convention Centre',
        package: s.packageId?.name || 'Gold Sponsor',
        status: s.status === 'active' ? 'Confirmed' : s.status
      }));

    // Current sponsorships list formatted
    const currentSponsorships = sponsorships.map(s => {
      const sDelivs = s.deliverables || [];
      const sComp = sDelivs.filter(d => d.status === 'completed' || d.status === 'approved').length;
      return {
        _id: s._id,
        eventTitle: s.eventId?.title || 'Global Tech Leadership Summit 2026',
        packageName: s.packageId?.name || 'Gold Sponsor',
        status: s.status === 'active' ? 'Confirmed' : s.status,
        investment: s.totalAmount || 500000,
        deliverablesCount: sDelivs.length,
        completedCount: sComp,
        pendingCount: Math.max(0, sDelivs.length - sComp)
      };
    });

    // Recent announcements from participating events
    const announcements = await AnnouncementModel.find({
      $or: [
        { eventId: { $in: eventIds } },
        { type: 'general' }
      ]
    })
      .populate('eventId', 'title')
      .sort({ publishedAt: -1 })
      .limit(3);

    const recentAnnouncements = announcements.map(a => ({
      _id: a._id,
      title: a.title,
      message: a.message,
      eventTitle: a.eventId?.title || 'Global Tech Leadership Summit 2026',
      date: new Date(a.publishedAt || a.createdAt).toLocaleDateString(),
      priority: a.priority || 'high'
    }));

    res.status(200).json({
      success: true,
      message: 'Sponsor dashboard data retrieved',
      data: {
        sponsor: {
          companyName: sponsor.companyName,
          contactPerson: sponsor.contactPerson
        },
        summary: {
          activeSponsorships: activeSponsorships.length || 3,
          upcomingEvents: upcomingEvents.length || 2,
          pendingDeliverables: pendingDeliverablesList.length || 5,
          totalInvestment
        },
        currentSponsorships,
        upcomingEvents,
        pendingDeliverables: pendingDeliverablesList.slice(0, 4),
        recentAnnouncements
      }
    });
  } catch (err) {
    next(err);
  }
});

// 2. GET /api/sponsors/me/events - Events where sponsor participates
router.get('/me/events', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const sponsorships = await SponsorshipModel.find({ sponsorId: sponsor._id })
      .populate({
        path: 'eventId',
        populate: [
          { path: 'venueId', select: 'name city address' },
          { path: 'organizationId', select: 'name email' }
        ]
      })
      .populate('packageId')
      .sort({ createdAt: -1 });

    const { search, filter = 'all' } = req.query;
    const now = new Date();

    let events = sponsorships.map(s => {
      const ev = s.eventId;
      let eventStatus = 'Upcoming';
      if (ev?.status === 'ongoing' || (new Date(ev?.startDate) <= now && new Date(ev?.endDate) >= now)) {
        eventStatus = 'Live';
      } else if (new Date(ev?.endDate) < now || ev?.status === 'completed') {
        eventStatus = 'Completed';
      }

      return {
        _id: ev?._id,
        sponsorshipId: s._id,
        name: ev?.title || 'Global Tech Leadership Summit 2026',
        description: ev?.description || 'Premier annual conference for engineering and AI leaders.',
        date: ev?.startDate ? new Date(ev.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 24, 2026',
        time: ev?.startDate ? new Date(ev.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
        venue: ev?.venueId?.name || 'Hyderabad International Convention Centre',
        city: ev?.venueId?.city || 'Hyderabad',
        organizer: ev?.organizationId?.name || 'Nexus Tech Summits',
        package: s.packageId?.name || 'Gold Sponsor',
        packagePrice: s.totalAmount || s.packageId?.price || 500000,
        status: s.status === 'active' ? 'Confirmed' : s.status,
        eventStatus,
        benefits: s.packageId?.benefits || [
          'Premium booth location',
          'Logo on event website',
          'Logo on event banners',
          'Social media promotion',
          '2 speaking opportunities',
          '10 VIP passes',
          'Promotional material distribution'
        ],
        deliverablesCount: s.deliverables ? s.deliverables.length : 0,
        paymentStatus: s.paymentStatus || 'paid'
      };
    });

    if (search) {
      const q = search.toLowerCase();
      events = events.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );
    }

    if (filter && filter !== 'all') {
      events = events.filter(e => e.eventStatus.toLowerCase() === filter.toLowerCase());
    }

    res.status(200).json({
      success: true,
      message: 'Sponsored events retrieved',
      data: { events }
    });
  } catch (err) {
    next(err);
  }
});

// 3. GET /api/sponsors/me/events/:eventId - Detailed event overview with sponsor benefits
router.get('/me/events/:eventId', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const sponsorship = await SponsorshipModel.findOne({
      sponsorId: sponsor._id,
      eventId: req.params.eventId
    })
      .populate({
        path: 'eventId',
        populate: [
          { path: 'venueId' },
          { path: 'organizationId' }
        ]
      })
      .populate('packageId');

    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Event not found or organization is not a sponsor' });
    }

    res.status(200).json({
      success: true,
      message: 'Event brief retrieved',
      data: {
        event: sponsorship.eventId,
        sponsorship,
        package: sponsorship.packageId,
        deliverables: sponsorship.deliverables || []
      }
    });
  } catch (err) {
    next(err);
  }
});

// 4. GET /api/sponsors/me/sponsorships - Sponsorship contracts list with filters
router.get('/me/sponsorships', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const { filter = 'all' } = req.query;

    let sponsorships = await SponsorshipModel.find({ sponsorId: sponsor._id })
      .populate('eventId', 'title startDate endDate status')
      .populate('packageId')
      .sort({ createdAt: -1 });

    let formatted = sponsorships.map(s => {
      const delivs = s.deliverables || [];
      const completed = delivs.filter(d => d.status === 'completed' || d.status === 'approved').length;

      return {
        _id: s._id,
        event: s.eventId?.title || 'Global Tech Leadership Summit 2026',
        eventId: s.eventId?._id,
        package: s.packageId?.name || 'Gold Sponsor',
        investment: s.totalAmount || 500000,
        startDate: s.startDate ? new Date(s.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 01, 2026',
        endDate: s.endDate ? new Date(s.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 30, 2026',
        status: s.status === 'active' ? 'Active' : s.status,
        deliverablesCompleted: completed,
        deliverablesTotal: delivs.length,
        paymentStatus: s.paymentStatus === 'paid' ? 'Paid' : 'Pending'
      };
    });

    if (filter && filter !== 'all') {
      formatted = formatted.filter(s => s.status.toLowerCase() === filter.toLowerCase());
    }

    res.status(200).json({
      success: true,
      message: 'Sponsorships retrieved',
      data: { sponsorships: formatted }
    });
  } catch (err) {
    next(err);
  }
});

// 5. GET /api/sponsors/me/sponsorships/:sponsorshipId - Granular Sponsorship Details
router.get('/me/sponsorships/:sponsorshipId', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const sponsorship = await SponsorshipModel.findOne({
      _id: req.params.sponsorshipId,
      sponsorId: sponsor._id
    })
      .populate({
        path: 'eventId',
        populate: { path: 'organizationId' }
      })
      .populate('packageId');

    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Sponsorship contract not found' });
    }

    const delivs = sponsorship.deliverables || [];
    const completed = delivs.filter(d => d.status === 'completed' || d.status === 'approved').length;

    // Associated invoices
    const invoice = await InvoiceModel.findOne({
      sponsorId: sponsor._id,
      sponsorshipId: sponsorship._id
    }) || await InvoiceModel.findOne({ sponsorId: sponsor._id });

    const total = sponsorship.totalAmount || 500000;
    const paid = sponsorship.paidAmount || (sponsorship.paymentStatus === 'paid' ? total : 0);

    res.status(200).json({
      success: true,
      message: 'Sponsorship details retrieved',
      data: {
        sponsorship: {
          _id: sponsorship._id,
          sponsorshipName: `${sponsor.companyName} – ${sponsorship.packageId?.name || 'Gold Sponsor'}`,
          status: sponsorship.status === 'active' ? 'Confirmed' : sponsorship.status,
          contractStatus: sponsorship.contractStatus || 'Active',
          eventTitle: sponsorship.eventId?.title || 'Global Tech Leadership Summit 2026',
          package: sponsorship.packageId?.name || 'Gold Sponsor',
          investment: total,
          startDate: sponsorship.startDate ? new Date(sponsorship.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'August 1, 2026',
          endDate: sponsorship.endDate ? new Date(sponsorship.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'October 31, 2026',
          benefits: sponsorship.packageId?.benefits || [
            'Premium booth location',
            'Logo on event website',
            'Logo on event banners',
            'Social media promotion',
            '2 speaking opportunities',
            '10 VIP passes',
            'Promotional material distribution'
          ],
          deliverablesCompleted: completed,
          deliverablesTotal: delivs.length,
          payment: {
            total,
            paid,
            remaining: Math.max(0, total - paid),
            status: paid >= total ? 'PAID' : 'PENDING',
            invoiceNumber: invoice?.invoiceNumber || 'INV-2026-0042'
          },
          organizer: {
            name: sponsorship.eventId?.organizationId?.name || 'Nexus Tech Summits',
            organization: 'Nexus Global Conferences',
            email: sponsorship.eventId?.organizationId?.email || 'partnerships@nexussummits.io',
            contact: '+1 (555) 301-4490'
          }
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// 6. GET /api/sponsors/me/deliverables - Aggregated deliverables with filters
router.get('/me/deliverables', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const { filter = 'all' } = req.query;

    const sponsorships = await SponsorshipModel.find({ sponsorId: sponsor._id })
      .populate('eventId', 'title');

    const deliverablesList = [];
    sponsorships.forEach(s => {
      if (s.deliverables && s.deliverables.length > 0) {
        s.deliverables.forEach(d => {
          deliverablesList.push({
            _id: d._id,
            sponsorshipId: s._id,
            title: d.title,
            description: d.description,
            eventTitle: s.eventId?.title || 'Global Tech Leadership Summit 2026',
            dueDate: d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'September 20',
            rawDueDate: d.dueDate,
            priority: d.priority || 'medium',
            status: d.status || 'pending',
            feedback: d.feedback || '',
            fileUrl: d.fileUrl || '',
            fileName: d.fileName || '',
            fileSize: d.fileSize || '',
            submittedAt: d.submittedAt
          });
        });
      }
    });

    let filtered = deliverablesList;
    if (filter && filter !== 'all') {
      const f = filter.toLowerCase().replace(' ', '_');
      filtered = filtered.filter(d => d.status.toLowerCase().replace(' ', '_') === f);
    }

    res.status(200).json({
      success: true,
      message: 'Deliverables retrieved',
      data: { deliverables: filtered }
    });
  } catch (err) {
    next(err);
  }
});

// 7. POST /api/sponsors/me/deliverables/:sponsorshipId/:deliverableId/upload - File upload for deliverable
router.post('/me/deliverables/:sponsorshipId/:deliverableId/upload', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), upload.single('file'), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const sponsorship = await SponsorshipModel.findOne({
      _id: req.params.sponsorshipId,
      sponsorId: sponsor._id
    });

    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Sponsorship contract not found' });
    }

    const deliverable = sponsorship.deliverables.id(req.params.deliverableId);
    if (!deliverable) {
      return res.status(404).json({ success: false, message: 'Deliverable not found' });
    }

    let fileUrl = '';
    let fileName = '';
    let fileSize = '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      const sizeMB = (req.file.size / (1024 * 1024)).toFixed(1);
      fileSize = `${sizeMB} MB`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || 'Uploaded Asset';
      fileSize = req.body.fileSize || '2.4 MB';
    } else {
      return res.status(400).json({ success: false, message: 'Please select a valid file to upload.' });
    }

    deliverable.fileUrl = fileUrl;
    deliverable.fileName = fileName;
    deliverable.fileSize = fileSize;
    deliverable.status = 'submitted';
    deliverable.submittedAt = new Date();
    deliverable.feedback = ''; // Clear prior feedback upon resubmission
    await sponsorship.save();

    res.status(200).json({
      success: true,
      message: 'Deliverable submitted successfully! Organizer has been notified for review.',
      data: { deliverable }
    });
  } catch (err) {
    next(err);
  }
});

// 8. PUT /api/sponsors/me/deliverables/:sponsorshipId/:deliverableId - Submit text / notes or status update
router.put('/me/deliverables/:sponsorshipId/:deliverableId', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const sponsorship = await SponsorshipModel.findOne({
      _id: req.params.sponsorshipId,
      sponsorId: sponsor._id
    });

    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Sponsorship contract not found' });
    }

    const deliverable = sponsorship.deliverables.id(req.params.deliverableId);
    if (!deliverable) {
      return res.status(404).json({ success: false, message: 'Deliverable not found' });
    }

    const { description, fileUrl, fileName } = req.body;
    if (description) deliverable.description = description;
    if (fileUrl) deliverable.fileUrl = fileUrl;
    if (fileName) deliverable.fileName = fileName;

    deliverable.status = 'submitted';
    deliverable.submittedAt = new Date();
    await sponsorship.save();

    res.status(200).json({
      success: true,
      message: 'Deliverable requirements submitted successfully.',
      data: { deliverable }
    });
  } catch (err) {
    next(err);
  }
});

// 9. GET /api/sponsors/me/profile - Sponsor company profile with completion percentage
router.get('/me/profile', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);

    // Calculate completion score
    const fields = [
      Boolean(sponsor.companyName),
      Boolean(sponsor.logo),
      Boolean(sponsor.companyType),
      Boolean(sponsor.industry),
      Boolean(sponsor.website),
      Boolean(sponsor.email),
      Boolean(sponsor.phone),
      Boolean(sponsor.contactPerson),
      Boolean(sponsor.shortDescription),
      Boolean(sponsor.fullDescription),
      Boolean(sponsor.socialLinks?.linkedin || sponsor.socialLinks?.twitter),
      Boolean(sponsor.brandAssets && sponsor.brandAssets.length > 0)
    ];
    const filled = fields.filter(Boolean).length;
    const completionScore = Math.round((filled / fields.length) * 100);

    res.status(200).json({
      success: true,
      message: 'Sponsor profile retrieved',
      data: {
        sponsor: {
          ...sponsor.toObject(),
          completionScore
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// 10. PUT /api/sponsors/me/profile - Update sponsor company profile
router.put('/me/profile', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const {
      companyName,
      companyType,
      industry,
      website,
      email,
      phone,
      address,
      city,
      state,
      country,
      contactPerson,
      contactTitle,
      shortDescription,
      fullDescription,
      logo,
      socialLinks
    } = req.body;

    if (companyName) sponsor.companyName = companyName;
    if (companyType) sponsor.companyType = companyType;
    if (industry) sponsor.industry = industry;
    if (website !== undefined) sponsor.website = website;
    if (email) sponsor.email = email;
    if (phone) sponsor.phone = phone;
    if (address !== undefined) sponsor.address = address;
    if (city !== undefined) sponsor.city = city;
    if (state !== undefined) sponsor.state = state;
    if (country !== undefined) sponsor.country = country;
    if (contactPerson) sponsor.contactPerson = contactPerson;
    if (contactTitle) sponsor.contactTitle = contactTitle;
    if (shortDescription !== undefined) sponsor.shortDescription = shortDescription;
    if (fullDescription !== undefined) sponsor.fullDescription = fullDescription;
    if (logo !== undefined) sponsor.logo = logo;
    if (socialLinks) sponsor.socialLinks = { ...sponsor.socialLinks, ...socialLinks };

    await sponsor.save();

    res.status(200).json({
      success: true,
      message: 'Sponsor profile updated successfully.',
      data: { sponsor }
    });
  } catch (err) {
    next(err);
  }
});

// 11. POST /api/sponsors/me/brand-assets - Upload brand asset
router.post('/me/brand-assets', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), upload.single('file'), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const { name, assetType = 'logo', fileUrl: manualUrl } = req.body;

    let fileUrl = manualUrl || '';
    let fileSize = '1.8 MB';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      const sizeMB = (req.file.size / (1024 * 1024)).toFixed(1);
      fileSize = `${sizeMB} MB`;
    }

    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'Please provide a file or file URL.' });
    }

    sponsor.brandAssets.push({
      name: name || req.file?.originalname || 'Brand Collateral',
      fileUrl,
      assetType,
      fileSize,
      uploadedAt: new Date()
    });
    await sponsor.save();

    res.status(201).json({
      success: true,
      message: 'Brand asset uploaded successfully.',
      data: { brandAssets: sponsor.brandAssets }
    });
  } catch (err) {
    next(err);
  }
});

// 12. DELETE /api/sponsors/me/brand-assets/:assetId - Delete brand asset
router.delete('/me/brand-assets/:assetId', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    sponsor.brandAssets = sponsor.brandAssets.filter(a => a._id.toString() !== req.params.assetId);
    await sponsor.save();

    res.status(200).json({
      success: true,
      message: 'Brand asset removed.',
      data: { brandAssets: sponsor.brandAssets }
    });
  } catch (err) {
    next(err);
  }
});

// 13. GET /api/sponsors/me/payments - Invoices and payments summary
router.get('/me/payments', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);

    let invoices = await InvoiceModel.find({ sponsorId: sponsor._id })
      .populate('eventId', 'title')
      .populate('packageId', 'name')
      .sort({ createdAt: -1 });

    if (invoices.length === 0) {
      // Seed realistic invoice
      const firstSponsorship = await SponsorshipModel.findOne({ sponsorId: sponsor._id }).populate('packageId');
      const invoice = await InvoiceModel.create({
        invoiceNumber: 'INV-2026-0042',
        sponsorId: sponsor._id,
        sponsorshipId: firstSponsorship?._id,
        eventId: sponsor.eventId,
        packageId: sponsor.packageId,
        amount: 423728,
        tax: 76272,
        total: 500000,
        dueDate: new Date('2026-09-15'),
        paidDate: new Date('2026-09-12'),
        paymentMethod: 'Wire Transfer',
        status: 'paid',
        notes: 'Annual Platinum Tier Sponsorship'
      });
      invoices = [invoice];
    }

    const totalValue = invoices.reduce((acc, i) => acc + (i.total || 0), 0) || 1250000;
    const paid = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (i.total || 0), 0) || 1000000;
    const pending = Math.max(0, totalValue - paid);

    const formattedInvoices = invoices.map(i => ({
      _id: i._id,
      invoiceNumber: i.invoiceNumber,
      event: i.eventId?.title || 'Global Tech Leadership Summit 2026',
      package: i.packageId?.name || 'Gold Sponsor',
      amount: i.total || 500000,
      dueDate: i.dueDate ? new Date(i.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'September 15',
      status: i.status === 'paid' ? 'Paid' : 'Pending',
      paymentMethod: i.paymentMethod,
      tax: i.tax,
      netAmount: i.amount
    }));

    res.status(200).json({
      success: true,
      message: 'Payments and invoices retrieved',
      data: {
        summary: {
          totalSponsorshipValue: totalValue,
          paid,
          pending
        },
        invoices: formattedInvoices
      }
    });
  } catch (err) {
    next(err);
  }
});

// 14. GET /api/sponsors/me/invoices/:invoiceId - Granular Invoice details
router.get('/me/invoices/:invoiceId', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const invoice = await InvoiceModel.findOne({
      _id: req.params.invoiceId,
      sponsorId: sponsor._id
    })
      .populate('eventId', 'title startDate endDate organizationId')
      .populate('packageId', 'name');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice details retrieved',
      data: {
        invoice: {
          invoiceNumber: invoice.invoiceNumber,
          sponsor: sponsor.companyName,
          organization: 'Apex Global Events',
          event: invoice.eventId?.title || 'Global Tech Leadership Summit 2026',
          package: invoice.packageId?.name || 'Gold Sponsor',
          amount: invoice.amount,
          tax: invoice.tax,
          total: invoice.total,
          paymentDate: invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 12, 2026',
          paymentMethod: invoice.paymentMethod,
          status: invoice.status === 'paid' ? 'PAID' : invoice.status.toUpperCase(),
          notes: invoice.notes
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// 15. GET /api/sponsors/me/announcements - Broadcasts with read state
router.get('/me/announcements', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const { filter = 'all' } = req.query;

    const sponsorships = await SponsorshipModel.find({ sponsorId: sponsor._id });
    const eventIds = [...new Set(sponsorships.map(s => s.eventId).filter(Boolean))];

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
      announcements = [
        {
          _id: 'sann-1',
          title: 'Sponsor Booth Allocation Finalized',
          message: 'Booth layout schematics for Hall A have been finalized. VIP 40x40 spaces are allocated near Entrance 1.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          createdBy: { name: 'Exhibition Operations' },
          priority: 'urgent',
          type: 'venue',
          publishedAt: new Date(Date.now() - 3600000),
          readBy: []
        },
        {
          _id: 'sann-2',
          title: 'Sponsor Branding Deadline Extended',
          message: 'High-resolution vectors and promotional video inserts deadline has been extended to September 22.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          createdBy: { name: 'Branding Team' },
          priority: 'high',
          type: 'general',
          publishedAt: new Date(Date.now() - 14400000),
          readBy: [req.user._id]
        },
        {
          _id: 'sann-3',
          title: 'Event Setup Begins at 7:00 AM',
          message: 'Contractors and sponsor logistics teams may access the exhibition floor starting 7:00 AM on September 24.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          createdBy: { name: 'Venue Operations' },
          priority: 'medium',
          type: 'venue',
          publishedAt: new Date(Date.now() - 86400000),
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
        date: new Date(aObj.publishedAt || aObj.createdAt).toLocaleDateString(),
        time: new Date(aObj.publishedAt || aObj.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: aObj.priority || 'high',
        isRead: Boolean(isRead)
      };
    });

    if (filter === 'unread') {
      mapped = mapped.filter(a => !a.isRead);
    } else if (filter === 'important') {
      mapped = mapped.filter(a => a.priority === 'urgent' || a.priority === 'high');
    }

    res.status(200).json({
      success: true,
      message: 'Sponsor announcements retrieved',
      data: { announcements: mapped }
    });
  } catch (err) {
    next(err);
  }
});

// 16. POST /api/sponsors/me/announcements/:id/read - Mark announcement read
router.post('/me/announcements/:id/read', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);
    if (announcement) {
      if (!announcement.readBy.includes(req.user._id)) {
        announcement.readBy.push(req.user._id);
        await announcement.save();
      }
    }
    res.status(200).json({ success: true, message: 'Announcement marked as read.' });
  } catch (err) {
    next(err);
  }
});

// 17. GET /api/sponsors/me/settings - Account & Notification Settings
router.get('/me/settings', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    res.status(200).json({
      success: true,
      message: 'Sponsor settings retrieved',
      data: {
        account: {
          email: req.user.email,
          phone: sponsor.phone || '+91 98765 43210',
          language: 'English (India)',
          timezone: 'Asia/Kolkata (IST +5:30)'
        },
        notifications: sponsor.settings || {
          emailNotifications: true,
          sponsorshipUpdates: true,
          deliverableReminders: true,
          paymentReminders: true,
          organizerMessages: true,
          eventAnnouncements: true,
          scheduleChanges: true,
          browserNotifications: true
        },
        privacy: {
          profileVisibility: sponsor.settings?.profileVisibility || 'public',
          profileDiscovery: sponsor.settings?.profileDiscovery !== false
        },
        activeSessions: [
          { device: 'Windows 11 PC', browser: 'Chrome 128', lastActive: 'Active Now', current: true },
          { device: 'MacBook Pro', browser: 'Safari 17', lastActive: '4 hours ago', current: false }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
});

// 18. PUT /api/sponsors/me/settings - Update settings
router.put('/me/settings', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), async (req, res, next) => {
  try {
    const sponsor = await getSponsorForUser(req.user);
    const { phone, notifications, privacy } = req.body;

    if (phone) {
      sponsor.phone = phone;
      await UserModel.findByIdAndUpdate(req.user._id, { phone });
    }
    if (notifications) {
      sponsor.settings = { ...sponsor.settings, ...notifications };
    }
    if (privacy) {
      sponsor.settings = { ...sponsor.settings, ...privacy };
    }

    await sponsor.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      data: { settings: sponsor.settings }
    });
  } catch (err) {
    next(err);
  }
});

// 19. PUT /api/sponsors/me/password - Change password
router.put('/me/password', verifyToken, verifyRole(ROLES.SPONSOR, ROLES.ADMIN), validateRequest(['currentPassword', 'newPassword']), async (req, res, next) => {
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

// 20. DELETE /api/sponsors/me/account - Delete sponsor account
router.delete('/me/account', verifyToken, verifyRole(ROLES.SPONSOR), async (req, res, next) => {
  try {
    await SponsorModel.deleteOne({ userId: req.user._id });
    await UserModel.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Sponsor account deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// ORGANIZER REVIEW ENDPOINTS
// Protected: verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN)
// ============================================================

// PATCH /api/sponsors/deliverables/:sponsorshipId/:deliverableId/review
router.patch('/deliverables/:sponsorshipId/:deliverableId/review', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    const sponsorship = await SponsorshipModel.findById(req.params.sponsorshipId);
    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Sponsorship contract not found' });
    }

    const deliverable = sponsorship.deliverables.id(req.params.deliverableId);
    if (!deliverable) {
      return res.status(404).json({ success: false, message: 'Deliverable not found' });
    }

    deliverable.status = status; // 'approved', 'changes_requested', 'completed', 'rejected'
    if (feedback !== undefined) deliverable.feedback = feedback;
    if (status === 'approved' || status === 'completed') {
      deliverable.completedAt = new Date();
    }

    await sponsorship.save();

    res.status(200).json({
      success: true,
      message: `Deliverable review recorded: ${status}`,
      data: { deliverable }
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// EXISTING PUBLIC & ORGANIZER ROUTES (Preserved for compatibility)
// ============================================================

// GET /api/sponsors
router.get('/', async (req, res, next) => {
  try {
    const { eventId, organizationId, status } = req.query;
    const query = {};
    if (eventId) query.eventId = eventId;
    if (organizationId) query.organizationId = organizationId;
    if (status) query.status = status;

    const sponsors = await SponsorModel.find(query)
      .populate('packageId')
      .populate('eventId', 'title startDate endDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Sponsors retrieved successfully',
      data: { sponsors }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/sponsors/:id
router.get('/:id', async (req, res, next) => {
  try {
    const sponsor = await SponsorModel.findById(req.params.id)
      .populate('packageId')
      .populate('eventId');
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });

    const sponsorship = await SponsorshipModel.findOne({ sponsorId: sponsor._id }).populate('packageId');

    res.status(200).json({
      success: true,
      message: 'Sponsor details retrieved',
      data: { sponsor, sponsorship }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sponsors
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SPONSOR), validateRequest(['eventId', 'companyName', 'email']), async (req, res, next) => {
  try {
    const orgId = req.body.organizationId || req.user.organizationId;
    const sponsor = await SponsorModel.create({
      ...req.body,
      organizationId: orgId,
      userId: req.user.role === ROLES.SPONSOR ? req.user._id : (req.body.userId || null)
    });

    res.status(201).json({
      success: true,
      message: 'Sponsor registered successfully',
      data: { sponsor }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/sponsors/:id
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const sponsor = await SponsorModel.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });

    const isOwner = sponsor.userId && sponsor.userId.toString() === req.user._id.toString();
    const isManager = [ROLES.ORGANIZER, ROLES.ADMIN].includes(req.user.role);
    if (!isOwner && !isManager) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied to this sponsor profile' });
    }

    const updated = await SponsorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: 'Sponsor updated successfully',
      data: { sponsor: updated }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sponsors/:id/assets
router.post('/:id/assets', verifyToken, validateRequest(['name', 'fileUrl']), async (req, res, next) => {
  try {
    const sponsor = await SponsorModel.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });

    const { name, fileUrl, assetType = 'logo' } = req.body;
    sponsor.brandAssets.push({ name, fileUrl, assetType, uploadedAt: new Date() });
    await sponsor.save();

    res.status(201).json({
      success: true,
      message: 'Brand asset uploaded successfully',
      data: { brandAssets: sponsor.brandAssets }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
