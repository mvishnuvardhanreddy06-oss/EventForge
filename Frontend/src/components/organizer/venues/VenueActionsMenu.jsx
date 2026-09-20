import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Eye,
  Edit2,
  Copy,
  Wrench,
  PauseCircle,
  AlertCircle
} from 'lucide-react';

const VenueActionsMenu = ({
  venue,
  onViewDetails,
  onEdit,
  onDuplicate,
  onToggleMaintenance,
  onDeactivate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isBooked = venue.status === 'booked' || Boolean(venue.currentEvent);

  const handleAction = (callback) => {
    setIsOpen(false);
    callback?.();
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
        title="More Actions"
        aria-label="More Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-1.5 w-52 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 border border-slate-100 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleAction(() => onViewDetails(venue))}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-colors text-left"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>View Details</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(() => onEdit(venue))}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-colors text-left"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit Venue</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(() => onDuplicate(venue))}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-colors text-left"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Duplicate Venue</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(() => onToggleMaintenance(venue))}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-xl transition-colors text-left"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {venue.status === 'maintenance' ? 'Exit Maintenance' : 'Set Maintenance'}
              </span>
            </button>

            <div className="my-1 border-t border-slate-100" />

            <button
              type="button"
              onClick={() => handleAction(() => onDeactivate(venue))}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left ${
                isBooked
                  ? 'text-slate-400 hover:bg-slate-50'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
              title={
                isBooked
                  ? 'This venue is currently assigned to an event.'
                  : 'Deactivate Venue'
              }
            >
              {isBooked ? (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <PauseCircle className="w-3.5 h-3.5 text-rose-500" />
              )}
              <div className="flex-1">
                <span>Deactivate Venue</span>
                {isBooked && (
                  <span className="block text-[10px] text-amber-600 font-normal">
                    Currently Booked
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueActionsMenu;
