import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, IndianRupee, Activity } from 'lucide-react';
import { analyticsService } from '../../../services/api';

const OrganizerKPICards = () => {
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await analyticsService.getOrganizerDashboard();
        const data = res?.data?.summary || res?.summary || res?.data;
        if (data) {
          setMetrics({
            totalEvents: data.totalEvents || 0,
            upcomingEvents: data.upcomingEvents || 0,
            activeEvents: data.activeEvents || 0,
            totalRegistrations: data.totalRegistrations || 0,
            totalRevenue: data.totalRevenue || 0
          });
        }
      } catch (err) {
        console.error('Failed to load organizer dashboard KPIs:', err);
      }
    };
    fetchKPIs();
  }, []);

  const kpis = [
    {
      title: 'TOTAL EVENTS',
      value: String(metrics.totalEvents),
      trend: `${metrics.activeEvents} active now`,
      trendType: 'positive',
      icon: Calendar
    },
    {
      title: 'UPCOMING EVENTS',
      value: String(metrics.upcomingEvents),
      trend: 'Scheduled ahead',
      trendType: 'neutral',
      icon: Clock
    },
    {
      title: 'TOTAL REGISTRATIONS',
      value: Number(metrics.totalRegistrations).toLocaleString(),
      trend: 'Confirmed attendees',
      trendType: 'positive',
      icon: Users
    },
    {
      title: 'TOTAL REVENUE',
      value: `₹${Number(metrics.totalRevenue).toLocaleString()}`,
      trend: 'Ticket & sponsor sales',
      trendType: 'positive',
      icon: IndianRupee
    },
    {
      title: 'ACTIVE EVENTS',
      value: String(metrics.activeEvents),
      trend: 'Live today',
      trendType: 'active',
      icon: Activity
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="panel p-4 sm:p-5 hover:border-accent/40 transition-all flex flex-col justify-between min-w-0"
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                <div className="w-7 h-7 rounded-xl bg-bg text-muted flex items-center justify-center shrink-0 border border-line">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight my-2 truncate">
                {kpi.value}
              </p>
            </div>

            <div className="border-t border-line pt-2 mt-1">
              <span
                className={`text-[11px] font-semibold truncate block ${
                  kpi.trendType === 'positive'
                    ? 'text-teal'
                    : kpi.trendType === 'active'
                    ? 'text-accent font-bold'
                    : 'text-muted'
                }`}
              >
                {kpi.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrganizerKPICards;
