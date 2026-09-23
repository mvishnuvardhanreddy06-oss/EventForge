import React, { useState, useEffect } from 'react';
import { attendeePortalService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import {
  Settings,
  Bell,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Tag
} from 'lucide-react';

const AttendeeSettings = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Profile Details
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    timezone: 'Asia/Kolkata',
    language: 'English',
    interests: []
  });

  const [phoneError, setPhoneError] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState({
    emailScheduleUpdates: true,
    emailAnnouncements: true,
    emailFeedbackRequests: true,
    emailSpeakerMaterials: true,
    emailTicketPasses: true,
    smsCheckInReminder: true,
    smsEmergencyAlerts: false,
    marketingNewsletter: false
  });

  // Password
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await attendeePortalService.getSettings();
        if (res.data?.success && res.data.data.settings) {
          const s = res.data.data.settings;
          setProfile({
            name: s.name || '',
            email: s.email || '',
            phone: s.phone || '+91 98765 43210',
            location: s.location || 'Bengaluru, India',
            timezone: s.timezone || 'Asia/Kolkata',
            language: s.language || 'English',
            interests: s.interests || ['Artificial Intelligence', 'Cloud Computing']
          });
          if (s.notifications) {
            setNotifications(prev => ({ ...prev, ...s.notifications }));
          }
        }
      } catch (err) {
        console.error('Failed to load attendee settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const validatePhone = (phoneStr) => {
    if (!phoneStr) return true; // optional in settings
    const cleaned = phoneStr.replace(/[\s-]/g, '');
    const indianRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    return indianRegex.test(cleaned);
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validatePhone(profile.phone)) {
      setPhoneError('Please enter a valid Indian mobile number (e.g. +91 98765 43210).');
      return;
    } else {
      setPhoneError('');
    }

    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const res = await attendeePortalService.updateSettings({
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        timezone: profile.timezone,
        language: profile.language,
        interests: profile.interests,
        notifications
      });

      if (res.data?.success) {
        setProfileMsg({ type: 'success', text: 'Account settings & notification preferences saved!' });
      } else {
        setProfileMsg({ type: 'error', text: res.data?.message || 'Failed to save settings.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Error saving settings.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg({ type: '', text: '' });

    try {
      const res = await attendeePortalService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      if (res.data?.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMsg({ type: 'error', text: res.data?.message || 'Failed to update password.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Error updating password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'Type "DELETE" to permanently deactivate your attendee account. Your ticket passes and registration records will be cancelled.'
    );
    if (confirmation !== 'DELETE') return;

    try {
      await attendeePortalService.deleteAccount({ confirmText: 'DELETE' });
      alert('Your account has been deleted.');
      logout();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete account.');
    }
  };

  if (loading) return <Loader text="Loading your account settings..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendee Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal participant profile, verified phone contact, notification dispatch rules, and password.
        </p>
      </div>

      {profileMsg.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 ${
          profileMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {profileMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{profileMsg.text}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Personal Profile & Contact</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Indian Mobile Number */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Mobile Phone (India +91) *</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={profile.phone}
                onChange={(e) => {
                  setProfile({ ...profile, phone: e.target.value });
                  if (phoneError) setPhoneError('');
                }}
                className={`w-full p-2.5 rounded-xl border font-mono text-xs ${
                  phoneError ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                } focus:ring-2 focus:ring-blue-600 focus:outline-none`}
              />
              {phoneError && <p className="text-[11px] text-rose-600 font-semibold">{phoneError}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Location / City</label>
              <input
                type="text"
                placeholder="Bengaluru, India"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                <option value="America/New_York">America/New York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Preferred Language</label>
              <select
                value={profile.language}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* 8 Granular Notification Toggles */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-purple-600" />
            <span>Notification & Bulletin Preferences</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                key: 'emailScheduleUpdates',
                title: 'Schedule & Room Changes',
                desc: 'Instant notice if a session on your agenda changes room or time.'
              },
              {
                key: 'emailAnnouncements',
                title: 'Organizer Broadcast Announcements',
                desc: 'Important conference notices regarding registration, keynotes, or parking.'
              },
              {
                key: 'emailSpeakerMaterials',
                title: 'Speaker Presentation Slides Available',
                desc: 'Alert when keynote decks and code repositories become available.'
              },
              {
                key: 'emailFeedbackRequests',
                title: 'Post-Session Evaluation Requests',
                desc: 'Short evaluation prompts after you attend conference workshops.'
              },
              {
                key: 'emailTicketPasses',
                title: 'Digital Pass Wallet & Badges',
                desc: 'Badge issuance, QR ticket updates, and registration receipts.'
              },
              {
                key: 'smsCheckInReminder',
                title: 'SMS Rapid Check-in Reminders',
                desc: 'Direct SMS on event morning with entrance gate details.'
              },
              {
                key: 'smsEmergencyAlerts',
                title: 'On-Site Emergency Logistics Broadcasts',
                desc: 'Direct emergency SMS for facility notifications.'
              },
              {
                key: 'marketingNewsletter',
                title: 'EventForge Tech Summits Digest',
                desc: 'Upcoming technology conferences and early-bird discount codes.'
              }
            ].map((item) => (
              <div key={item.key} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">{item.title}</p>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={!!notifications[item.key]}
                    onChange={() => handleToggleNotification(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingProfile ? 'Saving...' : 'Save Profile Preferences'}</span>
          </button>
        </div>
      </form>

      {/* Password Change */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-emerald-600" />
          <span>Security & Password</span>
        </h3>

        {passwordMsg.text && (
          <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
            passwordMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {passwordMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Current Password *</label>
            <input
              type="password"
              required
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">New Password (Min 8 chars) *</label>
            <input
              type="password"
              required
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Confirm New Password *</label>
            <input
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPassword}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {savingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-rose-50/50 rounded-3xl border border-rose-200 p-6 space-y-3">
        <h3 className="text-sm font-bold text-rose-900 flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Danger Zone: Deactivate Account</span>
        </h3>
        <p className="text-xs text-rose-700 leading-relaxed">
          Deactivating your account will permanently void all your digital ticket badges and session registrations.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
        >
          Deactivate Attendee Account
        </button>
      </div>
    </div>
  );
};

export default AttendeeSettings;
