import React from 'react';
import {
  Send,
  MailCheck,
  Eye,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const InvitationTrackingCard = ({
  speaker,
  onResendInvite,
  onViewInvitation
}) => {
  const invitation = speaker.invitation || {
    sentAt: 'Sep 12, 2026, 09:30 AM',
    sentBy: 'Vishnureddy (Apex Global Events)',
    openedAt: 'Sep 12, 2026, 11:15 AM',
    responseAt: speaker.status === 'confirmed' ? 'Sep 14, 2026, 02:20 PM' : null,
    deliveryStatus: speaker.status === 'confirmed' ? 'Accepted' : speaker.status === 'declined' ? 'Declined' : 'Opened',
    lastResentAt: null
  };

  const steps = [
    {
      label: 'Invitation Sent',
      time: invitation.sentAt,
      completed: true,
      icon: Send,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      label: 'Email Opened',
      time: invitation.openedAt || 'Delivered to inbox',
      completed: !!invitation.openedAt || speaker.status === 'confirmed',
      icon: Eye,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      label: speaker.status === 'declined' ? 'Invitation Declined' : 'Speaker Accepted',
      time: invitation.responseAt || (speaker.status === 'pending' ? 'Awaiting response' : null),
      completed: speaker.status === 'confirmed' || speaker.status === 'declined',
      icon: speaker.status === 'declined' ? AlertCircle : CheckCircle2,
      color: speaker.status === 'declined'
        ? 'text-rose-600 bg-rose-50 border-rose-200'
        : speaker.status === 'confirmed'
        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
        : 'text-slate-400 bg-slate-50 border-slate-200'
    }
  ];

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <MailCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Invitation Delivery & Response
          </h4>
        </div>

        {speaker.status !== 'confirmed' && (
          <button
            type="button"
            onClick={() => onResendInvite?.(speaker)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 rounded-lg border border-blue-200/80 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Resend Invite</span>
          </button>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${
                step.completed ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-50/30 border-dashed border-slate-200'
              } flex items-start space-x-2.5`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 border ${
                  step.completed ? step.color : 'text-slate-300 bg-slate-100 border-slate-200'
                }`}
              >
                <StepIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-bold truncate ${
                    step.completed ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {step.time || 'Pending'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invitation Metadata */}
      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Sent to: <strong className="text-slate-800">{speaker.email || 'speaker@example.com'}</strong></span>
        </div>
        <div>
          <span>Delivery: <strong className="text-emerald-700">Delivered (100% reach)</strong></span>
        </div>
      </div>
    </div>
  );
};

export default InvitationTrackingCard;
