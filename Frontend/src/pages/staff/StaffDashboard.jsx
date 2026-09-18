import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService, attendanceService } from '../../services/api';
import Loader from '../../components/Loader';
import { QrCode, Clock, Users, ArrowRight } from 'lucide-react';

const StaffDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getAll({ status: 'published' });
        if (res.success) setEvents(res.data.events);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <Loader text="Loading staff portal..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Event Staff Operations</h1>
        <p className="text-xs text-slate-500 mt-0.5">Scan attendee badges, track room sessions, and verify delegate passes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4 backdrop-blur-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black leading-tight mb-1">Rapid QR Badge Check-In</h3>
            <p className="text-xs text-blue-100 leading-relaxed mb-6">
              Scan digital QR codes presented on mobile devices or printed badges for instant event entry.
            </p>
          </div>
          <Link
            to="/staff/checkin"
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-white text-blue-600 font-bold text-xs rounded-xl shadow-lg hover:bg-blue-50 transition-colors w-full sm:w-fit"
          >
            <span>Launch QR Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">Session Attendance Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Record attendance at individual breakout rooms, workshops, and keynote halls.
            </p>
          </div>
          <Link
            to="/staff/session-attendance"
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors w-full sm:w-fit"
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
