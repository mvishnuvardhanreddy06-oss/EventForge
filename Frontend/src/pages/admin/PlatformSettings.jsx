import React, { useState, useMemo } from 'react';
import { RotateCcw, Check, Save } from 'lucide-react';
import SettingsNavigation from '../../components/admin/settings/SettingsNavigation';
import GeneralSettings from '../../components/admin/settings/GeneralSettings';
import SecuritySettings from '../../components/admin/settings/SecuritySettings';
import UserRoleSettings from '../../components/admin/settings/UserRoleSettings';
import NotificationSettings from '../../components/admin/settings/NotificationSettings';
import EventSettings from '../../components/admin/settings/EventSettings';
import AISettings from '../../components/admin/settings/AISettings';
import EmailSettings from '../../components/admin/settings/EmailSettings';
import SystemSettings from '../../components/admin/settings/SystemSettings';
import DangerZone from '../../components/admin/settings/DangerZone';
import ConfirmationModal from '../../components/admin/settings/ConfirmationModal';
import ToastNotification from '../../components/admin/settings/ToastNotification';

const INITIAL_SETTINGS = {
  // General
  platformName: 'EventForge',
  platformDescription: 'Enterprise Corporate Event & Conference Management Platform',
  defaultLanguage: 'English',
  timezone: 'Asia/Kolkata (IST)',
  dateFormat: 'DD/MM/YYYY',
  defaultCurrency: 'INR',
  maintenanceMode: false,

  // Security
  sessionTimeout: '30 minutes',
  minPasswordLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  allow2FA: false,
  rateLimitLogins: true,
  auditLogging: true,

  // Users & Roles
  allowRegistration: true,
  requireEmailVerification: true,
  defaultUserStatus: 'Pending',
  availableRoles: ['organizer', 'staff', 'speaker', 'sponsor', 'attendee'],

  // Notifications
  enableEmailNotifications: true,
  notifyNewUserRegistration: true,
  notifyOrganizationCreated: true,
  notifySubscriptionChanges: true,
  notifySecurityAlerts: true,
  notifyEventActivity: true,
  notifySystemAnnouncements: true,

  // Events
  defaultEventVisibility: 'Private',
  allowEventRegistration: true,
  allowWaitlist: true,
  allowEventCancellation: true,
  requireOrganizerApproval: false,
  maxEventCapacity: 1000,
  defaultEventDuration: '2 hours',
  timezoneHandling: 'Use Organization Timezone',

  // AI & Intelligence
  masterAIFeatures: true,
  aiContentGeneration: true,
  sessionRecommendations: true,
  aiEventInsights: true,
  aiSummaries: true,
  aiUsageTracking: true,
  enforceAIUsageLimits: true,

  // Email
  emailSenderName: 'EventForge',
  emailSenderAddress: 'noreply@eventforge.io',
  emailReplyTo: 'support@eventforge.io',
  emailProvider: 'SMTP'
};

const PlatformSettings = () => {
  const [activeCategory, setActiveCategory] = useState('GENERAL');
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(INITIAL_SETTINGS);
  const [lastSystemCheck, setLastSystemCheck] = useState('Just now');
  const [toast, setToast] = useState(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState(null);
  const [pendingCategory, setPendingCategory] = useState(null);

  // Dirty State Detection
  const isDirty = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings);
  }, [settings, savedSettings]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setSavedSettings(settings);
    showToast('✓ Settings saved successfully.');
  };

  const handleResetToDefaults = () => {
    setModalConfig({
      title: 'Reset to Defaults',
      message: 'Are you sure you want to restore all platform configuration settings to system defaults? Any unsaved changes will be lost.',
      confirmText: 'Reset to Defaults',
      isDanger: false,
      onConfirm: () => {
        setSettings(INITIAL_SETTINGS);
        setSavedSettings(INITIAL_SETTINGS);
        setModalConfig(null);
        showToast('✓ Settings restored to system defaults.');
      }
    });
  };

  const handleCategorySelect = (newCategory) => {
    if (newCategory === activeCategory) return;

    if (isDirty) {
      setPendingCategory(newCategory);
      setModalConfig({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes in the current section. Are you sure you want to leave without saving?',
        confirmText: 'Leave',
        cancelText: 'Stay',
        isDanger: true,
        onConfirm: () => {
          setSettings(savedSettings);
          setActiveCategory(newCategory);
          setPendingCategory(null);
          setModalConfig(null);
        }
      });
    } else {
      setActiveCategory(newCategory);
    }
  };

  const handleTestEmail = () => {
    showToast('✓ Test email dispatched to mvishnuvardhanreddy33@gmail.com.');
  };

  const handleRunSystemCheck = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSystemCheck(`Today at ${timeStr} · All systems healthy`);
    showToast('✓ System diagnostic completed: all clusters operational.');
  };

  const handleResetCache = () => {
    setModalConfig({
      title: 'Reset Platform Cache',
      message: 'Are you sure you want to purge all platform cache? This will clear Redis session buffers and regenerate templates.',
      confirmText: 'Reset Cache',
      isDanger: true,
      onConfirm: () => {
        setModalConfig(null);
        showToast('✓ Platform cache purged successfully.');
      }
    });
  };

  const handleResetDemoData = () => {
    setModalConfig({
      title: 'Reset Demo Data',
      message: 'Are you sure? This will remove demo/test data from the platform. Active production organizations will not be affected.',
      confirmText: 'Reset Demo Data',
      isDanger: true,
      onConfirm: () => {
        setModalConfig(null);
        showToast('✓ Demo data reset initiated successfully.');
      }
    });
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6 min-w-0 overflow-x-hidden">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
              Platform Settings
            </h1>
            {isDirty && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 uppercase">
                Unsaved changes
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage global EventForge configuration and platform behavior.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 2. Settings Layout: Two Columns (Navigation Left, Content Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Category Navigation */}
        <div className="lg:col-span-1">
          <SettingsNavigation
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Right Column: Active Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeCategory === 'GENERAL' && (
            <GeneralSettings
              settings={settings}
              onChange={handleSettingChange}
              onSave={handleSave}
            />
          )}

          {activeCategory === 'SECURITY' && (
            <SecuritySettings
              settings={settings}
              onChange={handleSettingChange}
              onSave={handleSave}
            />
          )}

          {activeCategory === 'USERS_ROLES' && (
            <UserRoleSettings
              settings={settings}
              onChange={handleSettingChange}
              onSave={handleSave}
            />
          )}

          {activeCategory === 'NOTIFICATIONS' && (
            <NotificationSettings
              settings={settings}
              onChange={handleSettingChange}
              onSave={handleSave}
            />
          )}

          {activeCategory === 'EVENTS' && (
            <EventSettings
              settings={settings}
              onChange={handleSettingChange}
              onSave={handleSave}
            />
          )}

          {activeCategory === 'AI_INTELLIGENCE' && (
            <AISettings
              settings={settings}
              onChange={handleSettingChange}
              onSave={handleSave}
            />
          )}

          {activeCategory === 'EMAIL' && (
            <EmailSettings
              settings={settings}
              onChange={handleSettingChange}
              onSave={handleSave}
              onTestEmail={handleTestEmail}
            />
          )}

          {activeCategory === 'SYSTEM' && (
            <div className="space-y-6">
              <SystemSettings
                lastSystemCheck={lastSystemCheck}
                onRunSystemCheck={handleRunSystemCheck}
                onSave={handleSave}
              />
              <DangerZone
                onResetCache={handleResetCache}
                onResetDemoData={handleResetDemoData}
              />
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalConfig && (
        <ConfirmationModal
          isOpen={Boolean(modalConfig)}
          onClose={() => setModalConfig(null)}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          isDanger={modalConfig.isDanger}
        />
      )}

      {/* Floating Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default PlatformSettings;
