import React from 'react';
import {
  Plus,
  Mail,
  Upload,
  Download,
  LayoutGrid,
  ListFilter,
  Clock,
  ChevronDown,
  Building2,
  Calendar,
  Send,
  UserCheck,
  UserX,
  X
} from 'lucide-react';
import ExportMenu from './ExportMenu';

const StaffToolbar = ({
  events = [],
  selectedEventId,
  onEventChange,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onOpenInviteModal,
  onOpenImportModal,
  selectedCount = 0,
  onClearSelection,
  onBulkAssign,
  onBulkCreateShift,
  onBulkSendMessage,
  onBulkExport,
  onBulkDeactivate,
  onExportFiltered
}) => {
  return (
    <div className="space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Event Staff</h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
              Operations Team
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your event team, roles, assignments and shifts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenImportModal}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
            title="Import staff via CSV or XLSX"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Import Staff</span>
          </button>

          <ExportMenu onExport={onExportFiltered} />

          <button
            type="button"
            onClick={onOpenInviteModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100/70 transition-colors shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Invite Staff</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Staff</span>
          </button>
        </div>
      </div>

      {/* Sub Toolbar: Event Selector + View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
        {/* Event Selector */}
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Event:</span>
          </span>
          <div className="relative min-w-[280px]">
            <select
              value={selectedEventId}
              onChange={(e) => onEventChange(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Events</option>
              {events.map((evt) => (
                <option key={evt._id} value={evt._id}>
                  {evt.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            (Current organization: Apex Global Events)
          </span>
        </div>

        {/* View Mode Toggle: Grid | List | Shifts */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 self-start md:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('shifts')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'shifts'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Shifts</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Banner (appears when 1+ selected) */}
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/90 border border-blue-200 px-4 py-2.5 rounded-2xl animate-fade-in shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold text-blue-900">
              {selectedCount} staff member{selectedCount > 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              onClick={onClearSelection}
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline ml-2"
            >
              Clear selection
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onBulkAssign}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-blue-800 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Assign</span>
            </button>
            <button
              type="button"
              onClick={onBulkCreateShift}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-blue-800 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-2xs"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Create Shift</span>
            </button>
            <button
              type="button"
              onClick={onBulkSendMessage}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-blue-800 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Send Message</span>
            </button>
            <button
              type="button"
              onClick={onBulkExport}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={onBulkDeactivate}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors shadow-2xs"
            >
              <UserX className="w-3.5 h-3.5 text-rose-600" />
              <span>Deactivate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffToolbar;
