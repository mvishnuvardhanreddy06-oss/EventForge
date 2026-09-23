import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

// Standalone Auth Layout
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Organizations from '../pages/admin/Organizations';
import Users from '../pages/admin/Users';
import Subscriptions from '../pages/admin/Subscriptions';
import AdminAnalytics from '../pages/admin/Analytics';
import AuditLogs from '../pages/admin/AuditLogs';
import PlatformSettings from '../pages/admin/PlatformSettings';

// Organizer Pages
import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import Events from '../pages/organizer/Events';
import CreateEvent from '../pages/organizer/CreateEvent';
import EditEvent from '../pages/organizer/EditEvent';
import EventDetails from '../pages/organizer/EventDetails';
import Venues from '../pages/organizer/Venues';
import Sessions from '../pages/organizer/Sessions';
import Speakers from '../pages/organizer/Speakers';
import Sponsors from '../pages/organizer/Sponsors';
import SponsorshipPackages from '../pages/organizer/SponsorshipPackages';
import Tickets from '../pages/organizer/Tickets';
import Registrations from '../pages/organizer/Registrations';
import Attendees from '../pages/organizer/Attendees';
import Announcements from '../pages/organizer/Announcements';
import Feedback from '../pages/organizer/Feedback';
import Analytics from '../pages/organizer/Analytics';
import AIStudio from '../pages/organizer/AIStudio';
import OrganizerSettings from '../pages/organizer/OrganizerSettings';
import Staff from '../pages/organizer/Staff';

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard';
import CheckIn from '../pages/staff/CheckIn';
import SessionAttendance from '../pages/staff/SessionAttendance';
import AttendeeSupport from '../pages/staff/AttendeeSupport';

// Speaker Pages
import SpeakerDashboard from '../pages/speaker/SpeakerDashboard';
import SpeakerEvents from '../pages/speaker/SpeakerEvents';
import MySessions from '../pages/speaker/MySessions';
import SpeakerSessionDetails from '../pages/speaker/SpeakerSessionDetails';
import Materials from '../pages/speaker/Materials';
import Availability from '../pages/speaker/Availability';
import SpeakerProfile from '../pages/speaker/SpeakerProfile';
import SpeakerAnnouncements from '../pages/speaker/SpeakerAnnouncements';
import SpeakerSettings from '../pages/speaker/SpeakerSettings';

// Attendee Pages
import AttendeeDashboard from '../pages/attendee/AttendeeDashboard';
import BrowseEvents from '../pages/attendee/BrowseEvents';
import AttendeeEventDetails from '../pages/attendee/EventDetails';
import Registration from '../pages/attendee/Registration';
import MyRegistrations from '../pages/attendee/MyRegistrations';
import MyTickets from '../pages/attendee/MyTickets';
import MySchedule from '../pages/attendee/MySchedule';
import AttendeeMySessions from '../pages/attendee/MySessions';
import AttendeeNotifications from '../pages/attendee/AttendeeNotifications';
import MyQRCode from '../pages/attendee/MyQRCode';
import Recommendations from '../pages/attendee/Recommendations';
import AttendeeFeedback from '../pages/attendee/Feedback';
import AttendeeSettings from '../pages/attendee/AttendeeSettings';

// Sponsor Pages
import SponsorDashboard from '../pages/sponsor/SponsorDashboard';
import SponsorEvents from '../pages/sponsor/SponsorEvents';
import Sponsorships from '../pages/sponsor/Sponsorships';
import SponsorshipDetails from '../pages/sponsor/SponsorshipDetails';
import Deliverables from '../pages/sponsor/Deliverables';
import SponsorProfile from '../pages/sponsor/SponsorProfile';
import PaymentsInvoices from '../pages/sponsor/PaymentsInvoices';
import SponsorAnnouncements from '../pages/sponsor/SponsorAnnouncements';
import SponsorSettings from '../pages/sponsor/SponsorSettings';
import Package from '../pages/sponsor/Package';
import BrandAssets from '../pages/sponsor/BrandAssets';

import Landing from '../pages/Landing';

// Authenticated application shell: only used for verified/protected routes
const AuthenticatedAppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex-1 flex min-w-0 overflow-x-hidden">
        {user && <Sidebar />}
        <main className="flex-1 overflow-x-hidden min-w-0 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Standalone Landing Page (Own header/footer, NO authenticated shell) */}
      <Route path="/" element={<Landing />} />

      {/* Standalone Auth Routes (NO App Shell, NO Sidebar, NO Header) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes Wrapper (Rendered with AuthenticatedAppLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedAppLayout />}>
          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/organizations" element={<Organizations />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/subscriptions" element={<Subscriptions />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/settings" element={<PlatformSettings />} />
          </Route>

          {/* Organizer Routes */}
          <Route element={<RoleRoute allowedRoles={['organizer', 'admin']} />}>
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/events" element={<Events />} />
            <Route path="/organizer/events/create" element={<CreateEvent />} />
            <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
            <Route path="/organizer/events/:id" element={<EventDetails />} />
            <Route path="/organizer/events/:id/registrations" element={<Attendees />} />
            <Route path="/organizer/events/:id/analytics" element={<Analytics />} />
            <Route path="/organizer/venues" element={<Venues />} />
            <Route path="/organizer/sessions" element={<Sessions />} />
            <Route path="/organizer/speakers" element={<Speakers />} />
            <Route path="/organizer/sponsors" element={<Sponsors />} />
            <Route path="/organizer/packages" element={<SponsorshipPackages />} />
            <Route path="/organizer/tickets" element={<Tickets />} />
            <Route path="/organizer/attendees" element={<Attendees />} />
            <Route path="/organizer/registrations" element={<Attendees />} />
            <Route path="/organizer/announcements" element={<Announcements />} />
            <Route path="/organizer/feedback" element={<Feedback />} />
            <Route path="/organizer/analytics" element={<Analytics />} />
            <Route path="/organizer/ai-studio" element={<AIStudio />} />
            <Route path="/organizer/settings" element={<OrganizerSettings />} />
            <Route path="/organizer/staff" element={<Staff />} />
          </Route>

          {/* Staff Routes */}
          <Route element={<RoleRoute allowedRoles={['staff', 'organizer', 'admin']} />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/checkin" element={<CheckIn />} />
            <Route path="/staff/session-attendance" element={<SessionAttendance />} />
            <Route path="/staff/support" element={<AttendeeSupport />} />
          </Route>

          {/* Speaker Routes */}
          <Route element={<RoleRoute allowedRoles={['speaker', 'organizer', 'admin']} />}>
            <Route path="/speaker/dashboard" element={<SpeakerDashboard />} />
            <Route path="/speaker/events" element={<SpeakerEvents />} />
            <Route path="/speaker/sessions" element={<MySessions />} />
            <Route path="/speaker/sessions/:sessionId" element={<SpeakerSessionDetails />} />
            <Route path="/speaker/materials" element={<Materials />} />
            <Route path="/speaker/availability" element={<Availability />} />
            <Route path="/speaker/profile" element={<SpeakerProfile />} />
            <Route path="/speaker/announcements" element={<SpeakerAnnouncements />} />
            <Route path="/speaker/settings" element={<SpeakerSettings />} />
          </Route>

          {/* Attendee Routes */}
          <Route element={<RoleRoute allowedRoles={['attendee', 'organizer', 'admin']} />}>
            <Route path="/attendee/dashboard" element={<AttendeeDashboard />} />
            <Route path="/attendee/browse" element={<BrowseEvents />} />
            <Route path="/attendee/events/:id" element={<AttendeeEventDetails />} />
            <Route path="/attendee/register/:eventId" element={<Registration />} />
            <Route path="/attendee/registrations" element={<MyRegistrations />} />
            <Route path="/attendee/tickets" element={<MyTickets />} />
            <Route path="/attendee/schedule" element={<MySchedule />} />
            <Route path="/attendee/sessions" element={<AttendeeMySessions />} />
            <Route path="/attendee/notifications" element={<AttendeeNotifications />} />
            <Route path="/attendee/qr-code" element={<MyQRCode />} />
            <Route path="/attendee/recommendations" element={<Recommendations />} />
            <Route path="/attendee/feedback" element={<AttendeeFeedback />} />
            <Route path="/attendee/settings" element={<AttendeeSettings />} />
          </Route>

          {/* Sponsor Routes */}
          <Route element={<RoleRoute allowedRoles={['sponsor', 'organizer', 'admin']} />}>
            <Route path="/sponsor/dashboard" element={<SponsorDashboard />} />
            <Route path="/sponsor/events" element={<SponsorEvents />} />
            <Route path="/sponsor/sponsorships" element={<Sponsorships />} />
            <Route path="/sponsor/sponsorships/:sponsorshipId" element={<SponsorshipDetails />} />
            <Route path="/sponsor/deliverables" element={<Deliverables />} />
            <Route path="/sponsor/profile" element={<SponsorProfile />} />
            <Route path="/sponsor/invoices" element={<PaymentsInvoices />} />
            <Route path="/sponsor/announcements" element={<SponsorAnnouncements />} />
            <Route path="/sponsor/settings" element={<SponsorSettings />} />
            <Route path="/sponsor/package" element={<Package />} />
            <Route path="/sponsor/brand-assets" element={<BrandAssets />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
