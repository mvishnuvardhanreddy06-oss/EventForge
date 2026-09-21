import React from 'react';
import { X, AlertTriangle, UserX, ShieldAlert, CheckCircle2 } from 'lucide-react';

const DeactivateStaffModal = ({
  isOpen,
  staff,
  onClose,
  onConfirmDeactivate,
  onReviewAssignments
}) => {
  if (!isOpen || !staff) return null;

  const fullName = `${staff.firstName} ${staff.lastName}`;
  const assignmentsCount = staff.assignments?.length || (staff.currentAssignment ? 1 : 0);
  const hasActiveAssignments = assignmentsCount > 0;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up">
        {/* Header */}
        <div
          className={`p-5 border-b flex items-start justify-between ${
            hasActiveAssignments
              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
              : 'bg-rose-50/80 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-2xl border ${
                hasActiveAssignments
                  ? 'bg-amber-100 text-amber-700 border-amber-300'
                  : 'bg-rose-100 text-rose-700 border-rose-300'
              }`}
            >
              {hasActiveAssignments ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <UserX className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black">
                {hasActiveAssignments ? 'Active Assignments' : 'Deactivate Staff?'}
              </h3>
              <p className="text-xs opacity-80">{fullName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          {hasActiveAssignments ? (
            /* Has active assignments case */
            <div className="space-y-3">
              <p className="text-slate-700 font-medium leading-relaxed">
                This staff member currently has <strong className="text-amber-800 font-bold">{assignmentsCount} active assignment{assignmentsCount > 1 ? 's' : ''}</strong>:
              </p>

              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Active Responsibilities
                </span>
                {staff.assignments && staff.assignments.length > 0 ? (
                  staff.assignments.map((asg, i) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-800 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{asg.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center space-x-2 text-slate-800 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{staff.currentAssignment || 'Main Hall'}</span>
                  </div>
                )}
              </div>

              <p className="text-slate-600">
                Please reassign them before deactivation to ensure uninterrupted event floor coverage.
              </p>
            </div>
          ) : (
            /* No active assignments case */
            <div className="space-y-2">
              <p className="text-slate-700 leading-relaxed font-medium">
                This staff member will no longer be available for new assignments.
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-500 text-[11px]">
                <p>Status will change to <strong>Inactive</strong>.</p>
                <p className="mt-0.5">Historical session records and past check-ins will remain preserved.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
          {hasActiveAssignments ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReviewAssignments(staff);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
              >
                Review Assignments
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmDeactivate(staff);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
              >
                Deactivate
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeactivateStaffModal;
