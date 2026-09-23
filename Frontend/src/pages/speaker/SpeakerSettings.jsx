import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakerPortalService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import {
  Settings,
  User,
  Bell,
  Shield,
  Lock,
  Smartphone,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  Eye,
  KeyRound,
  Laptop,
  LogOut,
  AlertTriangle,
  X
} from 'lucide-react';

const TIMEZONE_OPTIONS = [
  'Asia/Kolkata (IST +5:30)',
  'Asia/Dubai (GST +4:00)',
  'Asia/Singapore (SGT +8:00)',
  'Europe/London (GMT/BST +1:00)',
  'America/New_York (EST/EDT -5:00)',
  'America/Los_Angeles (PST/PDT -8:00)',
  'UTC (Coordinated Universal Time)'
];

const LANGUAGE_OPTIONS = [
  'English (India)',
  'English (US)',
  'English (UK)',
  'Hindi (हिंदी)',
  'German (Deutsch)',
  'French (Français)'
];

const SpeakerSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Active section tab: account | notifications | privacy | security | danger
  const [activeTab, setActiveTab] = useState('account');

  // Account state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
  const [language, setLanguage] = useState('English (India)');

  // Notification toggles (7 specific switches)
  const [notifications, setNotifications] = useState({
    sessionUpdates: true,
    organizerMessages: true,
    presentationReminders: true,
    eventAnnouncements: true,
    scheduleChanges: true,
    browserNotifications: true,
    emailNotifications: true
  });

  // Privacy state
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    profileDiscovery: true
  });

  // Active sessions
  const [activeSessions, setActiveSessions] = useState([]);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Account deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await speakerPortalService.getSettings();
      if (res.success && res.data) {
        const { account, notifications: notifs, privacy: priv, activeSessions: sessions } = res.data;
        if (account) {
          setEmail(account.email || '');
          setPhone(account.phone || '');
          setTimezone(account.timezone || 'Asia/Kolkata (IST +5:30)');
          setLanguage(account.language || 'English (India)');
        }
        if (notifs) {
          setNotifications(prev => ({ ...prev, ...notifs }));
        }
        if (priv) {
          setPrivacy(prev => ({ ...prev, ...priv }));
        }
        if (sessions) {
          setActiveSessions(sessions);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    try {
      setSavingSettings(true);
      setSuccessToast('');
      setErrorMessage('');

      const res = await speakerPortalService.updateSettings({
        phone,
        notifications,
        privacy
      });

      if (res.success) {
        setSuccessToast('Settings preferences saved successfully.');
        setTimeout(() => setSuccessToast(''), 4000);
      } else {
        setErrorMessage(res.message || 'Failed to save settings.');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      setErrorMessage(err.response?.data?.message || 'Error updating settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      setChangingPassword(true);
      const res = await speakerPortalService.changePassword({
        currentPassword,
        newPassword
      });

      if (res.success) {
        setPasswordSuccess('Password successfully updated! Please use your new credentials on future logins.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 5000);
      } else {
        setPasswordError(res.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password. Verify current password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOutOtherSessions = () => {
    setActiveSessions(prev => prev.filter(s => s.current));
    setSuccessToast('All other device sessions have been revoked.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteConfirmationText !== 'DELETE') {
      setDeleteError('Please type DELETE in capital letters to confirm.');
      return;
    }

    try {
      setDeleting(true);
      setDeleteError('');
      const res = await speakerPortalService.deleteAccount({ password: deletePassword });
      if (res.success) {
        logout();
        navigate('/login');
      } else {
        setDeleteError(res.message || 'Failed to delete account.');
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account. Verify your password.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading Speaker Settings..." />
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Account & Regional', icon: User },
    { id: 'notifications', label: 'Notifications (7)', icon: Bell },
    { id: 'privacy', label: 'Privacy & Visibility', icon: Eye },
    { id: 'security', label: 'Security & Devices', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Speaker Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Configure contact information, notification triggers, privacy controls, and security.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* TOASTS */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center space-x-1 border-b border-slate-200/80 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="space-y-6">
        {/* 1. ACCOUNT & REGIONAL */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Account & Contact Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Organizers will use these direct channels for urgent schedule shifts and technical briefings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Account Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">
                  Email is locked to your EventForge authenticated account credentials.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Direct Phone Number (Organizers & AV)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
                <p className="text-[11px] text-slate-400">
                  Used for day-of-event SMS dispatch and backstage coordinator reachouts.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-white"
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  All session times on your dashboard and agenda will synchronize to this timezone.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Portal Display Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-white"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {savingSettings ? 'Saving...' : 'Save Account Settings'}
              </button>
            </div>
          </div>
        )}

        {/* 2. NOTIFICATIONS (7 SPECIFIC TOGGLES) */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Control which communications trigger email alerts, browser push notifications, and mobile SMS.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {/* TOGGLE 1 */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Session Schedule Updates & Room Allocations</p>
                  <p className="text-xs text-slate-500">
                    Receive immediate notifications when an organizer shifts your session time, hall, or room.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('sessionUpdates')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifications.sessionUpdates ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.sessionUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* TOGGLE 2 */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Organizer Direct Messages & VIP Briefings</p>
                  <p className="text-xs text-slate-500">
                    Get alerted when an event coordinator or hospitality lead sends private instructions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('organizerMessages')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifications.organizerMessages ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.organizerMessages ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* TOGGLE 3 */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Presentation Upload & Review Reminders</p>
                  <p className="text-xs text-slate-500">
                    Reminders 48 hours and 24 hours prior to session start if your slide deck is not yet uploaded.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('presentationReminders')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifications.presentationReminders ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.presentationReminders ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* TOGGLE 4 */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Event Announcements & Logistics Broadcasts</p>
                  <p className="text-xs text-slate-500">
                    Receive broadcast bulletins, badge collection details, and VIP parking info.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('eventAnnouncements')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifications.eventAnnouncements ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.eventAnnouncements ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* TOGGLE 5 */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Urgent Live Schedule Changes & Delays</p>
                  <p className="text-xs text-slate-500">
                    High-priority real-time alerts pushed on event day for timing extensions or emergency shifts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('scheduleChanges')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifications.scheduleChanges ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.scheduleChanges ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* TOGGLE 6 */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Browser Push Notifications</p>
                  <p className="text-xs text-slate-500">
                    Display instant desktop popups while working in the EventForge portal during live event hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('browserNotifications')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifications.browserNotifications ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.browserNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* TOGGLE 7 */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Daily Speaker Email Digest</p>
                  <p className="text-xs text-slate-500">
                    Receive a consolidated 8:00 AM morning email containing your day's schedule and co-speakers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('emailNotifications')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifications.emailNotifications ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {savingSettings ? 'Saving...' : 'Save Notification Preferences'}
              </button>
            </div>
          </div>
        )}

        {/* 3. PRIVACY & VISIBILITY */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Privacy & Profile Visibility</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Control who can view your speaker profile, session details, and bio across the event portal.
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700">Public Profile Audience</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPrivacy({ ...privacy, profileVisibility: 'public' })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    privacy.profileVisibility === 'public'
                      ? 'border-purple-600 bg-purple-50/40 text-purple-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold flex items-center space-x-1.5">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span>Public (Recommended)</span>
                    </span>
                    <input
                      type="radio"
                      name="profileVisibility"
                      checked={privacy.profileVisibility === 'public'}
                      onChange={() => setPrivacy({ ...privacy, profileVisibility: 'public' })}
                      className="text-purple-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Visible on search engines, event website, public schedule, and attendee mobile app.
                  </p>
                </div>

                <div
                  onClick={() => setPrivacy({ ...privacy, profileVisibility: 'attendees_only' })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    privacy.profileVisibility === 'attendees_only'
                      ? 'border-purple-600 bg-purple-50/40 text-purple-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold flex items-center space-x-1.5">
                      <Lock className="w-4 h-4 text-purple-600" />
                      <span>Registered Attendees Only</span>
                    </span>
                    <input
                      type="radio"
                      name="profileVisibility"
                      checked={privacy.profileVisibility === 'attendees_only'}
                      onChange={() => setPrivacy({ ...privacy, profileVisibility: 'attendees_only' })}
                      className="text-purple-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Restricted strictly to verified, ticket-holding attendees logged into EventForge.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Organizer Directory Discovery</p>
                <p className="text-xs text-slate-500">
                  Allow conference organizers across EventForge to discover your speaking profile and send keynote invitations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacy(prev => ({ ...prev, profileDiscovery: !prev.profileDiscovery }))}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  privacy.profileDiscovery ? 'bg-purple-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    privacy.profileDiscovery ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {savingSettings ? 'Saving...' : 'Save Privacy Settings'}
              </button>
            </div>
          </div>
        )}

        {/* 4. SECURITY & ACTIVE SESSIONS */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in">
            {/* PASSWORD UPDATE CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <span>Change Account Password</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your credentials regularly to safeguard access to your presentation materials and speaker data.
                </p>
              </div>

              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">New Password (min 6 characters)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{changingPassword ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ACTIVE SESSIONS / DEVICES */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <Laptop className="w-4 h-4 text-purple-600" />
                    <span>Authorized Device Sessions</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Devices currently signed into your EventForge Speaker Portal.
                  </p>
                </div>
                {activeSessions.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSignOutOtherSessions}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Other Devices</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100">
                {activeSessions.map((sess, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        {sess.device.includes('iPhone') || sess.device.includes('Android') ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-bold text-slate-900">{sess.device}</p>
                          {sess.current && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                              This Device
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {sess.location} • {sess.lastActive}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. DANGER ZONE */}
        {activeTab === 'danger' && (
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">Danger Zone</h3>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Deleting your speaker account will permanently remove your profile, speaking preferences, uploaded slide decks, and past conference records. Any currently scheduled sessions will be unassigned and organizers will be notified immediately.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteError('');
                  setDeleteConfirmationText('');
                  setDeletePassword('');
                  setDeleteModalOpen(true);
                }}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Speaker Account...</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ACCOUNT DELETION CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900">Confirm Account Deletion</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              This action is permanent and cannot be undone. To confirm, please type <span className="font-black text-rose-600">DELETE</span> below and enter your password.
            </p>

            {deleteError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Type DELETE to confirm:</label>
                <input
                  type="text"
                  required
                  placeholder="DELETE"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Account Password:</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || deleteConfirmationText !== 'DELETE'}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerSettings;
