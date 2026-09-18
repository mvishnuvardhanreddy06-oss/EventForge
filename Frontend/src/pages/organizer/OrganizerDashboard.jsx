import React from 'react';
import { useAuth } from '../../context/AuthContext';
import OrganizerHeader from '../../components/organizer/dashboard/OrganizerHeader';
import OrganizerKPICards from '../../components/organizer/dashboard/OrganizerKPICards';
import UpcomingEvents from '../../components/organizer/dashboard/UpcomingEvents';
import QuickActions from '../../components/organizer/dashboard/QuickActions';
import RegistrationOverview from '../../components/organizer/dashboard/RegistrationOverview';
import AttendanceSnapshot from '../../components/organizer/dashboard/AttendanceSnapshot';
import EventPerformance from '../../components/organizer/dashboard/EventPerformance';
import UpcomingSessions from '../../components/organizer/dashboard/UpcomingSessions';
import RecentRegistrations from '../../components/organizer/dashboard/RecentRegistrations';
import AIEventInsights from '../../components/organizer/dashboard/AIEventInsights';
import EventCalendar from '../../components/organizer/dashboard/EventCalendar';
import RecentActivity from '../../components/organizer/dashboard/RecentActivity';
import AttentionRequired from '../../components/organizer/dashboard/AttentionRequired';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const userName = user?.name || 'Vishnureddy';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 overflow-x-hidden min-w-0">
      {/* 1. Page Header with greeting & primary actions */}
      <OrganizerHeader userName={userName} />

      {/* 2. 5 Compact KPI Metrics */}
      <OrganizerKPICards />

      {/* 3. Row 1: Registration Overview (2/3) + Attendance Snapshot (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 min-w-0">
          <RegistrationOverview />
        </div>
        <div className="lg:col-span-4 min-w-0">
          <AttendanceSnapshot />
        </div>
      </div>

      {/* 4. Row 2: Upcoming Events with Capacity Bars (2/3) + AI Event Insights (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 min-w-0">
          <UpcomingEvents />
        </div>
        <div className="lg:col-span-4 min-w-0">
          <AIEventInsights />
        </div>
      </div>

      {/* 5. Row 3: Quick Action shortcuts */}
      <QuickActions />

      {/* 6. Row 4: Event Performance Comparison Table (2/3) + Upcoming Sessions Timeline (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 min-w-0">
          <EventPerformance />
        </div>
        <div className="lg:col-span-4 min-w-0">
          <UpcomingSessions />
        </div>
      </div>

      {/* 7. Row 5: Recent Registrations Stream (2/3) + Event Calendar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 min-w-0">
          <RecentRegistrations />
        </div>
        <div className="lg:col-span-4 min-w-0">
          <EventCalendar />
        </div>
      </div>

      {/* 8. Row 6: Recent Activity (1/2) + Attention Required (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 min-w-0">
          <RecentActivity />
        </div>
        <div className="lg:col-span-6 min-w-0">
          <AttentionRequired />
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
