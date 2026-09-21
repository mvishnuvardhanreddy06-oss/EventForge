import React from 'react';
import { Users, Plus } from 'lucide-react';

const EmptyState = ({ onAddStaff }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-2xs max-w-lg mx-auto my-12 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-2xs">
        <Users className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-black text-slate-900 tracking-tight">
        No staff members added yet
      </h3>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
        Build your event operations team by adding staff members and assigning responsibilities.
      </p>
      <button
        type="button"
        onClick={onAddStaff}
        className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add Staff</span>
      </button>
    </div>
  );
};

export default EmptyState;
