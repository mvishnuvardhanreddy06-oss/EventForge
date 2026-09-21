import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { ROLE_PERMISSIONS } from '../../../services/staffService';

const PermissionsPanel = ({ role = 'Support Staff' }) => {
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Support Staff'];

  const formatPermissionLabel = (key) => {
    switch (key) {
      case 'canManageEventOperations':
        return 'Manage event operations';
      case 'canManageStaff':
        return 'Manage event staff team';
      case 'canManageSessions':
        return 'Manage sessions & stage flows';
      case 'canManageAttendees':
        return 'Manage attendees list';
      case 'canViewAnalytics':
        return 'View event analytics';
      case 'canViewAttendeeRegistration':
        return 'View attendee registration';
      case 'canCheckAttendeesIn':
        return 'Check attendees in & scan passes';
      case 'canSearchAttendee':
        return 'Search attendee directory';
      case 'canIssueBadges':
        return 'Issue & print attendee badges';
      case 'canViewSessions':
        return 'View event sessions';
      case 'canManageSessionStatus':
        return 'Update session live status';
      case 'canViewAssignedSpeakers':
        return 'View assigned session speakers';
      case 'canUpdateSessionAttendance':
        return 'Record room headcount';
      case 'canViewVenuesAndRooms':
        return 'View venue layouts & rooms';
      case 'canMonitorRoomCapacity':
        return 'Monitor room crowd limits';
      case 'canReportMaintenance':
        return 'Report facility maintenance';
      case 'canManageAVEquipment':
        return 'Manage stage AV hardware';
      case 'canMonitorNetworkStatus':
        return 'Monitor venue WiFi & NOC';
      case 'canAssistSpeakerTech':
        return 'Assist presenter slide switchers';
      case 'canControlStageScreens':
        return 'Control stage display walls';
      case 'canManageAudioFeeds':
        return 'Control live stage audio';
      case 'canRecordSessions':
        return 'Record session broadcast feeds';
      case 'canVerifyAccessBadges':
        return 'Verify security gates & passes';
      case 'canEnforceSafetyProtocols':
        return 'Enforce safety & fire exits';
      case 'canManageGateCrowds':
        return 'Manage entry queue marshals';
      case 'canAccessFirstAidKitLogs':
        return 'Maintain medical logs';
      case 'canLogEmergencyCases':
        return 'Log emergency incidents';
      case 'canRequestParamedicBackup':
        return 'Request ambulance dispatch';
      case 'canManageVIPLounge':
        return 'Manage VIP lounge access';
      case 'canCoordinateCatering':
        return 'Coordinate speaker catering';
      case 'canAssistSpeakersAndVIPs':
        return 'Assist keynote dignitaries';
      case 'canGuideAttendees':
        return 'Guide delegates across halls';
      case 'canDistributeSwagKits':
        return 'Distribute welcome kits';
      case 'canAssistSessionQueues':
        return 'Direct session queues';
      case 'canAnswerAttendeeQueries':
        return 'Answer attendee desk queries';
      case 'canAssistLostAndFound':
        return 'Manage lost and found depot';
      case 'canProvideHelpDeskSupport':
        return 'Provide general helpdesk service';
      case 'canEditEvent':
        return 'Edit event core configuration';
      case 'canManageSponsors':
        return 'Manage sponsors & packages';
      case 'canManagePayments':
        return 'Manage ticket payments & refunds';
      case 'canManageOrganization':
        return 'Manage organization profile';
      case 'canAccessPlatformAdmin':
        return 'Platform Admin superuser access';
      case 'canAccessBilling':
        return 'Organization billing & invoices';
      default:
        return key.replace(/([A-Z])/g, ' $1').toLowerCase();
    }
  };

  const allowedEntries = Object.entries(permissions).filter(([_, isAllowed]) => isAllowed);
  const disallowedEntries = Object.entries(permissions).filter(([_, isAllowed]) => !isAllowed);

  return (
    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Role Permissions: {role}
          </h4>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
          Role-Based Scope
        </span>
      </div>

      <div className="space-y-2">
        {/* Granted Permissions */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            Authorized Capabilities
          </p>
          <div className="grid grid-cols-1 gap-1">
            {allowedEntries.map(([key]) => (
              <div key={key} className="flex items-center space-x-2 text-xs text-slate-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="font-medium">{formatPermissionLabel(key)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Restricted / Denied Permissions */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
          <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
            Restricted Operations
          </p>
          <div className="grid grid-cols-1 gap-1">
            {disallowedEntries.map(([key]) => (
              <div key={key} className="flex items-center space-x-2 text-xs text-slate-500">
                <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{formatPermissionLabel(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-start space-x-2 p-2.5 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-500">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          Staff accounts are strictly role-scoped. They cannot access Platform Admin, organization billing, or financial ledger data.
        </p>
      </div>
    </div>
  );
};

export default PermissionsPanel;
