import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService, attendanceService } from '../../services/api';
import Loader from '../../components/Loader';
import { QrCode, Clock, Users, ArrowRight } from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getAll({ status: 'published' });
        if (res.success) setEvents(res.data.events || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // If accessed by an Event Organizer, redirect to Organizer Staff Management page
  if (user?.role === 'organizer') {
    return <Navigate to="/organizer/staff" replace />;
  }

  if (loading) return <Loader text="Loading staff portal..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-ink tracking-tight">Event Staff Operations</h1>
        <p className="text-xs text-muted mt-0.5">Scan attendee badges, track room sessions, and verify delegate passes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="panel bg-gradient-to-tr from-accent/15 via-surface to-surface flex flex-col justify-between">
          <div>
            <div className="p-3 bg-accent/10 text-accent rounded-2xl w-fit mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-ink leading-tight mb-1">Rapid QR Badge Check-In</h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Scan digital QR codes presented on mobile devices or printed badges for instant event entry.
            </p>
          </div>
          <Link
            to="/staff/checkin"
            className="btn-primary inline-flex items-center justify-center space-x-2 px-5 py-3 text-xs font-bold w-full sm:w-fit"
          >
            <span>Launch QR Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="panel flex flex-col justify-between">
          <div>
            <div className="p-3 bg-teal/10 text-teal rounded-2xl w-fit mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-ink leading-tight mb-1">Session Attendance Tracking</h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Record attendance at individual breakout rooms, workshops, and keynote halls.
            </p>
          </div>
          <Link
            to="/staff/session-attendance"
            className="btn inline-flex items-center justify-center space-x-2 px-5 py-3 text-xs font-bold w-full sm:w-fit"
          >
            <span>Track Sessions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
