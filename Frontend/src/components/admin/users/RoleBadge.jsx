import React from 'react';
import {
  Shield,
  Building2,
  ClipboardCheck,
  Mic,
  Handshake,
  Ticket
} from 'lucide-react';

const ROLE_CONFIGS = {
  admin: {
    label: 'Platform Admin',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/70',
    icon: Shield
  },
  organizer: {
    label: 'Organizer',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/70',
    icon: Building2
  },
  staff: {
    label: 'Staff',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200/70',
    icon: ClipboardCheck
  },
  speaker: {
    label: 'Speaker',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200/70',
    icon: Mic
  },
  sponsor: {
    label: 'Sponsor',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/70',
    icon: Handshake
  },
  attendee: {
    label: 'Attendee',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200/70',
    icon: Ticket
  }
};

const RoleBadge = ({ role }) => {
  const normalized = (role || 'attendee').toLowerCase().replace('platform admin', 'admin');
  const config = ROLE_CONFIGS[normalized] || ROLE_CONFIGS.attendee;
  const IconComp = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${config.bg} ${config.text} ${config.border} shadow-2xs select-none`}>
      <IconComp className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default RoleBadge;
