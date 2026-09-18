import React, { useState } from 'react';
import {
  Users,
  Building2,
  Calendar,
  Ticket,
  BarChart3
} from 'lucide-react';
import AnalyticsKpiCard from '../../components/admin/analytics/AnalyticsKpiCard';
import DateRangeSelector from '../../components/admin/analytics/DateRangeSelector';
import AnalyticsFilterBar from '../../components/admin/analytics/AnalyticsFilterBar';
import PlatformGrowthChart from '../../components/admin/analytics/PlatformGrowthChart';
import UsersByRoleChart from '../../components/admin/analytics/UsersByRoleChart';
import EventsOverview from '../../components/admin/analytics/EventsOverview';
import RegistrationAttendanceChart from '../../components/admin/analytics/RegistrationAttendanceChart';
import SubscriptionDistribution from '../../components/admin/analytics/SubscriptionDistribution';
import ActiveOrganizations from '../../components/admin/analytics/ActiveOrganizations';
import AIUsageCard from '../../components/admin/analytics/AIUsageCard';
import PlatformInsights from '../../components/admin/analytics/PlatformInsights';
import ExportMenu from '../../components/admin/analytics/ExportMenu';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Filter dimensions
  const [orgFilter, setOrgFilter] = useState('All');
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  const handleClearFilters = () => {
    setOrgFilter('All');
    setEventTypeFilter('All');
    setPlanFilter('All');
    setRoleFilter('All');
  };

  const handleExportCSV = () => {
    const rows = [
      ['EVENTFORGE ENTERPRISE PLATFORM ANALYTICS REPORT', ''],
      ['Report Date Range', dateRange],
      ['Generated At', new Date().toLocaleString()],
      ['Scope', 'Platform-Wide Telemetry & Performance'],
      [''],
      ['KEY METRIC', 'VALUE', 'TREND VS PREVIOUS PERIOD'],
      ['Total Platform Users', '56', '+14.2%'],
      ['Tenant Organizations', '2 Active (5 Total)', '+5.4%'],
      ['Active Hosted Events', '5 Summits', '+20.1%'],
      ['Confirmed Registrations', '1,284', '+18.7%'],
      ['Overall Attendance Rate', '78.4%', '+6.2%'],
      ['Total AI Requests', '936', '+24.8%'],
      [''],
      ['USERS BY ROLE', 'ACCOUNTS', 'PERCENTAGE OF BASE'],
      ['Attendees', '31', '55.4%'],
      ['Sponsors', '11', '19.6%'],
      ['Speakers', '5', '8.9%'],
      ['Staff', '5', '8.9%'],
      ['Organizers', '3', '5.4%'],
      ['Platform Administrators', '1', '1.8%'],
      [''],
      ['ACTIVE TENANT RANKING', 'EVENTS HOSTED', 'REGISTRATIONS', 'ACTIVITY SHARE'],
      ['Apex Global Events', '12', '3,240', '42%'],
      ['Nexus Tech Summits', '8', '2,140', '31%'],
      ['TechWorld & CloudScale', '5', '1,820', '27%'],
      [''],
      ['CONFIDENTIAL & PROPRIETARY', 'EVENTFORGE ANALYTICS ENGINE', 'END OF REPORT']
    ];

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `eventforge-analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 pb-1">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight truncate">
              Analytics
            </h1>
            <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shrink-0">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Platform Telemetry</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
            Platform performance and usage insights across all tenant organizations.
          </p>
        </div>

        {/* Top-Right Controls */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <DateRangeSelector
            selectedRange={dateRange}
            onRangeChange={setDateRange}
          />
          <ExportMenu
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />
        </div>
      </div>

      {/* 2. Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        <AnalyticsKpiCard
          title="TOTAL USERS"
          value="56"
          trend="14.2%"
          trendDirection="up"
          comparison="vs previous period"
          icon={Users}
        />
        <AnalyticsKpiCard
          title="ORGANIZATIONS"
          value="2"
          trend="5.4%"
          trendDirection="up"
          comparison="vs previous period"
          icon={Building2}
        />
        <AnalyticsKpiCard
          title="ACTIVE EVENTS"
          value="5"
          trend="20.1%"
          trendDirection="up"
          comparison="vs previous period"
          icon={Calendar}
        />
        <AnalyticsKpiCard
          title="REGISTRATIONS"
          value="1,284"
          trend="18.7%"
          trendDirection="up"
          comparison="vs previous period"
          icon={Ticket}
        />
      </div>

      {/* 3. Advanced Filter Bar */}
      <AnalyticsFilterBar
        orgFilter={orgFilter}
        onOrgFilterChange={setOrgFilter}
        eventTypeFilter={eventTypeFilter}
        onEventTypeFilterChange={setEventTypeFilter}
        planFilter={planFilter}
        onPlanFilterChange={setPlanFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Platform Growth Chart (Full-Width) */}
      <PlatformGrowthChart dateRange={dateRange} />

      {/* 5. Two-Column Analytics: Users by Role & Events Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
        <UsersByRoleChart />
        <EventsOverview />
      </div>

      {/* 6. Registration & Attendance Trends (Full-Width with Attendance Gauge) */}
      <RegistrationAttendanceChart />

      {/* 7. Two-Column Lower Analytics: Subscription Distribution & Active Orgs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
        <SubscriptionDistribution />
        <ActiveOrganizations />
      </div>

      {/* 8. AI Usage Analytics (Full-Width) */}
      <AIUsageCard />

      {/* 9. Platform Insights (Full-Width) */}
      <PlatformInsights />
    </div>
  );
};

export default Analytics;
