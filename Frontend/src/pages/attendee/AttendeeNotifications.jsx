import React, { useState, useEffect } from 'react';
import { attendeePortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Info,
  Calendar,
  CreditCard,
  Clock,
  Megaphone
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const AttendeeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchNotifications = async () => {
    try {
      const res = await attendeePortalService.getNotifications();
      if (res.data?.success) {
        setNotifications(res.data.data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await attendeePortalService.markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await attendeePortalService.markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  if (loading) return <Loader text="Loading your notifications..." />;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'alert') return n.type === 'alert' || n.type === 'warning';
    return true;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications & Announcements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time conference notices, door schedule updates, room capacity alerts, and digital pass alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: `All Notices (${notifications.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'alert', label: 'Urgent Alerts' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab.key
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No notifications to display</p>
          <p className="text-xs text-slate-400">You are all caught up with your conference alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                item.read
                  ? 'bg-white border-slate-200'
                  : 'bg-blue-50/40 border-blue-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start space-x-3.5 flex-1">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  item.type === 'alert'
                    ? 'bg-rose-100 text-rose-700'
                    : item.type === 'payment'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.type === 'alert' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : item.type === 'payment' ? (
                    <CreditCard className="w-4 h-4" />
                  ) : (
                    <Megaphone className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="New" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  <p className="text-[10px] text-slate-400 pt-0.5">{formatDate(item.createdAt)}</p>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => handleMarkRead(item._id)}
                  title="Mark as Read"
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg border border-slate-200 transition-colors shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendeeNotifications;
