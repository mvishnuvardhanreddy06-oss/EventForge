import React from 'react';
import {
  Sliders,
  Shield,
  Users,
  Bell,
  Calendar,
  Sparkles,
  Mail,
  Server
} from 'lucide-react';

export const SETTING_CATEGORIES = [
  { id: 'GENERAL', label: 'General', icon: Sliders, description: 'Branding, timezone & locale' },
  { id: 'SECURITY', label: 'Security', icon: Shield, description: 'Authentication & access policies' },
  { id: 'USERS_ROLES', label: 'Users & Roles', icon: Users, description: 'Registration & permissions' },
  { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell, description: 'Email alerts & system triggers' },
  { id: 'EVENTS', label: 'Events', icon: Calendar, description: 'Defaults & capacity rules' },
  { id: 'AI_INTELLIGENCE', label: 'AI & Intelligence', icon: Sparkles, description: 'Gemini generative features' },
  { id: 'EMAIL', label: 'Email', icon: Mail, description: 'SMTP server & senders' },
  { id: 'SYSTEM', label: 'System', icon: Server, description: 'Diagnostics & maintenance' }
];

const SettingsNavigation = ({ activeCategory, onSelectCategory }) => {
  return (
    <div>
      {/* Mobile Selector Dropdown */}
      <div className="lg:hidden mb-5">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Select Category
        </label>
        <select
          value={activeCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {SETTING_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Vertical Menu */}
      <nav className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs space-y-1">
        <div className="px-3 pt-2 pb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Settings Menu
          </span>
        </div>
        {SETTING_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                isActive
                  ? 'bg-blue-50/80 text-blue-700 font-bold border-l-[3px] border-blue-600 rounded-l-none'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <div className="min-w-0">
                <span className="text-xs block truncate leading-tight">
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-400 block truncate font-normal mt-0.5">
                  {cat.description}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsNavigation;
