import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const DeliverableTracker = ({ deliverables = [], onUpdateStatus, canEdit = false }) => {
  if (deliverables.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
        No contractual deliverables assigned yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deliverables.map((item) => {
        const isDone = item.status === 'completed';
        return (
          <div
            key={item._id}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDone ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                {item.description && <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>}
                <span className="text-[10px] text-slate-400 block mt-1">
                  Due: {formatDate(item.dueDate)}
                </span>
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center space-x-2 shrink-0">
                <select
                  value={item.status}
                  onChange={(e) => onUpdateStatus && onUpdateStatus(item._id, e.target.value)}
                  className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DeliverableTracker;
