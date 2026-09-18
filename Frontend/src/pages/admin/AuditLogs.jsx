import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Activity,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import SecurityNotice from '../../components/admin/audit/SecurityNotice';
import AuditSummaryCard from '../../components/admin/audit/AuditSummaryCard';
import SecurityEvents from '../../components/admin/audit/SecurityEvents';
import AuditFilterBar from '../../components/admin/audit/AuditFilterBar';
import AuditTable from '../../components/admin/audit/AuditTable';
import AuditDetailsDrawer from '../../components/admin/audit/AuditDetailsDrawer';
import Pagination from '../../components/admin/audit/Pagination';
import ExportMenu from '../../components/admin/audit/ExportMenu';

// 28 realistic enterprise audit records
const DEMO_AUDIT_LOGS = [
  {
    id: 'aud-001',
    eventId: 'AUD-20260917-00128',
    date: 'Sep 17, 2026',
    time: '10:42 AM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Updated',
    resource: 'Organization',
    resourceId: 'ORG-002',
    details: 'Updated Apex Global Events settings',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '10:42 AM', step: 'Action initiated' },
      { time: '10:42 AM', step: 'Permission verified (Platform Admin MFA)' },
      { time: '10:42 AM', step: 'Organization settings updated in database' },
      { time: '10:42 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-002',
    eventId: 'AUD-20260917-00127',
    date: 'Sep 17, 2026',
    time: '10:25 AM',
    user: {
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      role: 'Organizer',
      avatar: 'RK'
    },
    action: 'Created',
    resource: 'Event',
    resourceId: 'EVT-108',
    details: 'Created "Tech Summit 2026"',
    ipAddress: '192.168.1.24',
    device: 'macOS Sonoma',
    browser: 'Safari',
    status: 'Success',
    timeline: [
      { time: '10:25 AM', step: 'Event draft payload submitted' },
      { time: '10:25 AM', step: 'Tenant quota verified (Pro plan: 8/20 events)' },
      { time: '10:25 AM', step: 'Event schedule and tracks indexed' },
      { time: '10:25 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-003',
    eventId: 'AUD-20260917-00126',
    date: 'Sep 17, 2026',
    time: '09:48 AM',
    user: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'Attendee',
      avatar: 'PS'
    },
    action: 'Login',
    resource: 'Authentication',
    resourceId: 'AUTH-9421',
    details: 'Successful login',
    ipAddress: '192.168.1.31',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari',
    status: 'Success',
    timeline: [
      { time: '09:48 AM', step: 'OAuth JWT challenge initiated' },
      { time: '09:48 AM', step: 'Credential hash verified' },
      { time: '09:48 AM', step: 'Bearer token issued (12h TTL)' },
      { time: '09:48 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-004',
    eventId: 'AUD-20260917-00125',
    date: 'Sep 17, 2026',
    time: '09:15 AM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Subscription Changed',
    resource: 'Subscription',
    resourceId: 'SUB-401',
    details: 'Upgraded Nexus Tech Summits to Enterprise plan (₹49,999/yr)',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '09:15 AM', step: 'Billing upgrade requested' },
      { time: '09:15 AM', step: 'Stripe webhook verified' },
      { time: '09:15 AM', step: 'Quota raised to 200 users and 50 events' },
      { time: '09:15 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-005',
    eventId: 'AUD-20260917-00124',
    date: 'Sep 17, 2026',
    time: '08:30 AM',
    user: {
      name: 'Dr. Elena Rostova',
      email: 'elena.rostova@techsummit.ai',
      role: 'Speaker',
      avatar: 'ER'
    },
    action: 'Updated',
    resource: 'Event',
    resourceId: 'SES-042',
    details: 'Uploaded keynote presentation slides for "Future of Agentic AI"',
    ipAddress: '192.168.1.88',
    device: 'macOS Sonoma',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '08:30 AM', step: 'PDF file payload received (18.4 MB)' },
      { time: '08:30 AM', step: 'Virus scan passed (ClamAV)' },
      { time: '08:30 AM', step: 'Encrypted S3 bucket artifact saved' },
      { time: '08:30 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-006',
    eventId: 'AUD-20260916-00123',
    date: 'Sep 16, 2026',
    time: '06:42 PM',
    user: {
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'Staff',
      avatar: 'DW'
    },
    action: 'Role Changed',
    resource: 'User',
    resourceId: 'USR-804',
    details: 'Changed role from Staff to Organizer',
    ipAddress: '192.168.1.45',
    device: 'Windows Desktop',
    browser: 'Edge',
    status: 'Success',
    timeline: [
      { time: '06:42 PM', step: 'Role reassignment requested' },
      { time: '06:42 PM', step: 'RBAC permissions recalculated' },
      { time: '06:42 PM', step: 'Event governance privileges granted' },
      { time: '06:42 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-007',
    eventId: 'AUD-20260916-00122',
    date: 'Sep 16, 2026',
    time: '05:20 PM',
    user: {
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'Attendee',
      avatar: 'MC'
    },
    action: 'Login',
    resource: 'Authentication',
    resourceId: 'AUTH-9390',
    details: 'Failed login attempt',
    ipAddress: '192.168.1.67',
    device: 'Ubuntu Linux',
    browser: 'Firefox',
    status: 'Failed',
    timeline: [
      { time: '05:20 PM', step: 'Login attempt with invalid password hash' },
      { time: '05:20 PM', step: 'Security firewall flagged invalid credentials' },
      { time: '05:20 PM', step: 'Failed attempt counter incremented (1/5)' },
      { time: '05:20 PM', step: 'Action rejected by security gateway' }
    ]
  },
  {
    id: 'aud-008',
    eventId: 'AUD-20260916-00121',
    date: 'Sep 16, 2026',
    time: '04:55 PM',
    user: {
      name: 'System Security Gateway',
      email: 'security@eventforge.internal',
      role: 'System',
      avatar: 'SG'
    },
    action: 'Login',
    resource: 'Authentication',
    resourceId: 'SEC-881',
    details: 'Multiple failed login attempts from external IP (Rate limited)',
    ipAddress: '45.33.32.119',
    device: 'Automated Script / Bot',
    browser: 'Unknown User-Agent',
    status: 'Failed',
    timeline: [
      { time: '04:55 PM', step: '5 sequential failed login attempts detected' },
      { time: '04:55 PM', step: 'Threshold rule breached: max 5 attempts per 60s' },
      { time: '04:55 PM', step: 'IP 45.33.32.119 quarantined for 1 hour' },
      { time: '04:55 PM', step: 'Security audit alert dispatched to admin' }
    ]
  },
  {
    id: 'aud-009',
    eventId: 'AUD-20260916-00120',
    date: 'Sep 16, 2026',
    time: '03:10 PM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Settings Changed',
    resource: 'Settings',
    resourceId: 'SET-001',
    details: 'Updated global password policy: minimum length set to 12 characters',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '03:10 PM', step: 'Security settings form submitted' },
      { time: '03:10 PM', step: 'Platform admin cryptographic signature validated' },
      { time: '03:10 PM', step: 'Global tenant auth validator policy updated' },
      { time: '03:10 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-010',
    eventId: 'AUD-20260916-00119',
    date: 'Sep 16, 2026',
    time: '11:15 AM',
    user: {
      name: 'Marcus Sterling',
      email: 'marcus@apexevents.com',
      role: 'Organizer',
      avatar: 'MS'
    },
    action: 'Created',
    resource: 'Organization',
    resourceId: 'ORG-008',
    details: 'Provisioned new organizer workspace for Apex Global Events',
    ipAddress: '192.168.1.18',
    device: 'macOS Sonoma',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '11:15 AM', step: 'Workspace provisioning initiated' },
      { time: '11:15 AM', step: 'Tenant database collection isolated' },
      { time: '11:15 AM', step: 'Default permissions and roles configured' },
      { time: '11:15 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-011',
    eventId: 'AUD-20260916-00118',
    date: 'Sep 16, 2026',
    time: '10:21 AM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Suspended',
    resource: 'User',
    resourceId: 'USR-201',
    details: 'Suspended user account Rahul Kumar pending compliance verification',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '10:21 AM', step: 'Suspension order executed' },
      { time: '10:21 AM', step: 'All active bearer tokens immediately revoked' },
      { time: '10:21 AM', step: 'User state updated to Suspended in DB' },
      { time: '10:21 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-012',
    eventId: 'AUD-20260915-00117',
    date: 'Sep 15, 2026',
    time: '04:45 PM',
    user: {
      name: 'Sarah Jenkins',
      email: 'sarah@nexus.io',
      role: 'Organizer',
      avatar: 'SJ'
    },
    action: 'Updated',
    resource: 'Event',
    resourceId: 'EVT-102',
    details: 'Published agenda updates for "DevOps World 2026"',
    ipAddress: '192.168.1.52',
    device: 'Windows Desktop',
    browser: 'Firefox',
    status: 'Success',
    timeline: [
      { time: '04:45 PM', step: 'Agenda modification submitted' },
      { time: '04:45 PM', step: 'Room & speaker conflict checker passed' },
      { time: '04:45 PM', step: 'Live WebSocket broadcast sent to 240 attendees' },
      { time: '04:45 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-013',
    eventId: 'AUD-20260915-00116',
    date: 'Sep 15, 2026',
    time: '03:14 PM',
    user: {
      name: 'Sarah Jenkins',
      email: 'sarah@nexus.io',
      role: 'Organizer',
      avatar: 'SJ'
    },
    action: 'Login',
    resource: 'Authentication',
    resourceId: 'AUTH-9204',
    details: 'Password reset requested via email OTP verification',
    ipAddress: '192.168.1.52',
    device: 'Windows Desktop',
    browser: 'Firefox',
    status: 'Success',
    timeline: [
      { time: '03:14 PM', step: 'Password reset requested' },
      { time: '03:14 PM', step: 'One-time 6-digit cryptographic OTP generated' },
      { time: '03:14 PM', step: 'Transactional email sent to verified address' },
      { time: '03:14 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-014',
    eventId: 'AUD-20260915-00115',
    date: 'Sep 15, 2026',
    time: '02:00 PM',
    user: {
      name: 'David Kim',
      email: 'david.kim@eventforge.io',
      role: 'Staff',
      avatar: 'DK'
    },
    action: 'Updated',
    resource: 'Event',
    resourceId: 'CHK-551',
    details: 'Checked in attendee #412 via QR camera scanner',
    ipAddress: '192.168.1.91',
    device: 'iPad Pro (Desk Scanner)',
    browser: 'Chrome Mobile',
    status: 'Success',
    timeline: [
      { time: '02:00 PM', step: 'QR code camera token scanned' },
      { time: '02:00 PM', step: 'HMAC-SHA256 signature verified' },
      { time: '02:00 PM', step: 'Check-in state marked in registration record' },
      { time: '02:00 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-015',
    eventId: 'AUD-20260915-00114',
    date: 'Sep 15, 2026',
    time: '01:10 PM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Activated',
    resource: 'User',
    resourceId: 'USR-201',
    details: 'Activated user account Rahul Kumar after identity verification',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '01:10 PM', step: 'Activation approved by Platform Admin' },
      { time: '01:10 PM', step: 'Account status restored to Active' },
      { time: '01:10 PM', step: 'Notification dispatched to user' },
      { time: '01:10 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-016',
    eventId: 'AUD-20260915-00113',
    date: 'Sep 15, 2026',
    time: '11:40 AM',
    user: {
      name: 'Alex Morgan',
      email: 'alex.morgan@dataflow.com',
      role: 'Sponsor',
      avatar: 'AM'
    },
    action: 'Created',
    resource: 'Event',
    resourceId: 'SPN-019',
    details: 'Submitted Platinum sponsorship deliverables and booth banner assets',
    ipAddress: '192.168.1.73',
    device: 'macOS Sequoia',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '11:40 AM', step: 'Sponsorship collateral uploaded' },
      { time: '11:40 AM', step: 'High-res vector logo verified' },
      { time: '11:40 AM', step: 'Assigned booth space #B-12' },
      { time: '11:40 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-017',
    eventId: 'AUD-20260914-00112',
    date: 'Sep 14, 2026',
    time: '05:30 PM',
    user: {
      name: 'Ananya Iyer',
      email: 'ananya@example.com',
      role: 'Attendee',
      avatar: 'AI'
    },
    action: 'Logout',
    resource: 'Authentication',
    resourceId: 'AUTH-9102',
    details: 'User initiated clean session logout',
    ipAddress: '192.168.1.38',
    device: 'Windows Laptop',
    browser: 'Edge',
    status: 'Success',
    timeline: [
      { time: '05:30 PM', step: 'Logout requested' },
      { time: '05:30 PM', step: 'Refresh token invalidated' },
      { time: '05:30 PM', step: 'Session cookies cleared' },
      { time: '05:30 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-018',
    eventId: 'AUD-20260914-00111',
    date: 'Sep 14, 2026',
    time: '04:15 PM',
    user: {
      name: 'Marcus Sterling',
      email: 'marcus@apexevents.com',
      role: 'Organizer',
      avatar: 'MS'
    },
    action: 'Deleted',
    resource: 'Event',
    resourceId: 'EVT-098',
    details: 'Deleted cancelled draft workshop "Introduction to Docker"',
    ipAddress: '192.168.1.18',
    device: 'macOS Sonoma',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '04:15 PM', step: 'Event soft delete triggered' },
      { time: '04:15 PM', step: 'Zero tickets registered verified' },
      { time: '04:15 PM', step: 'Record moved to trash retention archive' },
      { time: '04:15 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-019',
    eventId: 'AUD-20260914-00110',
    date: 'Sep 14, 2026',
    time: '02:40 PM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Settings Changed',
    resource: 'Settings',
    resourceId: 'SET-002',
    details: 'Updated platform SSL certificate and enforced TLS 1.3 encryption',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '02:40 PM', step: 'Certbot automatic renewal completed' },
      { time: '02:40 PM', step: 'Nginx server blocks reloaded' },
      { time: '02:40 PM', step: 'TLS 1.3 handshake verified' },
      { time: '02:40 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-020',
    eventId: 'AUD-20260913-00109',
    date: 'Sep 13, 2026',
    time: '11:00 AM',
    user: {
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      role: 'Organizer',
      avatar: 'RK'
    },
    action: 'Created',
    resource: 'Event',
    resourceId: 'TCK-201',
    details: 'Created VIP Early Bird ticket tier ($199 USD) with 50 seats',
    ipAddress: '192.168.1.24',
    device: 'macOS Sonoma',
    browser: 'Safari',
    status: 'Success',
    timeline: [
      { time: '11:00 AM', step: 'Ticket tier created' },
      { time: '11:00 AM', step: 'Payment gateway price ID attached' },
      { time: '11:00 AM', step: 'Inventory counters initialized' },
      { time: '11:00 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-021',
    eventId: 'AUD-20260913-00108',
    date: 'Sep 13, 2026',
    time: '09:20 AM',
    user: {
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'Attendee',
      avatar: 'MC'
    },
    action: 'Login',
    resource: 'Authentication',
    resourceId: 'AUTH-8910',
    details: 'Successful login after password recovery',
    ipAddress: '192.168.1.67',
    device: 'Ubuntu Linux',
    browser: 'Firefox',
    status: 'Success',
    timeline: [
      { time: '09:20 AM', step: 'Password reset verified' },
      { time: '09:20 AM', step: 'New credential hash stored' },
      { time: '09:20 AM', step: 'User authenticated successfully' },
      { time: '09:20 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-022',
    eventId: 'AUD-20260912-00107',
    date: 'Sep 12, 2026',
    time: '04:12 PM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Subscription Changed',
    resource: 'Subscription',
    resourceId: 'SUB-302',
    details: 'Provisioned 14-day Pro Trial for Global Connect',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '04:12 PM', step: 'Trial provisioned' },
      { time: '04:12 PM', step: 'Quotas raised to 50 users and 20 events' },
      { time: '04:12 PM', step: 'Expiration schedule set to Sep 26' },
      { time: '04:12 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-023',
    eventId: 'AUD-20260912-00106',
    date: 'Sep 12, 2026',
    time: '01:45 PM',
    user: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'Attendee',
      avatar: 'PS'
    },
    action: 'Created',
    resource: 'Event',
    resourceId: 'REG-840',
    details: 'Registered for Global AI & Cloud Summit 2026',
    ipAddress: '192.168.1.31',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari',
    status: 'Success',
    timeline: [
      { time: '01:45 PM', step: 'Registration form submitted' },
      { time: '01:45 PM', step: 'Payment verified' },
      { time: '01:45 PM', step: 'Digital QR badge generated' },
      { time: '01:45 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-024',
    eventId: 'AUD-20260911-00105',
    date: 'Sep 11, 2026',
    time: '10:00 AM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Created',
    resource: 'Organization',
    resourceId: 'ORG-004',
    details: 'Approved and created enterprise workspace for TechCorp Solutions',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '10:00 AM', step: 'Organization provisioning approved' },
      { time: '10:00 AM', step: 'Domain techcorp.io whitelisted' },
      { time: '10:00 AM', step: 'Enterprise SSO federation connected' },
      { time: '10:00 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-025',
    eventId: 'AUD-20260910-00104',
    date: 'Sep 10, 2026',
    time: '03:50 PM',
    user: {
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'Organizer',
      avatar: 'DW'
    },
    action: 'Updated',
    resource: 'Event',
    resourceId: 'EVT-101',
    details: 'Updated venue hall map and session room capacity allocations',
    ipAddress: '192.168.1.45',
    device: 'Windows Desktop',
    browser: 'Edge',
    status: 'Success',
    timeline: [
      { time: '03:50 PM', step: 'Floor plan changes saved' },
      { time: '03:50 PM', step: 'Room capacity set to 350 seats' },
      { time: '03:50 PM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-026',
    eventId: 'AUD-20260908-00103',
    date: 'Sep 08, 2026',
    time: '02:15 PM',
    user: {
      name: 'System Security Gateway',
      email: 'security@eventforge.internal',
      role: 'System',
      avatar: 'SG'
    },
    action: 'Login',
    resource: 'Authentication',
    resourceId: 'SEC-812',
    details: 'Suspicious IP address blocked by automated Web Application Firewall',
    ipAddress: '185.220.101.5',
    device: 'Tor Exit Node',
    browser: 'HeadlessChrome',
    status: 'Failed',
    timeline: [
      { time: '02:15 PM', step: 'Known malicious IP address detected in threat DB' },
      { time: '02:15 PM', step: 'Immediate HTTP 403 Forbidden issued' },
      { time: '02:15 PM', step: 'Zero data leaked' }
    ]
  },
  {
    id: 'aud-027',
    eventId: 'AUD-20260905-00102',
    date: 'Sep 05, 2026',
    time: '09:30 AM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Updated',
    resource: 'Settings',
    resourceId: 'SET-004',
    details: 'Enabled Gemini 1.5 Pro integration for automated schedule conflict analysis',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '09:30 AM', step: 'API secret key encrypted and stored' },
      { time: '09:30 AM', step: 'AI rate limit policy set to 100 req/min' },
      { time: '09:30 AM', step: 'Action completed successfully' }
    ]
  },
  {
    id: 'aud-028',
    eventId: 'AUD-20260901-00101',
    date: 'Sep 01, 2026',
    time: '08:00 AM',
    user: {
      name: 'Vishnureddy',
      email: 'mvishnuvardhanreddy33@gmail.com',
      role: 'Platform Admin',
      avatar: 'VR'
    },
    action: 'Created',
    resource: 'Settings',
    resourceId: 'SET-000',
    details: 'Initial platform security baseline initialized and cryptographic ledger created',
    ipAddress: '192.168.1.10',
    device: 'Windows Desktop',
    browser: 'Chrome',
    status: 'Success',
    timeline: [
      { time: '08:00 AM', step: 'Platform initialized' },
      { time: '08:00 AM', step: 'Single Platform Admin verified' },
      { time: '08:00 AM', step: 'Audit logging enabled permanently' }
    ]
  }
];

const ITEMS_PER_PAGE = 20;

const AuditLogs = () => {
  const [logs] = useState(DEMO_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [userFilter, setUserFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [resourceFilter, setResourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  // Extract unique user names for filter dropdown
  const uniqueUsers = useMemo(() => {
    const set = new Set();
    DEMO_AUDIT_LOGS.forEach((l) => set.add(l.user.name));
    return Array.from(set);
  }, []);

  // Multi-dimensional Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      // 1. Search Query (user name, email, action, resource, details)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.user.name.toLowerCase().includes(q);
        const matchEmail = item.user.email.toLowerCase().includes(q);
        const matchAction = item.action.toLowerCase().includes(q);
        const matchResource = item.resource.toLowerCase().includes(q);
        const matchDetails = item.details.toLowerCase().includes(q);
        const matchIp = item.ipAddress.toLowerCase().includes(q);

        if (!matchName && !matchEmail && !matchAction && !matchResource && !matchDetails && !matchIp) {
          return false;
        }
      }

      // 2. Date Range Filter
      if (dateRange === 'Today') {
        if (!item.date.includes('Sep 17')) return false;
      } else if (dateRange === 'Last 7 Days') {
        const allowed = ['Sep 17', 'Sep 16', 'Sep 15', 'Sep 14', 'Sep 13', 'Sep 12', 'Sep 11'];
        if (!allowed.some((d) => item.date.includes(d))) return false;
      } else if (dateRange === 'Last 30 Days') {
        if (!item.date.includes('Sep')) return false;
      } else if (dateRange === 'Last 3 Months') {
        // Includes Sep, Aug, Jul
        const allowedMonths = ['Sep', 'Aug', 'Jul'];
        if (!allowedMonths.some((m) => item.date.includes(m))) return false;
      }

      // 3. User Filter
      if (userFilter !== 'All') {
        if (item.user.name !== userFilter) return false;
      }

      // 4. Action Filter
      if (actionFilter !== 'All') {
        if (item.action.toLowerCase() !== actionFilter.toLowerCase()) return false;
      }

      // 5. Resource Filter
      if (resourceFilter !== 'All') {
        if (item.resource.toLowerCase() !== resourceFilter.toLowerCase()) return false;
      }

      // 6. Status Filter
      if (statusFilter !== 'All') {
        if (item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [logs, searchQuery, dateRange, userFilter, actionFilter, resourceFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateRange('Last 30 Days');
    setUserFilter('All');
    setActionFilter('All');
    setResourceFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const handleSelectSecurityFilter = (filterQuery) => {
    setSearchQuery(filterQuery);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ['Event ID', 'Date & Time', 'User', 'Email', 'Role', 'Action', 'Resource', 'Details', 'IP Address', 'Status'];
    const rows = filteredLogs.map((l) => [
      `"${l.eventId || l.id}"`,
      `"${l.date} ${l.time}"`,
      `"${l.user.name}"`,
      `"${l.user.email}"`,
      `"${l.user.role}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      `"${l.details}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `eventforge-audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6 min-w-0 overflow-x-hidden">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
            Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Monitor important platform activities and security events.
          </p>
        </div>

        {/* Top-right: [ Export Logs ] */}
        <div className="shrink-0">
          <ExportMenu onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} />
        </div>
      </div>

      {/* 2. Security Notice Banner */}
      <SecurityNotice />

      {/* 3. 4 Compact Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <AuditSummaryCard
          title="TOTAL EVENTS"
          value="1,248"
          subtitle="All recorded activities"
          icon={Activity}
          trend="+14% this month"
          trendType="positive"
        />
        <AuditSummaryCard
          title="TODAY"
          value="86"
          subtitle="Events recorded today"
          icon={Calendar}
          trend="Normal volume"
          trendType="neutral"
        />
        <AuditSummaryCard
          title="SECURITY EVENTS"
          value="12"
          subtitle="Security-related activities"
          icon={ShieldAlert}
          trend="12 monitored"
          trendType="warning"
        />
        <AuditSummaryCard
          title="FAILED ACTIONS"
          value="7"
          subtitle="Actions requiring attention"
          icon={AlertTriangle}
          trend="Requires review"
          trendType="danger"
        />
      </div>

      {/* 4. Security Events Highlight Section */}
      <SecurityEvents onSelectSecurityFilter={handleSelectSecurityFilter} />

      {/* 5. Search & Filter Bar */}
      <AuditFilterBar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        dateRange={dateRange}
        onDateRangeChange={(val) => {
          setDateRange(val);
          setCurrentPage(1);
        }}
        userFilter={userFilter}
        onUserFilterChange={(val) => {
          setUserFilter(val);
          setCurrentPage(1);
        }}
        actionFilter={actionFilter}
        onActionFilterChange={(val) => {
          setActionFilter(val);
          setCurrentPage(1);
        }}
        resourceFilter={resourceFilter}
        onResourceFilterChange={(val) => {
          setResourceFilter(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        onClearFilters={handleClearFilters}
        usersList={uniqueUsers}
      />

      {/* 6. Main Audit Log Table */}
      <div className="space-y-4">
        <AuditTable
          logs={paginatedLogs}
          onViewDetails={setSelectedLog}
          onClearFilters={handleClearFilters}
        />

        {/* 7. Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLogs.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 8. Log Details Drawer */}
      <AuditDetailsDrawer
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
};

export default AuditLogs;
