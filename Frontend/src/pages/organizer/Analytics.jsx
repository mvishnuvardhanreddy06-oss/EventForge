import React, { useState, useEffect } from 'react';
import { analyticsService, eventService } from '../../services/api';
import Loader from '../../components/Loader';
import RegistrationChart from '../../components/RegistrationChart';
import AttendanceChart from '../../components/AttendanceChart';
import SessionPopularity from '../../components/SessionPopularity';
import SponsorAnalytics from '../../components/SponsorAnalytics';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3, Users, DollarSign, CheckCircle2 } from 'lucide-react';

const Analytics = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (eventId) => {
    try {
      const res = await analyticsService.getOrganizerStats(eventId);
      if (res.success) setAnalytics(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const id = evRes.data.events[0]._id;
          setSelectedEventId(id);
          await fetchAnalytics(id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    fetchAnalytics(id);
  };

  if (loading) return <Loader text="Compiling conference analytics..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Conference Analytics & Intelligence</h1>
          <p className="text-xs text-slate-500 mt-0.5">Deep metrics across attendance rates, ticket tier revenue, and session interest.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-bold text-slate-700">Select Event:</span>
        <select
          value={selectedEventId}
          onChange={handleEventChange}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Registrations</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{analytics?.totalRegistrations || 0}</p>
          <span className="text-[10px] text-blue-600 font-bold">{analytics?.confirmedRegistrations || 0} Confirmed</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Attendance Percentage</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{analytics?.attendanceRate || 0}%</p>
          <span className="text-[10px] text-slate-400 font-medium">{analytics?.checkIns || 0} Verified Check-ins</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Ticket Revenue</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(analytics?.totalRevenue || 0)}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Paid Registrations</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Average Attendee Rating</p>
          <p className="text-2xl font-black text-amber-500 mt-1">★ {analytics?.avgRating || '5.0'}</p>
          <span className="text-[10px] text-slate-400 font-medium">Delegate Satisfaction</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Ticket Tier Performance</h3>
          <p className="text-xs text-slate-400 mb-4">Sold quantity vs remaining capacity</p>
          <RegistrationChart tickets={analytics?.tickets || []} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Attendance Conversion Ratio</h3>
          <p className="text-xs text-slate-400 mb-4">Delegates checked in vs pending no-shows</p>
          <AttendanceChart checkIns={analytics?.checkIns || 0} confirmed={analytics?.confirmedRegistrations || 0} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Session Popularity Ranking</h3>
          <p className="text-xs text-slate-400 mb-4">Total attendees logged per breakout session</p>
          <SessionPopularity sessions={analytics?.sessions || []} />
        </div>

        <div>
          <SponsorAnalytics sponsorMetrics={analytics?.sponsorMetrics || {}} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
