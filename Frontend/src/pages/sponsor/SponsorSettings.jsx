import React, { useState, useEffect } from 'react';
import { sponsorPortalService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import {
  Settings,
  Bell,
  Lock,
  Shield,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound
} from 'lucide-react';

const SponsorSettings = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });

  // Notification & Privacy state
  const [settings, setSettings] = useState({
    notifications: {
      emailDeliverableDeadlines: true,
      emailDeliverableReview: true,
      emailInvoices: true,
      emailAnnouncements: true,
      emailLeadReports: true,
      emailScheduleChanges: true,
      smsUrgentAlerts: false,
      marketingNewsletter: false
    },
    privacy: {
      showContactPerson: true,
      showDirectPhone: false,
      profilePublic: true
    }
  });

  // Password state
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
        const res = await sponsorPortalService.getSettings();
        if (res.data?.success && res.data.data.settings) {
          const s = res.data.data.settings;
          setSettings({
            notifications: {
              ...settings.notifications,
              ...(s.notifications || {})
            },
            privacy: {
              ...settings.privacy,
              ...(s.privacy || {})
            }
          });
        }
      } catch (err) {
        console.error('Failed to load sponsor settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleNotification = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleTogglePrivacy = (key) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg({ type: '', text: '' });

    try {
      const res = await sponsorPortalService.updateSettings(settings);
      if (res.data?.success) {
        setSettingsMsg({ type: 'success', text: 'Communication preferences saved successfully!' });
      } else {
        setSettingsMsg({ type: 'error', text: res.data?.message || 'Failed to save settings.' });
      }
    } catch (err) {
      setSettingsMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Error saving settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg({ type: '', text: '' });

    try {
      const res = await sponsorPortalService.changePassword({
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
      'Type "DELETE" to permanently deactivate your sponsor portal access. This action cannot be undone.'
    );
    if (confirmation !== 'DELETE') return;

    try {
      await sponsorPortalService.deleteAccount({ confirmText: 'DELETE' });
      alert('Your corporate sponsor profile has been deactivated.');
      logout();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to deactivate account.');
    }
  };

  if (loading) return <Loader text="Loading your account preferences..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sponsor Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure notification dispatch frequencies, directory privacy controls, and portal security credentials.
        </p>
      </div>

      {/* Notifications & Privacy Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {settingsMsg.text && (
          <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 ${
            settingsMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {settingsMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{settingsMsg.text}</span>
          </div>
        )}

        {/* 8 Granular Notification Toggles */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Communication & Alert Preferences</span>
          </h3>

          <p className="text-xs text-slate-500">
            Select which contractual updates and event milestone alerts should be delivered to your registered corporate email.
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                key: 'emailDeliverableDeadlines',
                title: 'Deliverable Due Dates & Reminders',
                desc: 'Alert me 7 days and 48 hours prior to asset deadline expirations.'
              },
              {
                key: 'emailDeliverableReview',
                title: 'Organizer Asset Reviews & Feedback',
                desc: 'Instant notice when an organizer approves an asset or requests revisions.'
              },
              {
                key: 'emailInvoices',
                title: 'Billing & Invoice Notifications',
                desc: 'Electronic receipts, settlement confirmation, and tax invoice copies.'
              },
              {
                key: 'emailAnnouncements',
                title: 'General Organizer Bulletins',
                desc: 'Broadcast notices regarding schedule adjustments or stage updates.'
              },
              {
                key: 'emailLeadReports',
                title: 'Post-Event Lead Reports',
                desc: 'Aggregated summaries of booth engagement and attendee interest scans.'
              },
              {
                key: 'emailScheduleChanges',
                title: 'Live Agenda & Stage Changes',
                desc: 'Notifications if your sponsored keynote or stage time shifts.'
              },
              {
                key: 'smsUrgentAlerts',
                title: 'On-Site Urgent SMS Broadcasts',
                desc: 'Direct SMS to your registered phone for immediate on-site logistics.'
              },
              {
                key: 'marketingNewsletter',
                title: 'EventForge Industry Insights',
                desc: 'Quarterly conferences, early-bird sponsorship opportunities, and platform news.'
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
                    checked={!!settings.notifications[item.key]}
                    onChange={() => handleToggleNotification(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Directory Privacy */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Exhibitor Directory & Public Visibility</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Public Sponsor Profile Active</p>
                <p className="text-[11px] text-slate-500">Allow your logo, bio, and website to appear in public summit directories.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.privacy.profilePublic}
                onChange={() => handleTogglePrivacy('profilePublic')}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Display Contact Representative Name</p>
                <p className="text-[11px] text-slate-500">List primary contact name on public conference partner page.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.privacy.showContactPerson}
                onChange={() => handleTogglePrivacy('showContactPerson')}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Display Direct Contact Phone</p>
                <p className="text-[11px] text-slate-500">Allow attendees and exhibitors to see direct phone contact.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.privacy.showDirectPhone}
                onChange={() => handleTogglePrivacy('showDirectPhone')}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? 'Saving...' : 'Save Communication Preferences'}</span>
          </button>
        </div>
      </form>

      {/* Password & Security */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-emerald-600" />
          <span>Security & Authentication</span>
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
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-rose-50/50 rounded-3xl border border-rose-200 p-6 space-y-3">
        <h3 className="text-sm font-bold text-rose-900 flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Danger Zone: Deactivate Portal Access</span>
        </h3>
        <p className="text-xs text-rose-700 leading-relaxed">
          Deactivating your corporate sponsor profile will revoke access to all upcoming event materials, invoice histories, and deliverable tracking. Active sponsorship contracts will require manual coordinator mediation.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
        >
          Deactivate Sponsor Account
        </button>
      </div>
    </div>
  );
};

export default SponsorSettings;
